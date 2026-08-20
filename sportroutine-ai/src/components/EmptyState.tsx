import React from 'react';
import { Sparkles, Dumbbell, Compass, Clock, Zap, Target } from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (text: string) => void;
  onOpenWizard: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt, onOpenWizard }) => {
  const promptChips = [
    {
      title: 'Rotina de corrida',
      icon: '🏃',
      prompt:
        'Pratico corrida, nível intermediário, objetivo é melhorar o condicionamento. Tenho segunda, quarta e sexta, 1 hora por dia. Monte uma rotina para essa semana.',
    },
    {
      title: 'Rotina de vôlei',
      icon: '🏐',
      prompt:
        'Jogo vôlei, sou iniciante, quero evoluir no saque e na recepção. Tenho 40 minutos por dia, de terça a sábado.',
    },
    {
      title: 'Adaptar rotina (20 min)',
      icon: '⏱️',
      prompt:
        'Preciso adaptar minha rotina atual porque essa semana só terei 20 minutos disponíveis por dia. Priorize o mais essencial.',
    },
    {
      title: 'Musculação / Força (45 min)',
      icon: '🏋️',
      prompt:
        'Faço musculação, nível intermediário, foco em ganho de massa magra. Tenho 45 minutos por dia, 4 vezes por semana (seg, ter, qui, sex). Monte a divisão de treino e tarefas com prioridades.',
    },
    {
      title: 'Calistenia em casa',
      icon: '🤸',
      prompt:
        'Quero treinar calistenia em casa, nível iniciante, sem equipamentos além de uma barra fixa. Tenho 35 minutos por dia, 3x na semana (seg/qua/sex).',
    },
    {
      title: 'Natação & Respiração',
      icon: '🏊',
      prompt:
        'Pratico natação, nível iniciante a intermediário, objetivo de melhorar a capacidade respiratória e resistência no estilo livre (crawl). Tenho 50 minutos, terças e quintas.',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 text-center">
      {/* Eyebrow & Hero */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14171B] border border-[#262B31] text-[#C6FF3D] font-['Space_Grotesk'] text-xs font-semibold tracking-wider uppercase mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        Comece por aqui
      </div>

      <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#F2F3F4] tracking-tight mb-2.5">
        Vamos montar sua rotina esportiva
      </h2>

      <p className="text-sm sm:text-base text-[#8A9099] max-w-lg mx-auto leading-relaxed mb-6">
        Conte seu <strong className="text-[#F2F3F4] font-medium">esporte</strong>,{' '}
        <strong className="text-[#F2F3F4] font-medium">nível</strong>,{' '}
        <strong className="text-[#F2F3F4] font-medium">objetivo</strong>,{' '}
        <strong className="text-[#F2F3F4] font-medium">dias</strong> e{' '}
        <strong className="text-[#F2F3F4] font-medium">tempo disponível</strong> — eu organizo as tarefas em uma rotina clara, prática e com prioridades.
      </p>

      {/* Primary Wizard Action */}
      <div className="mb-8">
        <button
          onClick={onOpenWizard}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C6FF3D] text-[#0B0D0F] font-['Space_Grotesk'] font-bold text-sm hover:opacity-90 active:scale-[0.98] transition shadow-lg shadow-[#C6FF3D]/10 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Montar com Assistente Passo a Passo</span>
        </button>
      </div>

      {/* Prompt Chips Section */}
      <div className="text-left border-t border-[#262B31] pt-6">
        <span className="text-xs font-medium text-[#8A9099] uppercase tracking-wider block text-center mb-3">
          Ou selecione um exemplo para começar rápido:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(chip.prompt)}
              className="group flex items-start gap-3 p-3 rounded-xl bg-[#14171B] border border-[#262B31] hover:border-[#7FA324] hover:bg-[#1B1F24] text-left transition-all cursor-pointer"
            >
              <span className="text-xl shrink-0 p-1 rounded-lg bg-[#0B0D0F] border border-[#262B31]">
                {chip.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-['Space_Grotesk'] text-sm font-semibold text-[#F2F3F4] group-hover:text-[#C6FF3D] transition-colors">
                  {chip.title}
                </div>
                <div className="text-xs text-[#8A9099] line-clamp-2 mt-0.5 leading-snug">
                  {chip.prompt}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
