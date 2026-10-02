import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../data/profile';

const SITE_NAME = 'Parfait Tedom Tedom';

// Defaults come from index.html so there is a single source of truth.
const defaults = typeof document !== 'undefined'
  ? {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
  }
  : { title: '', description: '' };

const upsert = (selector, create) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
};

const metaTag = (attr, name) => () => {
  const m = document.createElement('meta');
  m.setAttribute(attr, name);
  return m;
};

/**
 * Per-route document title, meta description, canonical URL and robots directive.
 * `title` is the page name ("Projects"); omit it on the home page.
 */
export const usePageMeta = ({ title, description, noindex = false } = {}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : defaults.title;

    upsert('meta[name="description"]', metaTag('name', 'description'))
      .setAttribute('content', description || defaults.description);

    const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    upsert('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }).setAttribute('href', `${SITE_URL}${path}`);

    upsert('meta[name="robots"]', metaTag('name', 'robots'))
      .setAttribute('content', noindex ? 'noindex, follow' : 'index, follow');
  }, [title, description, noindex, pathname]);
};

export default usePageMeta;
