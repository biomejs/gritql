import baseTheme from './base-light';
import merge from 'lodash/merge';

export const gritLightTheme = merge(baseTheme, {
  rules: [
    { token: 'meta.engine.grit', foreground: '#B2950F' },
    { token: 'meta.language.grit', foreground: '#B2950F' },
    {
      token: 'variable.interpolated.grit',
      foreground: '#f9025b',
      fontStyle: 'italic',
    },
    { token: 'variable.startsign.grit', foreground: '#f9025b' },
    { token: 'keyword.control.grit', foreground: '#2188ff' },
    { token: 'variable', foreground: '#24292e' },
    { token: 'snippet.grit', background: '#444d56' },
    { token: 'comment', foreground: '#28a044' },
    {
      token: 'keyword.operator.grit',
      foreground: '#9E0811',
      fontStyle: 'bold',
    },
    { token: 'markup.quote.literal.language.grit', foreground: '#B2950F' },
    { token: 'entity.name.function.grit', foreground: '#7E2FBC' },
  ],
});
