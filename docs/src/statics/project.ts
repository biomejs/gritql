import docsConfig from './config';

const config = {
  guides: {
    sidebar: [
      {
        title: 'Getting Started',
        pages: [
          {
            path: '/',
            title: 'Overview',
          },
          { path: '/cli/quickstart', title: 'CLI Quickstart' },
          { path: '/cli/reference', title: 'CLI Reference' },
          { path: '/patterns', title: 'Pattern Library' },
          { path: '/guides/config', title: 'Config' },
          { path: '/security', title: 'Data Security' },
        ],
      },
      {
        pages: [
          {
            path: '/language/overview',
            title: 'Overview',
          },
          {
            path: '/tutorials/gritql',
            title: 'Tutorial',
          },
          {
            path: '/language/patterns',
            title: 'Patterns',
          },
          {
            path: '/language/conditions',
            title: 'Conditions',
          },
          {
            path: '/language/modifiers',
            title: 'Pattern Modifiers',
          },
          {
            path: '/language/target-languages',
            title: 'Target Languages',
          },
          { path: '/language/bubble', title: 'Bubble and Scoping' },
          { path: '/guides/patterns', title: 'Defining Patterns' },
          { path: '/language/functions', title: 'Functions' },
          { path: '/language/idioms', title: 'Common Idioms' },
          { path: '/language/syntax', title: 'Syntax Reference' },
          { path: '/guides/testing', title: 'Testing GritQL' },
        ],
        title: 'Language',
      },
      {
        pages: [
          { path: '/guides/ci', title: 'Continuous Integration' },
          { path: '/guides/authoring', title: 'Authoring GritQL' },
          { path: '/guides/imports', title: 'Imports' },
          { path: '/guides/vscode', title: 'VS Code' },
          { path: '/guides/sharing', title: 'Sharing Patterns' },
        ],
        title: 'Guides',
      },
    ],
  },
  navbar: {
    tabs: [],
    topLinks: [
      { title: 'GitHub', href: 'https://github.com/getgrit/gritql' },
      { title: 'Discord', href: 'https://docs.grit.io/discord' },
      { title: 'Blog', href: '/blog' },
      { title: 'Tutorial', href: '/tutorials/gritql' },
      { title: 'Playground', href: `/playground` },
      { title: 'Security', href: '/security' },
    ],
  },
};

export default config;
