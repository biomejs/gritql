import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import { WasmProvider } from '@/components/editor/wasm-provider';
import type { MatchResult } from '../universal';

export const WorkerAnalysisProvider: React.FC<
  PropsWithChildren<{}>
> = ({ children }) => {
  const workerRef = useRef<Worker>();
  const messageIds = useRef(new Map());
  const pendingQueue = useRef<Array<{ id: string; data: any; resolve: (v: MatchResult[]) => void; reject: (e: Error) => void }>>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL('./work.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event) => {
      const { id, data } = event.data;
      const entry = messageIds.current.get(id);
      if (entry) {
        entry.resolve(data);
        messageIds.current.delete(id);
      }
    };
    workerRef.current = worker;
    setReady(true);

    // Flush any queued requests
    for (const pending of pendingQueue.current) {
      messageIds.current.set(pending.id, { resolve: pending.resolve, reject: pending.reject });
      worker.postMessage({ id: pending.id, request: pending.data });
    }
    pendingQueue.current = [];

    return () => {
      worker.terminate();
    };
  }, []);

  const analyze = useCallback((data: any) => {
    const id = Math.random().toString(36).substring(2);
    return new Promise<MatchResult[]>((resolve, reject) => {
      if (workerRef.current) {
        messageIds.current.set(id, { resolve, reject });
        workerRef.current.postMessage({ id, request: data });
      } else {
        // Queue until worker is ready
        pendingQueue.current.push({ id, data, resolve, reject });
      }
    });
  }, []);

  return (
    <WasmProvider analyze={analyze}>
      {children}
    </WasmProvider>
  );
};
