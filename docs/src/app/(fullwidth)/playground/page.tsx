import type { Metadata } from 'next';

import { PlaygroundEditor } from '@/components/playground';
import { WrapperContainer } from '@/templates/wrapper';
import { WorkerWrapper } from '@/templates/worker-wrapper';

export const metadata: Metadata = {
  title: 'Playground',
};

export default async function Playground() {
  return (
    <WorkerWrapper>
      <div className='w-full max-w-full min-h-screen px-6 py-8'>
        <div className='max-w-[1800px] mx-auto'>
          <h1 className='mb-6 text-3xl font-bold'>Grit Playground</h1>
          <div className='h-[85vh]'>
            <PlaygroundEditor />
          </div>
        </div>
      </div>
    </WorkerWrapper>
  );
}

