import { useState, useEffect, useCallback } from 'react';
import { apiRequest, SITE } from '../lib/api';

// ---------------------------------------------------------------- Cache
// Public content rarely changes during a visit: successful GET responses are
// kept for the session and concurrent requests for the same path are shared
// (e.g. two sections of a page asking for /skills trigger a single request).
const cache = new Map();
const inflight = new Map();

const fetchCached = (path) => {
  if (cache.has(path)) return Promise.resolve(cache.get(path));
  if (inflight.has(path)) return inflight.get(path);
  const promise = apiRequest(path)
    .then((payload) => {
      cache.set(path, payload);
      return payload;
    })
    .finally(() => inflight.delete(path));
  inflight.set(path, promise);
  return promise;
};

const toArray = (value) => (Array.isArray(value) ? value : []);

/**
 * Generic auto-fetching hook. Returns the raw success envelope as `payload`.
 * `error` is a visitor-friendly message; `status` the HTTP status (0 = network).
 */
export const useResource = (path) => {
  const [state, setState] = useState(() => ({
    path,
    payload: path ? cache.get(path) ?? null : null,
    loading: Boolean(path) && !cache.has(path),
    error: null,
    status: null,
  }));
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!path) return undefined;
    let active = true;
    if (cache.has(path)) {
      setState({ path, payload: cache.get(path), loading: false, error: null, status: 200 });
      return undefined;
    }
    setState({ path, payload: null, loading: true, error: null, status: null });
    fetchCached(path)
      .then((payload) => {
        if (active) setState({ path, payload, loading: false, error: null, status: 200 });
      })
      .catch((err) => {
        if (active) setState({ path, payload: null, loading: false, error: err.message, status: err.status ?? 0 });
      });
    return () => {
      active = false;
    };
  }, [path, attempt]);

  const retry = useCallback(() => {
    if (path) cache.delete(path);
    setAttempt((n) => n + 1);
  }, [path]);

  // Never expose data that belongs to a previous path.
  const current = state.path === path;
  return {
    payload: current ? state.payload : null,
    loading: current ? state.loading : Boolean(path),
    error: current ? state.error : null,
    status: current ? state.status : null,
    retry,
  };
};

const useList = (path) => {
  const { payload, ...rest } = useResource(path);
  return { items: toArray(payload?.data), ...rest };
};

/** Published projects for this site (sorted by the API). */
export const useProjects = (site = SITE) => {
  const { items, ...rest } = useList(`/projects?site=${encodeURIComponent(site)}`);
  return { projects: items, ...rest };
};

/** A single project by slug or id. `status === 404` when it does not exist. */
export const useProject = (slugOrId) => {
  const { payload, ...rest } = useResource(slugOrId ? `/projects/${encodeURIComponent(slugOrId)}` : null);
  return { project: payload?.data ?? null, ...rest };
};

export const useServices = (site = SITE) => {
  const { items, ...rest } = useList(`/services?site=${encodeURIComponent(site)}`);
  return { services: items, ...rest };
};

/** Experiences, newest first, each with a computed `duration` label. */
export const useExperiences = () => {
  const { items, ...rest } = useList('/experiences');
  return { experiences: items, ...rest };
};

/** Certifications, each with a computed `isValid` flag. */
export const useCertifications = () => {
  const { items, ...rest } = useList('/certifications');
  return { certifications: items, ...rest };
};

export const useSkills = () => {
  const { items, ...rest } = useList('/skills');
  return { skills: items, ...rest };
};

/** `[{ id, name, level, category, color }]` for the radar chart. */
export const useSkillsRadar = () => {
  const { items, ...rest } = useList('/skills/radar');
  return { radar: items, ...rest };
};

// ---------------------------------------------------------------- Contact
const CONTACT_IDLE = { loading: false, error: null, fieldErrors: {}, success: false, message: null };

/**
 * Contact form submission. Empty optional fields are omitted; `source` is
 * always 'portfolio'. Server validation errors are mapped per field.
 */
export const useContact = () => {
  const [state, setState] = useState(CONTACT_IDLE);

  const submitContact = useCallback(async (formData, recaptchaToken = null) => {
    setState({ ...CONTACT_IDLE, loading: true });

    const body = {};
    Object.entries(formData || {}).forEach(([key, value]) => {
      const clean = typeof value === 'string' ? value.trim() : value;
      if (clean !== '' && clean !== null && clean !== undefined) body[key] = clean;
    });
    body.source = SITE;
    if (recaptchaToken) body.recaptchaToken = recaptchaToken;

    try {
      const res = await apiRequest('/contact', { method: 'POST', body, timeout: 20000 });
      setState({ ...CONTACT_IDLE, success: true, message: res.message || null });
      return { ok: true };
    } catch (err) {
      const fieldErrors = {};
      err.errors?.forEach((e) => {
        if (e?.field && !fieldErrors[e.field]) fieldErrors[e.field] = e.message;
      });
      setState({ ...CONTACT_IDLE, error: err.message, fieldErrors });
      return { ok: false, error: err.message, fieldErrors };
    }
  }, []);

  const reset = useCallback(() => setState(CONTACT_IDLE), []);

  return { submitContact, ...state, reset };
};

// ---------------------------------------------------------------- Generic
/** Imperative helper kept for ad-hoc calls: `const { get, post } = useApi()`. */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest(endpoint, options);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((endpoint) => request(endpoint), [request]);
  const post = useCallback((endpoint, body) => request(endpoint, { method: 'POST', body }), [request]);
  const put = useCallback((endpoint, body) => request(endpoint, { method: 'PUT', body }), [request]);
  const del = useCallback((endpoint) => request(endpoint, { method: 'DELETE' }), [request]);

  return { get, post, put, del, loading, error };
};

export default useApi;
