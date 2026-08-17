import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { AudienceSection } from '@/components/landing/AudienceSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { DownloadBanner } from '@/components/landing/DownloadBanner';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-200 selection:text-primary-900">
      <LandingHeader />
      <main>
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <AudienceSection />
        <TestimonialsSection />
        <DownloadBanner />
      </main>
      <LandingFooter />
    </div>
  );
}
