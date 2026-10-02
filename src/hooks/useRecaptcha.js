import { useCallback, useEffect, useState } from 'react';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const isValidKey = Boolean(RECAPTCHA_SITE_KEY) && !RECAPTCHA_SITE_KEY.includes('your_recaptcha');
const SCRIPT_ID = 'recaptcha-v3-script';
const EXECUTE_TIMEOUT = 8000;

let loadPromise = null;

/** Loads the reCAPTCHA v3 script once per page load. */
const loadRecaptcha = () => {
  if (!isValidKey) return Promise.resolve(false);
  if (window.grecaptcha?.execute) return Promise.resolve(true);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const onReady = () => window.grecaptcha.ready(() => resolve(true));
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', onReady, { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
    script.async = true;
    script.defer = true;
    script.onload = onReady;
    script.onerror = () => {
      loadPromise = null; // allow a later retry
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return loadPromise;
};

/**
 * Google reCAPTCHA v3 (invisible). The badge is hidden via CSS and the form
 * shows Google's required notice instead.
 *
 * `executeRecaptcha` never throws: it resolves to a token, or `null` when
 * reCAPTCHA is not configured / unavailable. The backend decides whether a
 * token is mandatory (it is in production) and returns a readable message.
 */
export const useRecaptcha = () => {
  const [isLoaded, setIsLoaded] = useState(!isValidKey || Boolean(window.grecaptcha?.execute));

  useEffect(() => {
    let active = true;
    loadRecaptcha().then(() => {
      if (active) setIsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const executeRecaptcha = useCallback(async (action = 'contact_form') => {
    if (!isValidKey) return null;
    const ready = await loadRecaptcha();
    if (!ready || !window.grecaptcha?.execute) return null;
    try {
      return await Promise.race([
        window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action }),
        new Promise((resolve) => setTimeout(() => resolve(null), EXECUTE_TIMEOUT)),
      ]);
    } catch (err) {
      console.warn('reCAPTCHA execution failed:', err);
      return null;
    }
  }, []);

  return { executeRecaptcha, isLoaded, isConfigured: isValidKey };
};

export default useRecaptcha;
