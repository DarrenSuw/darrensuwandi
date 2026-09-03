'use client';

import { useRef, useState, useEffect } from 'react';
import SectionLabel from '@/components/ui/SectionLabel';
import ProjectCarousel from './ProjectCarousel';
import ProjectModal from './ProjectModal';
import { projects, type Project } from '@/data/projects';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import MaskReveal from '@/components/ui/MaskReveal';

export default function ProjectsSection() {

  const [openProject, setOpenProject] = useState<Project | null>(null);

  const handleNext = () => {
    if (!openProject) return;
    const i = projects.findIndex(p => p.id === openProject.id);
    setOpenProject(projects[(i + 1) % projects.length]);
  };
  const handlePrev = () => {
    if (!openProject) return;
    const i = projects.findIndex(p => p.id === openProject.id);
    setOpenProject(projects[(i - 1 + projects.length) % projects.length]);
  };

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const p = projects.find(proj => proj.id === customEvent.detail);
      if (p) {
        setOpenProject(p);
      }
    };
    window.addEventListener('openProjectModal', handleOpenModal);
    return () => window.removeEventListener('openProjectModal', handleOpenModal);
  }, []);

  // Header reveal
  const headerRef = useRef<HTMLDivElement>(null);
  const headerVisible = useScrollReveal(headerRef, { threshold: 0.3 });

  // Carousel entrance (fires once on first scroll into view)
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselVisible = useScrollReveal(carouselRef, { threshold: 0.15 });

  const headerReveal = (delay: number): React.CSSProperties =>
    headerVisible
      ? { animationName: 'fadeUp', animationDuration: '600ms', animationTimingFunction: 'var(--ease-entrance)', animationFillMode: 'both', animationDelay: `${delay}ms` }
      : { opacity: 0 };

  return (
    <section id="projects" className="glass-section" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)', borderTop: '1px solid var(--border)' }}>
      <div className="sc">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col items-center text-center gap-3 mb-12">
          <span className="t-label" style={headerReveal(0)}>// Selected Works</span>
          <MaskReveal visible={headerVisible} delay={80}>
            <h2 className="t-display" style={{ fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)', maxWidth: '20ch' }}>
              Featured Systems &amp; Builds
            </h2>
          </MaskReveal>

          <p className="t-body" style={{ fontSize: '0.875rem', maxWidth: '44ch', ...headerReveal(160) }}>
            Full-stack AI systems, LLM pipelines, and ML-integrated products.
          </p>
        </div>

        {/* Carousel — center card rises in on first view; side cards fade 150ms after */}
        <div ref={carouselRef}>
          <ProjectCarousel
            projects={projects}
            onOpenProject={setOpenProject}
            entranceVisible={carouselVisible}
          />
        </div>
      </div>

      <ProjectModal
        project={openProject}
        isOpen={openProject !== null}
        onClose={() => setOpenProject(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
}
