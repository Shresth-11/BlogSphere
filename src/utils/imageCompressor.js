/**
 * High-performance client-side image compression utility using HTML5 Canvas.
 * Compresses large images (like 3MB screenshots) to optimized JPEGs (typically ~150-200KB)
 * in the browser before they are uploaded to Appwrite Storage.
 *
 * @param {File} file - The original File object from file input.
 * @param {number} maxWidth - Maximum width boundary for scaling (default: 1200px).
 * @param {number} maxHeight - Maximum height boundary for scaling (default: 1200px).
 * @param {number} quality - JPEG compression quality between 0.0 and 1.0 (default: 0.75).
 * @returns {Promise<File>} - Resolves with the compressed File object (or original file if compression fails).
 */
export function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) {
  return new Promise((resolve) => {
    // Only compress image files
    if (!file || !file.type || !file.type.startsWith("image/")) {
      console.log("Image compressor :: File is not an image. Skipping compression.");
      return resolve(file);
    }

    // Skip compression for tiny files (e.g. less than 150KB) to save CPU
    if (file.size < 150 * 1024) {
      console.log(`Image compressor :: File size is already small (${(file.size / 1024).toFixed(1)}KB). Skipping compression.`);
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate optimized dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.warn("Image compressor :: Failed to get 2D canvas context. Skipping compression.");
          return resolve(file);
        }

        // Draw image onto canvas (downscaling)
        ctx.drawImage(img, 0, 0, width, height);

        // Compress canvas output to a JPEG blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.warn("Image compressor :: Canvas toBlob returned null. Skipping compression.");
              return resolve(file);
            }

            // Create a new File from the compressed blob
            // Replace original extension with .jpg
            const originalName = file.name || "uploaded_image";
            const cleanName = originalName.replace(/\.[^/.]+$/, "") + ".jpg";

            const compressedFile = new File([blob], cleanName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            console.log(`Image compressor :: Success! Original: ${(file.size / 1024).toFixed(1)}KB -> Compressed: ${(compressedFile.size / 1024).toFixed(1)}KB (Saved ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%)`);
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => {
        console.error("Image compressor :: Failed to load image element:", err);
        resolve(file);
      };
      img.src = event.target.result;
    };
    reader.onerror = (err) => {
      console.error("Image compressor :: Failed to read file as DataURL:", err);
      resolve(file);
    };
    reader.readAsDataURL(file);
  });
}
