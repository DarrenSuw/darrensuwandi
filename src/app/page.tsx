import HeroAboutSequence from '@/components/sections/HeroAboutSequence';
import ResearchSection from '@/components/sections/ResearchSection';
import WritingSection from '@/components/sections/WritingSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import TimelineSection from '@/components/sections/TimelineSection';
import TechStackSection from '@/components/sections/TechStackSection';
import RecognitionSection from '@/components/sections/RecognitionSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <>
      <HeroAboutSequence />
      <ResearchSection />
      <WritingSection />
      <ProjectsSection />
      <TimelineSection />
      <TechStackSection />
      <RecognitionSection />
      <ContactSection />
    </>
  );
}
