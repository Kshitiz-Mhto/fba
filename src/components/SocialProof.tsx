import { FadeIn } from './ui/FadeIn';
import { Logos } from '../lib/logos'


export const SocialProof: React.FC = () => {
    return (
        <div className="border-b border-neutral-100 bg-white py-16">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <FadeIn delay={200}>
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-10">Trusted by modern teams</p>
                    <div className="flex flex-wrap justify-center items-center gap-x-10 md:gap-x-16 gap-y-8">
                        <div className="flex items-center gap-3 text-neutral-500 hover:text-[#000000] transition-colors duration-300 transform hover:scale-105 cursor-pointer group">
                            <Logos.Notion />
                            <span className="text-xl font-bold tracking-tight text-neutral-600 group-hover:text-inherit">Notion</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-500 hover:text-[#5E51E5] transition-colors duration-300 transform hover:scale-105 cursor-pointer group">
                            <Logos.Linear />
                            <span className="text-xl font-bold tracking-tight text-neutral-600 group-hover:text-inherit">Linear</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-500 hover:text-[#000000] transition-colors duration-300 transform hover:scale-105 cursor-pointer group">
                            <Logos.Vercel />
                            <span className="text-xl font-bold tracking-tight text-neutral-600 group-hover:text-inherit">Vercel</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-500 hover:text-[#0055FF] transition-colors duration-300 transform hover:scale-105 cursor-pointer group">
                            <Logos.Framer />
                            <span className="text-xl font-bold tracking-tight text-neutral-600 group-hover:text-inherit">Framer</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-500 hover:text-[#FF5A5F] transition-colors duration-300 transform hover:scale-105 cursor-pointer group">
                            <Logos.Raycast />
                            <span className="text-xl font-bold tracking-tight text-neutral-600 group-hover:text-inherit">Raycast</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-500 hover:text-[#FFDD00] transition-colors duration-300 transform hover:scale-105 cursor-pointer group">
                            <Logos.BuyMeACoffee />
                            <span className="text-xl font-bold tracking-tight text-neutral-600 group-hover:text-inherit whitespace-nowrap">Buy Me a Coffee</span>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};