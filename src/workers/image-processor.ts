// Web Worker for basic image resize to dataURL using OffscreenCanvas if available
self.onmessage = async (e: MessageEvent) => {
  const data = e.data || {};
  if (data.type !== 'resize') return;
  const { id, maxWidth, file } = data;
  try {
    const bitmap = await createImageBitmap(file);
    const ratio = bitmap.width > 0 ? Math.min(1, maxWidth / bitmap.width) : 1;
    const targetW = Math.round(bitmap.width * ratio);
    const targetH = Math.round(bitmap.height * ratio);

    let dataURL = '';
    // @ts-ignore
    if (typeof OffscreenCanvas !== 'undefined') {
      // @ts-ignore
      const canvas = new OffscreenCanvas(targetW, targetH);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(bitmap, 0, 0, targetW, targetH);
      // @ts-ignore
      dataURL = await canvas.convertToBlob ? await canvas.convertToBlob({ type: 'image/png', quality: 0.8 }).then(blobToDataURL) : '';
    }

    if (!dataURL) {
      // Fallback using regular canvas via OffscreenCanvas poly behavior
      // @ts-ignore
      const canvasEl: HTMLCanvasElement = (self as any).document?.createElement('canvas');
      if (canvasEl) {
        canvasEl.width = targetW; canvasEl.height = targetH;
        const ctx = canvasEl.getContext('2d')!;
        ctx.drawImage(bitmap, 0, 0, targetW, targetH);
        dataURL = canvasEl.toDataURL('image/png', 0.8);
      }
    }

    // Fallback to original if conversion failed
    if (!dataURL) {
      dataURL = await blobToDataURL(file);
    }

    // @ts-ignore
    self.postMessage({ type: 'result', id, dataURL });
  } catch (err) {
    // @ts-ignore
    self.postMessage({ type: 'result', id, dataURL: '' });
  }
};

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => resolve('');
    reader.readAsDataURL(blob);
  });
}