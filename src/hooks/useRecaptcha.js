import { useCallback, useEffect, useState } from 'react';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/**
 * Hook for Google reCAPTCHA v3
 */
export const useRecaptcha = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip if no site key configured
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('VITE_RECAPTCHA_SITE_KEY not configured');
      setIsLoaded(true);
      return;
    }

    // Check if already loaded
    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      window.grecaptcha.ready(() => {
        setIsLoaded(true);
      });
    };
    
    script.onerror = () => {
      setError('Failed to load reCAPTCHA');
      setIsLoaded(true); // Allow form to work without reCAPTCHA
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount (optional)
    };
  }, []);

  const executeRecaptcha = useCallback(async (action = 'contact_form') => {
    if (!RECAPTCHA_SITE_KEY) {
      return null; // No token if not configured
    }

    if (!window.grecaptcha) {
      console.error('reCAPTCHA not loaded');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      return token;
    } catch (err) {
      console.error('reCAPTCHA execution error:', err);
      setError('reCAPTCHA verification failed');
      return null;
    }
  }, []);

  return { executeRecaptcha, isLoaded, error };
};

export default useRecaptcha;
