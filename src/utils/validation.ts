/**
 * Valide si l'URL est une URL Google Drive valide
 */
export function validateImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'drive.google.com' && url.includes('/file/d/');
  } catch {
    return false;
  }
}

/**
 * Convertit une URL Google Drive en URL d'image directe
 */
export function getGoogleDriveImageUrl(url: string): string {
  try {
    const fileId = url.match(/\/file\/d\/([^/]+)/)?.[1];
    if (!fileId) return url;
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch {
    return url;
  }
}