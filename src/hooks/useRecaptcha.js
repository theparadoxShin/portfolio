import { useCallback, useEffect, useState } from 'react';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const isValidKey = RECAPTCHA_SITE_KEY && !RECAPTCHA_SITE_KEY.includes('your_recaptcha');

/**
 * Hook for Google reCAPTCHA v3
 * Moves badge into a container element in the form
 */
export const useRecaptcha = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConfigured] = useState(isValidKey);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isValidKey) {
      console.warn('VITE_RECAPTCHA_SITE_KEY not configured or invalid');
      setIsLoaded(true);
      return;
    }

    if (window.grecaptcha) {
      setIsLoaded(true);
      moveBadgeToContainer();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      window.grecaptcha.ready(() => {
        setIsLoaded(true);
        moveBadgeToContainer();
      });
    };
    
    script.onerror = () => {
      setError('Failed to load reCAPTCHA');
      setIsLoaded(true);
    };

    document.head.appendChild(script);
  }, []);

  // Move the badge into the form container
  const moveBadgeToContainer = () => {
    setTimeout(() => {
      const badge = document.querySelector('.grecaptcha-badge');
      const container = document.getElementById('recaptcha-container');
      if (badge && container) {
        badge.style.position = 'relative';
        badge.style.right = 'auto';
        badge.style.bottom = 'auto';
        badge.style.transform = 'none';
        badge.style.boxShadow = 'none';
        container.appendChild(badge);
      }
    }, 500);
  };

  const executeRecaptcha = useCallback(async (action = 'contact_form') => {
    if (!isValidKey) {
      setError('reCAPTCHA is not configured');
      return null;
    }

    if (!window.grecaptcha) {
      setError('reCAPTCHA not loaded');
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

  return { executeRecaptcha, isLoaded, isConfigured, error };
};

export default useRecaptcha;
