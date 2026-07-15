import React from 'react';
import { Sparkles, AlignLeft, Award, Building2 } from 'lucide-react';

interface TemplateSwitcherProps {
  current: 'modern' | 'minimal' | 'premium' | 'corporate';
  onChange: (template: 'modern' | 'minimal' | 'premium' | 'corporate') => void;
}

const TEMPLATES = [
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'Clean Indigo Accents',
    icon: Sparkles
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'Elegant Monospaced feel',
    icon: AlignLeft
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    description: 'Luxury Golden Serif',
    icon: Award
  },
  {
    id: 'corporate' as const,
    name: 'Corporate',
    description: 'Structured Slate Blue',
    icon: Building2
  }
];

export const TemplateSwitcher: React.FC<TemplateSwitcherProps> = ({ current, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Choose Design Style</label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TEMPLATES.map((tmpl) => {
          const Icon = tmpl.icon;
          const active = current === tmpl.id;

          return (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onChange(tmpl.id)}
              className={`p-3 text-left rounded-xl border flex flex-col items-start gap-1.5 transition-all duration-200 group cursor-pointer ${
                active
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${active ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/60'}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{tmpl.name}</p>
                <p className={`text-[9px] leading-tight mt-0.5 ${active ? 'text-white/70' : 'text-slate-405'}`}>
                  {tmpl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
