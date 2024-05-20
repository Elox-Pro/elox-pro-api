export function escapeForUrl(name: string): string {
    return encodeURIComponent(name.trim())
      .replace(/%20/g, '+') // Replace spaces with '+' for better URL compatibility
      .replace(/[^\w\-+\.]/g, ''); // Remove any characters not allowed in URLs
  }