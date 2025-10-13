import { useAnalyzerContext } from "@/components/editor/analyzer-context";
import { useState, useCallback, useMemo } from "react";

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
	const analysis = useAnalyzerContext();

	const [editorState, setEditorState] = useState<EditorState>({
		state: "loading",
	});

	const onPatternChange = useCallback(
		(value: string | undefined) => {
			setPattern(value ?? "");
			console.log("onPatternChange", value);
		},
		[setPattern],
	);

	const onDiffChange = useCallback(
		(value: string | undefined) => {
			setInput(value ?? "");
		},
		[setInput],
	);

	const result = useMemo(() => {
		console.log("result", input, pattern, analysis);
		return {
			type: "match",
			output: `${input} => ${pattern}`,
		};
	}, [input, pattern, analysis]);

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
