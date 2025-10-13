import Head from 'next/head';
import { BiCodeAlt, BiLibrary, BiTerminal } from 'react-icons/bi';

import { Subscribe } from '@/components/blog/subscribe';
import { CardGrid } from '@/components/card-grid';

export const getStaticProps = () => {
  return {
    props: {},
  };
};

export default function Index() {
  return (
    <>
      <Head>
        <title>Grit - Declarative Code Search and Transformation</title>
      </Head>

      <h1>GritQL</h1>
      <p className="lead">
        GritQL is a declarative query language for searching and modifying
        source code.
      </p>

      <h2>Why GritQL?</h2>
      <ul>
        <li>
          📖 <strong>Start simply</strong> without learning AST details: any
          code snippet is a valid GritQL query
        </li>
        <li>
          ⚡️ <strong>Scale to millions of lines</strong> using Rust and query
          optimization for repositories with 10M+ lines
        </li>
        <li>
          📦 <strong>Reuse patterns</strong> with Grit's built-in module system
          to access 200+ standard patterns or share your own
        </li>
        <li>
          ♻️ <strong>Works everywhere</strong>: use GritQL to rewrite
          JavaScript/TypeScript, Python, JSON, Java, Terraform, Solidity, CSS,
          Markdown, YAML, Rust, Go, or SQL
        </li>
        <li>
          🔧 <strong>Auto-fix built in</strong>: GritQL makes it easy to
          include auto-fix rules for faster remediation
        </li>
      </ul>

      <h2>Quick Example</h2>
      <p>
        Search for patterns using backticks and metavariables (like{' '}
        <code>$msg</code>):
      </p>
      <pre>
        grit apply '`console.log($msg)` =&gt; `winston.log($msg)`'
      </pre>

      <p>
        Save patterns to enforce as custom lints, with powerful where clauses
        to exclude specific cases:
      </p>
      <pre>
        {`\`console.log($msg)\` => \`winston.log($msg)\` where {
  $msg <: not within or { \`it($_, $_)\`, \`test($_, $_)\` }
}`}
      </pre>

      <h2>Use Cases</h2>
      <p>GritQL excels at automating:</p>
      <ul>
        <li>
          <strong>Large-scale migrations</strong> - Migrate APIs, frameworks,
          or refactor codebases across millions of lines
        </li>
        <li>
          <strong>Custom linting</strong> - Enforce team-specific code
          standards and best practices
        </li>
        <li>
          <strong>Code quality improvements</strong> - Systematically improve
          code quality with consistent patterns
        </li>
        <li>
          <strong>Dependency upgrades</strong> - Handle breaking changes when
          upgrading dependencies
        </li>
      </ul>

      <hr />

      <CardGrid
        cards={[
          {
            title: 'Interactive Tutorial',
            Icon: BiLibrary,
            text: 'Learn GritQL step-by-step',
            color: 'blue',
            href: '/tutorials/gritql',
          },
          {
            title: 'Language Reference',
            Icon: BiCodeAlt,
            text: 'Complete GritQL documentation',
            color: 'blue',
            href: '/language/overview',
          },
          {
            title: 'CLI Quickstart',
            text: 'Install and use the Grit CLI',
            Icon: BiTerminal,
            color: 'blue',
            href: '/cli/quickstart',
          },
        ]}
      />
    </>
  );
}
