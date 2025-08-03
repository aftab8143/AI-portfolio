import { Suspense } from 'react';
import Projects from '../components/projects';

export default function ProjectsPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
          <Projects />
      </Suspense>
  );
}
