import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface PersonaCardProps {
  title: string;
  subtitle: string;
  content: string;
  variant: 'ramsay' | 'lead' | 'coach';
}

const variants = {
  ramsay: {
    number: '01',
    color: 'bg-red-600',
    headerAccent: 'text-red-600',
    wrapperClass: 'variant-ramsay',
  },
  lead: {
    number: '02',
    color: 'bg-blue-600',
    headerAccent: 'text-blue-600',
    wrapperClass: 'variant-lead',
  },
  coach: {
    number: '03',
    color: 'bg-[#5A5A40]',
    headerAccent: 'text-[#5A5A40]',
    wrapperClass: 'variant-coach',
  }
};

export function PersonaCard({ title, subtitle, content, variant }: PersonaCardProps) {
  const config = variants[variant];
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className={cn(
          "w-10 h-10 shrink-0 rounded-full text-white flex items-center justify-center font-bold font-serif italic text-xl",
          config.color
        )}>
          {config.number}
        </span>
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tighter text-[#1A1A1A]">{title}</h2>
          <div className={cn("text-[10px] font-bold uppercase tracking-widest mt-0.5", config.headerAccent)}>
            {subtitle}
          </div>
        </div>
      </div>
      <div className="flex-1 border-t border-[#1A1A1A] pt-4">
        <div className={cn("markdown-body", config.wrapperClass)}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </motion.section>
  );
}
