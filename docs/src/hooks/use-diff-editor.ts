import { useAnalyzerContext } from "@/components/editor/analyzer-context";
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
		// const foundResult = fileResults.find(
		// 	(result) => result.file.path === fileName,
		// );
		return {};
	}, [input, pattern, fileResults]);

	const output = useMemo(() => {
		return result.output;
	}, [result]);

	return {
		output,
		onPatternChange,
		onDiffChange,
		state: editorState,
	};
};
