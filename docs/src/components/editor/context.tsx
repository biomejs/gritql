import { createContext, useContext, useState, PropsWithChildren } from 'react';

export interface EditorState {
	pattern: string;
	setPattern: (newPattern: string) => void;
	input: string;
	setInput: (newInput: string) => void;
}

export const StandaloneEditorContext = createContext<EditorState>({
	pattern: "",
	setPattern: () => { },
	input: "",
	setInput: () => { },
});

export const StandaloneEditorProvider = ({ children }: PropsWithChildren<{}>) => {
	const [pattern, setPattern] = useState('// Enter your Grit pattern here\n// Example: `console.log($msg)` => `console.info($msg)`\n\n');
	const [input, setInput] = useState('// Enter your code to transform here\nconsole.log("Hello, world!");\nconsole.log("This is a test");');

	const value = {
		pattern,
		setPattern,
		input,
		setInput,
	};

	return (
		<StandaloneEditorContext.Provider value={value}>{children}</StandaloneEditorContext.Provider>
	);
};

export const useStandaloneEditor = () => {
	const context = useContext(StandaloneEditorContext);
	if (context === undefined) {
		throw new Error('useStandaloneEditor must be used within a StandaloneEditorProvider');
	}
	return context;
};
