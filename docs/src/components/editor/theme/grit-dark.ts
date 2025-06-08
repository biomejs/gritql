import baseTheme from './base-dark';
import merge from 'lodash/merge';

export const gritDarkTheme = merge(baseTheme, {
  rules: [
    { token: 'meta.engine.grit', foreground: '#F5D544' },
    { token: 'meta.language.grit', foreground: '#F5D544' },
    {
      token: 'variable.interpolated.grit',
      foreground: '#ff7b72',
      fontStyle: 'italic',
    },
    { token: 'variable.startsign.grit', foreground: '#ff7b72' },
    { token: 'keyword.control.grit', foreground: '#58a6ff' },
    { token: 'variable', foreground: '#e2e2e2e2' },
    { token: 'snippet.grit', background: '#444d56' },
    { token: 'comment', foreground: '#3fb95099' },
    {
      token: 'keyword.operator.grit',
      foreground: '#F8B8BC',
      fontStyle: 'bold',
    },
    { token: 'markup.quote.literal.language.grit', foreground: '#F5D544' },
    { token: 'entity.name.function.grit', foreground: '#D098FD' },
  ],
});
