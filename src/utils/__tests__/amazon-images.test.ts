import { describe, it, expect } from 'vitest';
import {
  updateAmazonImageSize,
  getAmazonImageSize,
  isAmazonMediaUrl,
  createProgressiveAmazonUrls,
} from '../amazon-images';

describe('Amazon Image Utilities', () => {
  const sampleAmazonUrl = 'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX300.jpg';
  const sampleAmazonUrlPng = 'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX600.png';
  const sampleAmazonUrlWebp = 'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX1000.webp';

  describe('isAmazonMediaUrl', () => {
    it('should return true for valid Amazon media URLs', () => {
      expect(isAmazonMediaUrl(sampleAmazonUrl)).toBe(true);
      expect(isAmazonMediaUrl(sampleAmazonUrlPng)).toBe(true);
      expect(isAmazonMediaUrl(sampleAmazonUrlWebp)).toBe(true);
    });

    it('should return false for non-Amazon URLs', () => {
      expect(isAmazonMediaUrl('https://example.com/image.jpg')).toBe(false);
      expect(isAmazonMediaUrl('https://tmdb.org/image.jpg')).toBe(false);
      expect(isAmazonMediaUrl('http://localhost:3000/image.png')).toBe(false);
    });

    it('should return false for Amazon URLs without size parameter', () => {
      expect(isAmazonMediaUrl('https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc.jpg')).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      expect(isAmazonMediaUrl('')).toBe(false);
      expect(isAmazonMediaUrl('not-a-url')).toBe(false);
      expect(isAmazonMediaUrl('https://')).toBe(false);
    });
  });

  describe('getAmazonImageSize', () => {
    it('should extract size from Amazon URLs', () => {
      expect(getAmazonImageSize(sampleAmazonUrl)).toBe(300);
      expect(getAmazonImageSize(sampleAmazonUrlPng)).toBe(600);
      expect(getAmazonImageSize(sampleAmazonUrlWebp)).toBe(1000);
    });

    it('should return null for non-Amazon URLs', () => {
      expect(getAmazonImageSize('https://example.com/image.jpg')).toBe(null);
      expect(getAmazonImageSize('https://tmdb.org/image.jpg')).toBe(null);
    });

    it('should return null for Amazon URLs without size parameter', () => {
      expect(getAmazonImageSize('https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc.jpg')).toBe(null);
    });

    it('should handle different file extensions', () => {
      expect(getAmazonImageSize('https://m.media-amazon.com/images/M/MV5B...@._V1_SX1500.jpg')).toBe(1500);
      expect(getAmazonImageSize('https://m.media-amazon.com/images/M/MV5B...@._V1_SX2000.png')).toBe(2000);
      expect(getAmazonImageSize('https://m.media-amazon.com/images/M/MV5B...@._V1_SX500.webp')).toBe(500);
    });
  });

  describe('updateAmazonImageSize', () => {
    it('should update size parameter in Amazon URLs', () => {
      expect(updateAmazonImageSize(sampleAmazonUrl, 600)).toBe(
        'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX600.jpg'
      );
      expect(updateAmazonImageSize(sampleAmazonUrlPng, 1000)).toBe(
        'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX1000.png'
      );
      expect(updateAmazonImageSize(sampleAmazonUrlWebp, 300)).toBe(
        'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX300.webp'
      );
    });

    it('should preserve file extension when updating size', () => {
      expect(updateAmazonImageSize(sampleAmazonUrl, 1500)).toMatch(/\.jpg$/);
      expect(updateAmazonImageSize(sampleAmazonUrlPng, 1500)).toMatch(/\.png$/);
      expect(updateAmazonImageSize(sampleAmazonUrlWebp, 1500)).toMatch(/\.webp$/);
    });

    it('should return original URL for non-Amazon URLs', () => {
      const nonAmazonUrl = 'https://example.com/image.jpg';
      expect(updateAmazonImageSize(nonAmazonUrl, 600)).toBe(nonAmazonUrl);
    });

    it('should handle edge cases', () => {
      expect(updateAmazonImageSize('', 600)).toBe('');
      expect(updateAmazonImageSize('not-a-url', 600)).toBe('not-a-url');
    });

    it('should handle various size values', () => {
      expect(updateAmazonImageSize(sampleAmazonUrl, 1)).toBe(
        'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX1.jpg'
      );
      expect(updateAmazonImageSize(sampleAmazonUrl, 9999)).toBe(
        'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX9999.jpg'
      );
    });
  });

  describe('createProgressiveAmazonUrls', () => {
    it('should create progressive URL pairs for Amazon URLs', () => {
      const result = createProgressiveAmazonUrls(sampleAmazonUrl, 300, 1000);
      expect(result).toEqual({
        small: 'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX300.jpg',
        large: 'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX1000.jpg',
      });
    });

    it('should use default sizes when not specified', () => {
      const result = createProgressiveAmazonUrls(sampleAmazonUrl);
      expect(result).toEqual({
        small: 'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX300.jpg',
        large: 'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX1000.jpg',
      });
    });

    it('should handle custom sizes', () => {
      const result = createProgressiveAmazonUrls(sampleAmazonUrl, 150, 2000);
      expect(result).toEqual({
        small: 'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX150.jpg',
        large: 'https://m.media-amazon.com/images/M/MV5BMDMyNDIzYzMtZTMyMy00NjUyLWI3Y2MtYzYzOGE1NzQ1MTBiXkEyXkFqcGc@._V1_SX2000.jpg',
      });
    });

    it('should return null for non-Amazon URLs', () => {
      expect(createProgressiveAmazonUrls('https://example.com/image.jpg')).toBe(null);
      expect(createProgressiveAmazonUrls('not-a-url')).toBe(null);
    });

    it('should preserve file extension in both URLs', () => {
      const result = createProgressiveAmazonUrls(sampleAmazonUrlPng, 300, 1000);
      expect(result?.small).toMatch(/\.png$/);
      expect(result?.large).toMatch(/\.png$/);
    });
  });

  describe('Integration tests', () => {
    it('should work together for progressive loading workflow', () => {
      const url = sampleAmazonUrl;

      // Check if it's an Amazon URL
      expect(isAmazonMediaUrl(url)).toBe(true);

      // Get current size
      expect(getAmazonImageSize(url)).toBe(300);

      // Create progressive URLs
      const progressive = createProgressiveAmazonUrls(url, 300, 1000);
      expect(progressive).not.toBe(null);

      if (progressive) {
        // Verify small URL
        expect(isAmazonMediaUrl(progressive.small)).toBe(true);
        expect(getAmazonImageSize(progressive.small)).toBe(300);

        // Verify large URL
        expect(isAmazonMediaUrl(progressive.large)).toBe(true);
        expect(getAmazonImageSize(progressive.large)).toBe(1000);

        // Verify we can update the large URL further
        const extraLarge = updateAmazonImageSize(progressive.large, 1500);
        expect(getAmazonImageSize(extraLarge)).toBe(1500);
      }
    });
  });
});
