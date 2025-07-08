/**
 * Updates the size parameter in an Amazon media URL
 * @param url - The Amazon media URL (e.g., "https://m.media-amazon.com/images/M/MV5B...@._V1_SX300.jpg")
 * @param size - The desired size (e.g., 300, 600, 1000, 1500, 2000)
 * @returns The URL with updated size parameter, or the original URL if not an Amazon media URL
 */
export function updateAmazonImageSize(url: string, size: number): string {
  // Check if it's an Amazon media URL
  const amazonMediaRegex = /^https:\/\/m\.media-amazon\.com\/images\/M\/.+@\._V1_SX\d+\.(jpg|png|webp)$/i;

  if (!amazonMediaRegex.test(url)) {
    return url; // Return original URL if not an Amazon media URL
  }

  // Replace the size parameter
  const updatedUrl = url.replace(/@\._V1_SX\d+\.(jpg|png|webp)$/i, `@._V1_SX${size}.$1`);

  return updatedUrl;
}

/**
 * Gets the current size parameter from an Amazon media URL
 * @param url - The Amazon media URL
 * @returns The current size number, or null if not an Amazon media URL or no size found
 */
export function getAmazonImageSize(url: string): number | null {
  const amazonMediaRegex = /^https:\/\/m\.media-amazon\.com\/images\/M\/.+@\._V1_SX(\d+)\.(jpg|png|webp)$/i;

  const match = url.match(amazonMediaRegex);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Checks if a URL is an Amazon media URL
 * @param url - The URL to check
 * @returns True if it's an Amazon media URL with size parameter
 */
export function isAmazonMediaUrl(url: string): boolean {
  const amazonMediaRegex = /^https:\/\/m\.media-amazon\.com\/images\/M\/.+@\._V1_SX\d+\.(jpg|png|webp)$/i;
  return amazonMediaRegex.test(url);
}

/**
 * Creates a progressive loading URL pair for Amazon images
 * @param url - The Amazon media URL
 * @param smallSize - Size for the small image (default: 300)
 * @param largeSize - Size for the large image (default: 1000)
 * @returns Object with small and large URLs, or null if not an Amazon URL
 */
export function createProgressiveAmazonUrls(
  url: string,
  smallSize: number = 300,
  largeSize: number = 1000
): { small: string; large: string } | null {
  if (!isAmazonMediaUrl(url)) {
    return null;
  }

  return {
    small: smallSize ? updateAmazonImageSize(url, smallSize) : url,
    large: largeSize ? updateAmazonImageSize(url, largeSize) : url,
  };
}
