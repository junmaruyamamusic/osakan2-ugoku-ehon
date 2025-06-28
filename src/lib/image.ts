export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

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

    ctx.drawImage(img, sx, sy, size, size, 0, 0, outputSize, outputSize);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, outputSize, outputSize);

    ctx.clearRect(margin, margin, outputSize - margin * 2, outputSize - margin * 2);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.strokeRect(margin + 4, margin + 4, outputSize - (margin + 4) * 2, outputSize - (margin + 4) * 2);

    return canvas.toDataURL();
  } finally {
    URL.revokeObjectURL(tmpUrl);
  }
}
