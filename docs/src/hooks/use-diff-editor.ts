import { useAnalyzerContext } from "@/components/editor/analyzer-context";
import { isMatch, isResult, isRewrite } from "@/universal/matching/types";
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
	result?: any;
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
	const { analyzeFiles, fileResults } = useAnalyzerContext();
	const fileName = "test.js";

	const [editorState, setEditorState] = useState<EditorState>({
		state: "loading",
	});

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

	const result = useMemo(() => {
		console.log("fileResults", fileResults);
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
		return foundResult;
	}, [input, pattern, fileResults]);

	const output = useMemo(() => {
		if (result && isRewrite(result.result)) {
			return result.result.rewritten.content;
		}
		return input;
	}, [result, input]);

	return {
		output,
		onPatternChange,
		onDiffChange,
		state: editorState,
	};
};
