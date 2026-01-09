import React, { useEffect, useRef, useState } from 'react';
import { FadeIn } from './ui/FadeIn';
import { PenLine, Share2, BarChart3 } from 'lucide-react';

const STEPS = [
  {
    number: "01",
    title: "Draft",
    description: "Write your form like a document. Slash commands, rich text, and instant preview.",
    icon: PenLine
  },
  {
    number: "02",
    title: "Publish",
    description: "Share via a custom link or embed beautifully on your site with one line of code.",
    icon: Share2
  },
  {
    number: "03",
    title: "Insight",
    description: "Watch responses roll in real-time. Export to Notion, Linear, or CSV instantly.",
    icon: BarChart3
  }
];

export const HowItWorks: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn className="text-center mb-24">
          <h2 className="text-sm font-semibold text-brand-600 uppercase tracking-widest mb-3">Workflow</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            From idea to insight in minutes.
          </h3>
        </FadeIn>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          {/* We position it behind the icons. Using a mask or z-index to ensure numbers sit on top. */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-neutral-100 z-0 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 transition-all duration-[2000ms] ease-in-out`}
              style={{
                width: isVisible ? '100%' : '0%',
                opacity: isVisible ? 1 : 0
              }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {STEPS.map((step, index) => (
              <FadeIn key={index} delay={index * 200} className="flex flex-col items-center text-center group">

                {/* Step Node */}
                <div className="relative mb-8 cursor-default">
                  {/* The Box */}
                  <div className="w-16 h-16 bg-white border-2 border-neutral-100 rounded-2xl flex items-center justify-center text-lg font-bold text-neutral-400 shadow-[0_0_0_12px_rgba(255,255,255,1)] group-hover:border-brand-500 group-hover:text-brand-600 group-hover:scale-110 group-hover:shadow-[0_8px_30px_-4px_rgba(79,70,229,0.2)] transition-all duration-300 ease-out z-10 relative">

                    {/* Default Number State */}
                    <span className="group-hover:opacity-0 group-hover:scale-50 transition-all duration-300 absolute">
                      {step.number}
                    </span>

                    {/* Hover Icon State */}
                    <span className="opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 absolute">
                      <step.icon size={24} className="text-brand-600" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-brand-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-neutral-500 leading-relaxed text-base max-w-xs mx-auto">
                  {step.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};