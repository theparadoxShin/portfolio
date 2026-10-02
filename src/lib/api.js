// Thin client for the portfolio API.
// Envelope: success `{ success: true, data, count?, total?, page?, pages? }`,
// error `{ success: false, message, errors?: [{ field, message }] }` where
// `message` is already human-readable.

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

// Content on the shared backend is tagged per site.
export const SITE = 'portfolio';

const DEFAULT_TIMEOUT = 15000;

export class ApiError extends Error {
  constructor(message, { status = 0, errors = [] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = Array.isArray(errors) ? errors : [];
  }
}

const fallbackMessage = (status) => {
  if (status === 404) return 'The requested content could not be found.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status >= 500) return 'Something went wrong on the server. Please try again later.';
  return 'Something went wrong. Please try again.';
};

/**
 * Performs a request and returns the parsed success envelope.
 * Throws an ApiError whose `message` is safe to show to visitors.
 */
export async function apiRequest(path, { method = 'GET', body, signal, timeout = DEFAULT_TIMEOUT } = {}) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort, { once: true });

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      // No Content-Type on GET: keeps it a "simple" CORS request (no preflight).
      headers: body === undefined
        ? { Accept: 'application/json' }
        : { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    if (timedOut) throw new ApiError('The server took too long to respond. Please try again.');
    throw new ApiError('Unable to reach the server. Please check your connection and try again.');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // Non-JSON response (proxy error page, empty body…): handled below.
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || fallbackMessage(response.status), {
      status: response.status,
      errors: payload?.errors,
    });
  }

  return payload ?? {};
}

export const isAbortError = (err) => err?.name === 'AbortError';
