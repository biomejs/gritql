import { useAnalyzerContext } from "@/components/editor/analyzer-context";
import {
	FileResultMessage,
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
		if (!foundResult) {
			return {
				state: "loading",
			};
		}
		return {
			state: "loaded",
			result: foundResult,
		};
	}, [pattern, fileResults]);

	const output = useMemo(() => {
		if (editorState.result && isRewrite(editorState.result.result)) {
			return editorState.result.result.rewritten.content;
		}
		return input;
	}, [editorState.result, input]);

	return {
		output,
		onPatternChange,
		onDiffChange,
		state: editorState,
	};
};
