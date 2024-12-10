const ALLOWED_MIME_TYPES = ['image/webp', 'image/jpeg'];

export async function processDesignFile(file: File): Promise<File> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Format non supporté. Utilisez WebP, JPG ou JPEG');
  }
  return file;
}