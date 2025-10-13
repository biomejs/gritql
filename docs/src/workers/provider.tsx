import { PropsWithChildren, useEffect, useRef } from 'react';

import { WasmProvider } from '@/components/editor/wasm-provider';
import { MatchResult } from '../universal';

export const WorkerAnalysisProvider: React.FC<
  PropsWithChildren<{}>
> = ({ children }) => {
  const workerRef = useRef<Worker>();
  const messageIds = useRef(new Map());

  useEffect(() => {
    workerRef.current = new Worker(new URL('./work.ts', import.meta.url));
    workerRef.current.onmessage = (event) => {
      const { id, data } = event.data;
      const { resolve } = messageIds.current.get(id);
      resolve(data);
      messageIds.current.delete(id);
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <WasmProvider
      analyze={(data) => {
        const id = Math.random().toString(36).substring(2);
        return new Promise<MatchResult[]>((resolve, reject) => {
          if (!workerRef.current) {
            reject(new Error('Studio worker is not available'));
            return;
          }
          messageIds.current.set(id, { resolve, reject });
          workerRef.current.postMessage({
            id,
            request: data,
          });
        });
      }}
    >
      {children}
    </WasmProvider>
  );
};
