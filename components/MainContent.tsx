import React, { ReactNode } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Sidebar from '@/components/sidebar';

interface MainContentProps {
  children: ReactNode; 
}

export function MainContent({ children }: MainContentProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel className='h-full w-[16rem]'>
        <div className="h-full w-[16rem]">
          <Sidebar />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="w-full h-full">
          <span className="font-semibold">{children}</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold"></span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
    </ResizablePanelGroup>
  );
}
