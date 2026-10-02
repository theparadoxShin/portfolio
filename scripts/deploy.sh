#!/usr/bin/env bash
# Builds a Vite site and publishes it to its S3 bucket + CloudFront.
# Source of truth: backend/infra/scripts/publish-site.sh (only SITE_STACK differs).
#   npm run deploy
set -euo pipefail

SITE_STACK="${SITE_STACK:-daemon-craft-site-portfolio}"
BACKEND_STACK="${BACKEND_STACK:-daemon-craft-backend-prod}"
export AWS_PROFILE="${AWS_PROFILE:-ceo}"
export AWS_REGION="${AWS_REGION:-ca-central-1}"
export AWS_DEFAULT_REGION="$AWS_REGION"
export AWS_PAGER=""
export MSYS_NO_PATHCONV=1

out() {
  local v
  v=$(aws cloudformation describe-stacks --stack-name "$1" \
    --query "Stacks[0].Outputs[?OutputKey=='$2'].OutputValue | [0]" --output text 2>/dev/null | tr -d '\r') || true
  [[ "$v" == "None" ]] && v=""
  printf '%s' "$v"
}

BUCKET=$(out "$SITE_STACK" BucketName)
DIST=$(out "$SITE_STACK" DistributionId)
API=$(out "$BACKEND_STACK" PublicApiUrl)
[[ -n "$BUCKET" && -n "$DIST" ]] || { echo "Stack $SITE_STACK not found: run backend/infra/scripts/deploy-sites.sh first." >&2; exit 1; }
[[ -n "$API" ]] || { echo "Stack $BACKEND_STACK not found: deploy the backend first." >&2; exit 1; }

# Values already in the environment win over .env.production (Vite behaviour).
export VITE_API_URL="$API/api"
echo "==> Building with VITE_API_URL=$VITE_API_URL"
npm run build

# Explicit Content-Type per extension: on Windows the AWS CLI guesses MIME types
# from the registry, which can serve .js as text/plain and break module scripts.
TYPES=(
  "js:text/javascript; charset=utf-8" "mjs:text/javascript; charset=utf-8" "css:text/css; charset=utf-8"
  "html:text/html; charset=utf-8" "json:application/json" "map:application/json"
  "webmanifest:application/manifest+json" "xml:application/xml" "txt:text/plain; charset=utf-8"
  "svg:image/svg+xml" "png:image/png" "jpg:image/jpeg" "jpeg:image/jpeg" "gif:image/gif"
  "webp:image/webp" "avif:image/avif" "ico:image/x-icon"
  "woff2:font/woff2" "woff:font/woff" "ttf:font/ttf" "pdf:application/pdf"
)

# sync_typed <src> <dst> <cache-control> [extra filters...]
sync_typed() {
  local src="$1" dst="$2" cache="$3"
  shift 3
  for t in "${TYPES[@]}"; do
    aws s3 sync "$src" "$dst" --exclude "*" --include "*.${t%%:*}" "$@" \
      --content-type "${t#*:}" --cache-control "$cache" --only-show-errors
  done
}

echo "==> Uploading to s3://$BUCKET"
# 1. Fingerprinted bundles: cached for a year.
[[ -d dist/assets ]] && sync_typed dist/assets "s3://$BUCKET/assets" "public, max-age=31536000, immutable"
# 2. Other static files (favicon, og-image, robots.txt…): 1 hour.
sync_typed dist "s3://$BUCKET" "public, max-age=3600" --exclude "assets/*" --exclude "index.html"
# 3. index.html last, always revalidated, so visitors never get a page pointing to missing bundles.
aws s3 cp dist/index.html "s3://$BUCKET/index.html" --content-type "text/html; charset=utf-8" --cache-control "no-cache" --only-show-errors
# 4. Remove files that are no longer part of the build.
aws s3 sync dist "s3://$BUCKET" --delete --size-only --exclude ".htaccess" --only-show-errors

echo "==> Invalidating CloudFront cache"
aws cloudfront create-invalidation --distribution-id "$DIST" --paths "/*" --query 'Invalidation.Id' --output text | tr -d '\r'

echo "==> Published: $(out "$SITE_STACK" SiteUrl)"
