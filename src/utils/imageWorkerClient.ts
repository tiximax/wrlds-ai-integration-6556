let worker: Worker | null = null;

function ensureWorker(): Worker | null {
  try {
    if (!worker) {
      // Vite-compatible worker import
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      worker = new Worker(new URL('../workers/image-processor.ts', import.meta.url), { type: 'module' });
    }
    return worker;
  } catch {
    return null;
  }
}

export async function resizeImageToDataURL(file: File, maxWidth = 256): Promise<string> {
  const w = ensureWorker();
  if (!w) return await fileToDataURL(file);
  return new Promise((resolve) => {
    const onMessage = (e: MessageEvent) => {
      try {
        if (e.data && e.data.type === 'result' && e.data.id === id) {
          w.removeEventListener('message', onMessage);
          resolve(e.data.dataURL as string);
        }
      } catch {
        resolve(fileToDataURL(file));
      }
    };
    const id = `${Date.now()}-${Math.random()}`;
    w.addEventListener('message', onMessage);
    w.postMessage({ type: 'resize', id, maxWidth, file });
  });
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}