import { createContext, useContext } from 'react';
import { FileResultMessage, PatternResultMessage, RichFile } from '../../universal';

export interface AnalyzerContextType {
  analyzeFiles: (files: RichFile[], pattern: string, justParse: boolean) => Promise<void>;
  fileResults: FileResultMessage[];
  patternInfo?: PatternResultMessage;
  kind: 'wasm';
  dispatched: { pattern: string; file: RichFile }[];
}

export const AnalyzerContext = createContext<AnalyzerContextType>({
  analyzeFiles: async () => { },
  fileResults: [],
  kind: 'wasm',
  dispatched: [],
});

export const useAnalyzerContext = () => {
  return useContext(AnalyzerContext);
};