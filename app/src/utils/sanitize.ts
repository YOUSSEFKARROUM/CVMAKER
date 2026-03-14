import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'strike', 'br', 'ul', 'ol', 'li', 'a', 'span', 'p'];
const ALLOWED_ATTR = ['href', 'target', 'rel'];

export function sanitizeHtml(html: string): string {
  if (!html || html.trim() === '') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORCE_BODY: false,
  });
}

/** Vérifie si une chaîne contient du HTML (pour la rétrocompatibilité avec le texte brut) */
export function isHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}
