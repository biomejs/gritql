import type { MarkdocCodeFenceProps } from './monaco';
import { CodeBlock } from './monaco';

// We need this wrapper to provide a server-side placeholder
export function ServerCodeBlock(props: MarkdocCodeFenceProps) {
  return (
    <div>
      <CodeBlock {...props} />
    </div>
  );
}
