// Single source of truth for personal links used across the site.
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export const SITE_URL = 'https://parfaittedomtedom.com';
export const COMPANY_URL = 'https://daemon-craft.ca';
export const COMPANY_NAME = 'Daemon Craft Inc.';

export const FULL_NAME = 'Parfait Ben-oni Tedom Tedom';
export const SHORT_NAME = 'Parfait Tedom Tedom';

export const EMAIL = 'me@parfaittedomtedom.com';
export const LOCATION = 'Edmonton, Alberta, Canada';
export const RESUME_URL = '/resume.pdf';

export const GITHUB = { url: 'https://github.com/theparadoxShin', handle: '@theparadoxShin' };
export const LINKEDIN = { url: 'https://www.linkedin.com/in/parfait-ben-oni-tedom-tedom-496bb6135/', handle: FULL_NAME };
export const TWITTER = { url: 'https://x.com/PTedom77132', handle: '@PTedom77132' };

export const SOCIAL_LINKS = [
  { icon: Github, href: GITHUB.url, label: 'GitHub' },
  { icon: Linkedin, href: LINKEDIN.url, label: 'LinkedIn' },
  { icon: Twitter, href: TWITTER.url, label: 'X (Twitter)' },
  { icon: Mail, href: `mailto:${EMAIL}`, label: 'Email' },
];
