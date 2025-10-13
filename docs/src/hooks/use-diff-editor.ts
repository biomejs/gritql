import { useAnalyzerContext } from "@/components/editor/analyzer-context";
import {
	AnalysisLog,
	FileResultMessage,
	isAnalysisLog,
	isMatch,
	isResult,
	isRewrite,
} from "@/universal/matching/types";
import { extractPath } from "@/universal/patterns/types";
import { useState, useCallback, useMemo, useEffect } from "react";

interface UseDiffEditorProps {
	pattern: string;
	setPattern: (pattern: string) => void;
	input: string;
	setInput: (input: string) => void;
}

interface EditorState {
	state: "loading" | "loaded" | "error";
	result?: FileResultMessage;
	log?: {
		message: string;
	};
}

export const useDiffEditor = ({
	pattern,
	setPattern,
	input,
	setInput,
}: UseDiffEditorProps) => {
	const { analyzeFiles, fileResults, patternInfo } = useAnalyzerContext();
	const fileName = "test.js";

	const onPatternChange = useCallback(
		(value: string | undefined) => {
			const patternContent = value ?? "";
			setPattern(patternContent);
		},
		[setPattern],
	);

	const onDiffChange = useCallback(
		(value: string | undefined) => {
			setInput(value ?? "");
		},
		[setInput],
	);

	useEffect(() => {
		analyzeFiles([{ path: fileName, content: input }], pattern, false);
	}, [analyzeFiles, input, pattern]);

	const editorState = useMemo<EditorState>(() => {
		const foundResult = fileResults.find((result) => {
			if (result.pattern !== pattern) {
				return false;
			}
			if (isResult(result.result)) {
				const path = extractPath(result.result);
				return path === fileName;
			}
			return false;
		});
		const logs = fileResults
			.filter((result) => {
				if (result.pattern !== pattern) {
					return false;
				}
				return isAnalysisLog(result.result);
			})
			.map((result) => result.result as AnalysisLog);
		if (foundResult) {
			return {
				state: "loaded",
				result: foundResult,
			};
		}
		if (logs.length > 0) {
			return {
				state: "error",
				log: logs[0],
			};
		}
		return {
			state: "loading",
		};
	}, [pattern, fileResults, patternInfo]);

	const output = useMemo(() => {
		if (editorState.result && isRewrite(editorState.result.result)) {
			return editorState.result.result.rewritten.content;
		}
		return input;
	}, [editorState.result, input]);

	const match = useMemo(() => {
		if (editorState.result && isMatch(editorState.result.result)) {
			return editorState.result.result;
		}
		return undefined;
	}, [editorState.result]);

	return {
		output,
		onPatternChange,
		onDiffChange,
		state: editorState,
		match,
	};
};
