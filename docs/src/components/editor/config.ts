
export const editorOptions = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto',
  },
  lineNumbers: 'on',
  glyphMargin: true,
  folding: true,
  lineDecorationsWidth: 5,
  lineNumbersMinChars: 3,
  renderLineHighlight: 'line',
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: false,
  overviewRulerLanes: 3,
  contextmenu: true,
  wordWrap: 'on',
  padding: { top: 8, bottom: 8 },
  fontSize: 14,
  lineHeight: 20,
  automaticLayout: true,
};

export const readOnlyOptions = {
  readOnly: true,
  domReadOnly: true,
  contextmenu: false,
  quickSuggestions: false,
  suggestOnTriggerCharacters: false,
  acceptSuggestionOnEnter: 'off',
  tabCompletion: 'off',
  wordBasedSuggestions: 'off',
  parameterHints: { enabled: false },
  hover: { enabled: false },
  links: false,
  find: { addExtraSpaceOnTop: false },
  folding: false,
  lineNumbers: 'off',
  glyphMargin: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  renderLineHighlight: 'none',
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  overviewRulerLanes: 0,
};

export const diffEditorOptions = {
  ...editorOptions,
  renderOverviewRuler: false,
  glyphMargin: true,
};