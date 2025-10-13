import { PropsWithChildren, useCallback, useState } from 'react';

import {
  FileResultMessage,
  MatchResult, RichFile, extractPath,
  isAllDone,
  isPatternInfo
} from '../../universal';
import { AnalyzerContext } from './analyzer-context';

export interface AnalyzerData {
  command: 'parse' | 'match';
  pattern: string;
  file_paths: string[];
  file_contents: string[];
  lib_paths: string[];
  lib_contents: string[];
}

interface AnalyzerInput {
  analyze: (data: AnalyzerData) => Promise<MatchResult[]>;
}


export const WasmProvider: React.FC<PropsWithChildren<AnalyzerInput>> = ({ children, analyze }) => {
  const [fileResults, setFileResults] = useState<FileResultMessage[]>([]);
  const [patternInfo, setPatternInfo] = useState<any>();
  const [dispatched, setDispatched] = useState<{ pattern: string; file: RichFile }[]>([]);

  const rawAnalyzeFiles = useCallback(
    async (files: RichFile[], pattern: string, justParse: boolean) => {

      const inputs = {
        pattern,
        file_paths: files.map((f) => f.path),
        file_contents: files.map((f) => f.content),
        lib_paths: [],
        lib_contents: [],
      };
      try {
        const promises = [
          analyze({
            command: 'parse',
            ...inputs,
          }).then((r) => updateFileResults(r, pattern)),
        ];
        if (!justParse) {
          promises.push(
            analyze({
              command: 'match',
              ...inputs,
            }).then((r) => updateFileResults(r, pattern)),
          );
          setDispatched(files.map((f) => ({ pattern, file: f })));
        }
        await Promise.all(promises);
      } catch (e: any) {
        console.error(e);
        return;
      }
    },
    [],
  );

  const updateFileResults = useCallback(
    (
      results: MatchResult[],
      pattern: string,
    ) => {
      const ourResults: FileResultMessage[] = [];
      for (const result of results) {
        const filePath = extractPath(result);
        if (isAllDone(result) || !filePath) {
          continue;
        }
        if (isPatternInfo(result)) {
          setPatternInfo({
            pattern,
            result,
          });
          continue;
        } else {
          ourResults.push({
            result,
            pattern,
          });
        }
      }
      setFileResults(ourResults);
    },
    [],
  );

  const analyzer = {
    analyzeFiles: rawAnalyzeFiles,
    fileResults,
    patternInfo,
    kind: 'wasm' as const,
    dispatched,
  };

  return <AnalyzerContext.Provider value={analyzer}>{children}</AnalyzerContext.Provider>;
}; 