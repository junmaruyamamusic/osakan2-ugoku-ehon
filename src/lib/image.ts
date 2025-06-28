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

    const radius = outputSize / 2 - margin;

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
  } finally {
    URL.revokeObjectURL(tmpUrl);
  }
}
