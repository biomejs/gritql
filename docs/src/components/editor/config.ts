export const editorOptions = {
	minimap: { enabled: false },
};

export const readOnlyOptions = {
	readOnly: true,
	domReadOnly: true,
	contextmenu: false,
	quickSuggestions: false,
	suggestOnTriggerCharacters: false,
	acceptSuggestionOnEnter: "off",
	tabCompletion: "off",
	wordBasedSuggestions: "off",
	parameterHints: { enabled: false },
	hover: { enabled: false },
	links: false,
	find: { addExtraSpaceOnTop: false },
	folding: false,
	lineNumbers: "off",
	glyphMargin: false,
	lineDecorationsWidth: 0,
	lineNumbersMinChars: 0,
	renderLineHighlight: "none",
	overviewRulerBorder: false,
	hideCursorInOverviewRuler: true,
	overviewRulerLanes: 0,
};

export const diffEditorOptions = {
	...editorOptions,
	renderOverviewRuler: false,
	glyphMargin: true,
	automaticLayout: true,
	originalEditable: true,
	renderSideBySide: true,
};
