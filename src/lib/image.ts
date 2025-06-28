export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Resize the uploaded image to fit within a smaller square area in the centre
 * of the canvas. The empty space around the image is kept transparent so that
 * it can be combined with other layers later.
 */
export async function createCompositeImage(
  file: File,
  outputSize = 512,
  margin = 80
): Promise<string> {
  const tmpUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(tmpUrl);
    const size = Math.min(img.width, img.height);
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas not supported');

    const radius = (outputSize / 2 - margin) / 2;
    const diameter = radius * 2;
    const offset = (outputSize - diameter) / 2;

    ctx.drawImage(img, sx, sy, size, size, offset, offset, diameter, diameter);

    return canvas.toDataURL();
  } finally {
    URL.revokeObjectURL(tmpUrl);
  }
}

/**
 * Create a version of the DALL-E image with a transparent circular hole in the
 * centre. The surrounding area of the image remains intact so that the uploaded
 * image placed underneath becomes visible only through the hole.
 */
export async function createDalleOverlay(
  url: string,
  outputSize = 512,
  margin = 80
): Promise<string> {
  const img = await loadImage(url);
  const size = Math.min(img.width, img.height);
  const sx = (img.width - size) / 2;
  const sy = (img.height - size) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas not supported');

  ctx.drawImage(img, sx, sy, size, size, 0, 0, outputSize, outputSize);

  const radius = (outputSize / 2 - margin) / 2;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(outputSize / 2, outputSize / 2, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(outputSize / 2, outputSize / 2, radius - 4, 0, Math.PI * 2);
  ctx.stroke();

  return canvas.toDataURL();
}
