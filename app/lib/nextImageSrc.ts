/**
 * Route a /public image through Next.js's built-in image optimizer so
 * non-<Image> consumers (e.g. a <canvas> `drawImage` source loaded via
 * `new Image()`) receive the same resized, AVIF/WebP-encoded payload the
 * <Image> component would — instead of downloading the full-resolution PNG.
 *
 * The optimizer is served same-origin (`/_next/image`), so the result never
 * taints a <canvas> and no `crossOrigin` handshake is required.
 *
 * `width` must be one of the configured device/image sizes and `quality` one of
 * `images.qualities` in next.config.ts (currently 75 or 90).
 */
export function nextImageSrc(src: string, width = 1200, quality = 75): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}
