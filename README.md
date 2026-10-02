# Frontend Portfolio

Portfolio personnel - React + Vite + Tailwind CSS.

## Stack
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router DOM v6

## Installation

```bash
npm install
npm run dev
```

En local, le site parle à l'API locale (`.env.local` → `http://localhost:5000/api`).
Lancer l'API sans AWS : `cd ../backend && npm run dev:memory`.

## Pages
- Home, About, Projects
- Skills (avec radar chart)
- Experience, Certifications
- Contact

## Scripts

```bash
npm run dev     # Développement
npm run build   # Production
npm run preview # Preview build
npm run deploy  # Build + publication sur AWS (S3 + CloudFront)
```

## Déploiement

Production : **https://parfaittedomtedom.com** — bucket S3 privé + CloudFront, stack CloudFormation `daemon-craft-site-portfolio`.

`npm run deploy` (Git Bash, profil AWS `ceo`) lit le bucket, la distribution et l'URL de l'API
dans les sorties CloudFormation, construit le site avec le bon `VITE_API_URL`, envoie les fichiers
avec les bons types MIME et en-têtes de cache, puis invalide le cache CloudFront.
Infrastructure et guide complet : dépôt backend, `infra/GUIDE-INFRA-AWS.md`.

Port: `3001` | Thème: Cyan/Blue
