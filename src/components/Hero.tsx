import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Zap,
  MousePointer2,
  BarChart3,
  Globe,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { FadeIn } from './ui/FadeIn';

// --- SLIDES CONFIGURATION ---
const SLIDES = [
  {
    id: 'feedback',
    category: 'Product Feedback',
    icon: MessageSquare,
    accent: 'indigo',
    question: 'How would you rate our new dashboard?',
    subtext: 'Your input helps us improve the experience for everyone.',
    targetIndex: 4,
    content: (state: string) => (
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div className="flex justify-between gap-2 md:gap-3">
          {[1, 2, 3, 4, 5].map((n, _) => (
            <div
              key={n}
              className={`
                flex-1 h-14 md:h-16 rounded-xl border-2 flex items-center justify-center text-lg font-medium transition-all duration-500
                ${state === 'done' && n === 5
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                  : 'bg-white border-zinc-100 text-zinc-400'}
              `}
            >
              {n}
            </div>
          ))}
        </div>
        <div className="h-14 bg-zinc-50/50 rounded-xl border border-zinc-200/60 flex items-center px-4 text-zinc-500 text-sm italic">
          <span className="w-0.5 h-4 bg-indigo-500 animate-pulse mr-2"></span>
          "The new charts are incredibly intuitive..."
        </div>
      </div>
    )
  },
  {
    id: 'poll',
    category: 'Feature Vote',
    icon: Zap,
    accent: 'violet',
    question: 'Which integration is most critical for you?',
    subtext: 'Help us prioritize our roadmap for Q4.',
    targetIndex: 0,
    content: (state: string) => (
      <div className="w-full max-w-lg mx-auto space-y-3">
        {['Slack Notifications', 'Jira Sync', 'Zapier Webhooks'].map((opt, i) => (
          <div
            key={opt}
            className={`
              relative p-4 rounded-xl border transition-all duration-500 overflow-hidden
              ${state === 'done' && i === 0
                ? 'border-violet-500 bg-violet-50/30'
                : 'border-zinc-100 bg-white'}
            `}
          >
            {/* Voted Progress Bar Background */}
            {state === 'done' && (
              <div
                className={`absolute inset-0 bg-violet-500/5 transition-all duration-1000 ease-out`}
                style={{ width: i === 0 ? '68%' : i === 1 ? '22%' : '10%' }}
              />
            )}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${state === 'done' && i === 0 ? 'border-violet-600 bg-violet-600' : 'border-zinc-300'}`}>
                  {state === 'done' && i === 0 && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className={`font-medium ${state === 'done' && i === 0 ? 'text-zinc-900' : 'text-zinc-500'}`}>{opt}</span>
              </div>
              {state === 'done' && <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">{i === 0 ? '68%' : i === 1 ? '22%' : '10%'}</span>}
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'waitlist',
    category: 'Early Access',
    icon: Sparkles,
    accent: 'emerald',
    question: 'Join the waitlist for API v2',
    subtext: 'Get 50,000 free requests when we launch.',
    targetIndex: 0,
    content: (state: string) => (
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div className="relative">
          <div className={`
              w-full h-16 bg-white border rounded-2xl px-6 flex items-center text-base transition-all duration-500
              ${state === 'done' ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-zinc-200'}
            `}
          >
            <span className={state === 'done' ? 'text-zinc-900' : 'text-zinc-400'}>
              {state === 'done' ? 'sarah.design@company.com' : 'Enter your work email...'}
            </span>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button size="sm" className={`rounded-xl px-5 h-12 transition-all duration-500 ${state === 'done' ? 'bg-emerald-600' : 'bg-zinc-900'}`}>
              {state === 'done' ? 'Success' : 'Join Waitlist'}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
          <Lock size={12} />
          <span>Enterprise-grade data security</span>
        </div>
      </div>
    )
  }
];

const avatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/45.jpg",
  "https://randomuser.me/api/portraits/men/76.jpg",
];

export const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [interactionState, setInteractionState] = useState('idle');
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 110 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const sequence = () => {
      // 1. Move Cursor In
      setInteractionState('active');
      setCursorPos({ x: 70, y: 65 });

      // 2. Click
      setTimeout(() => setIsClicking(true), 1200);
      setTimeout(() => {
        setIsClicking(false);
        setInteractionState('done');
      }, 1400);

      // 3. Reset for next
      setTimeout(() => {
        setInteractionState('idle');
        setCursorPos({ x: 50, y: 110 });
        setTimeout(() => {
          setActiveSlide((prev) => (prev + 1) % SLIDES.length);
        }, 500);
      }, 4000);
    };

    const timer = setInterval(sequence, 5500);
    sequence(); // Initial run
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-24 pb-20 md:pt-40 md:pb-40 overflow-hidden bg-white">
      {/* Subtle Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-violet-50/40 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-20 items-center">

          {/* Text Content */}
          <div className="max-w-4xl text-center space-y-8">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-indigo-200/60 text-zinc-600 text-sm font-semibold mb-2">
                <Sparkles size={14} className="text-indigo-600" />
                <span>The Modern Form Experience</span>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="text-6xl md:text-[84px] font-bold tracking-tight text-zinc-900 leading-[0.95] mb-8">
                Forms that feel <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">
                  like Conversation.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-200/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
                  </svg>                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto">
                Create high-converting, beautiful experiences. Stop building boring forms and start building relationships.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                <Link to="/signup">
                  <Button size="lg" className="h-14 px-10 text-base rounded-2xl bg-blue-700 hover:bg-blue-800 shadow-2xl shadow-zinc-200 transition-all hover:-translate-y-1">
                    Start building free
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="flex -space-x-3">
                    {avatars.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Avatar ${index + 1}`}
                        className="w-9 h-9 rounded-full border-2 border-white ring-1 ring-zinc-200 object-cover bg-zinc-100"
                      />
                    ))}
                  </div>

                  <span className="text-sm text-zinc-500 font-medium">
                    400+ Teams Joined
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Interactive Demo Card */}
          <div className="w-full max-w-7xl relative">
            <FadeIn delay={400}>
              <div className="relative bg-white rounded-[2rem] border border-zinc-200/60 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] overflow-hidden aspect-[16/10] md:aspect-[16/8]">

                {/* Browser-like Header */}
                <div className="h-12 border-b border-zinc-100 bg-zinc-50/30 flex items-center px-6 justify-between">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-1 rounded-lg bg-white border border-zinc-200 text-[10px] font-bold text-zinc-400 flex items-center gap-2 shadow-sm">
                      <Globe size={10} className='text-blue-400' />
                      craft.io/COMPANY/feedback
                    </div>
                  </div>
                  <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Main Canvas */}
                <div className="relative h-full w-full bg-white flex">
                  {/* Left: Sidebar Progress */}
                  <div className="hidden md:flex w-20 border-r border-zinc-50 flex-col items-center py-8 gap-10">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-black text-xl">C</div>
                    <div className="flex-1 flex flex-col gap-6">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`w-1 h-8 rounded-full transition-all duration-700 ${i === activeSlide ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]' : 'bg-zinc-100'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Center: Interactive Slide */}
                  <div className="flex-1 relative flex items-center justify-center p-8 md:p-12">
                    {SLIDES.map((slide, index) => (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
                            ${index === activeSlide ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'}
                        `}
                      >
                        <div className="w-full max-w-2xl text-center space-y-6">
                          <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-zinc-400">
                              <slide.icon size={14} className={`text-${slide.accent}-500`} />
                              {slide.category}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                              {slide.question}
                            </h2>
                            <p className="text-zinc-400 text-base md:text-lg max-w-md mx-auto">{slide.subtext}</p>
                          </div>

                          <div className="pt-4">{slide.content(index === activeSlide ? interactionState : 'idle')}</div>
                        </div>
                      </div>
                    ))}

                    {/* Cursor Interaction */}
                    <div
                      className="absolute z-50 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
                      style={{
                        left: `${cursorPos.x}%`,
                        top: `${cursorPos.y}%`,
                        opacity: interactionState === 'active' ? 1 : 0
                      }}
                    >
                      <div className="relative">
                        <MousePointer2
                          className={`w-6 h-6 fill-zinc-900 text-white drop-shadow-lg transition-transform duration-150 ${isClicking ? 'scale-75' : 'scale-100'}`}
                        />
                        <div className="absolute top-6 left-4 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xl whitespace-nowrap">
                          Sarah is responding
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Results Floating Card */}
                <div
                  className={`
                    absolute top-20 right-8 w-60 bg-white/80 backdrop-blur-xl rounded-2xl border border-zinc-200/50 shadow-2xl p-4 z-40
                    transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] hidden md:block
                    ${interactionState === 'done' ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}
                  `}
                >
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-2">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter flex items-center gap-2">
                      <BarChart3 size={12} className="text-indigo-500" />
                      Live Analytics
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">SJ</div>
                      <div className="flex-1 space-y-1.5">
                        <div className="h-1.5 w-full bg-zinc-100 rounded-full" />
                        <div className="h-1.5 w-2/3 bg-zinc-50 rounded-full" />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-zinc-50">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1">
                        <span>Completion Rate</span>
                        <span className="text-indigo-600">94.2%</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[94%] transition-all duration-1000" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Toast */}
                <div
                  className={`
                    absolute bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50
                    transition-all duration-700
                    ${interactionState === 'done' ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                  `}
                >
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="font-medium text-sm">Response recorded successfully</span>
                </div>

              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};