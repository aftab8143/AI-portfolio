// app/components/AssistantWrapper.jsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import with SSR disabled
const AssistantLauncher = dynamic(() => import('./AssistantLauncher'), {
  ssr: false,
});

export default function AssistantWrapper() {
  return <AssistantLauncher />;
}
