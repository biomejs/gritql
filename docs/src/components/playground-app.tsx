/**
 * Self-contained React component for the GritQL Playground.
 * Composes all required providers and the StandaloneEditor.
 * Designed to be mounted as a single Astro `client:only="react"` island.
 */
import '../styles/editor.css';
import { WorkerAnalysisProvider } from '../workers/provider';
import { StandaloneEditorProvider } from './editor/context';
import { StandaloneEditor } from './editor/standalone-editor';
import { SidebarProvider } from '../hooks/sidebar';
import { MainProvider } from '../templates/main-provider';

export default function PlaygroundApp() {
  return (
    <MainProvider>
      <SidebarProvider>
        <WorkerAnalysisProvider>
          <StandaloneEditorProvider>
            <div style={{ height: '85vh', width: '100%' }}>
              <StandaloneEditor />
            </div>
          </StandaloneEditorProvider>
        </WorkerAnalysisProvider>
      </SidebarProvider>
    </MainProvider>
  );
}
