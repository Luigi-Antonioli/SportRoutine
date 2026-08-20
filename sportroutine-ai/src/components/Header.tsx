import React from 'react';
import { PlusCircle, Bookmark, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onNewChat: () => void;
  onOpenSaved: () => void;
  onOpenWizard: () => void;
  savedCount: number;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
  onOpenSaved,
  onOpenWizard,
  savedCount,
  isGenerating,
}) => {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#262B31] bg-[#0B0D0F]/95 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div 
          className="w-8.5 h-8.5 rounded-lg bg-[#C6FF3D] flex items-center justify-center font-['Space_Grotesk'] font-bold text-[#0B0D0F] text-sm shadow-sm select-none"
        >
          SR
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold tracking-tight text-[#F2F3F4] m-0">
              SportRoutine AI
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#14171B] border border-[#262B31] text-[#8A9099]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-pulse"></span>
              Gemini 3.7 Flash
            </span>
          </div>
          <span className="text-xs text-[#8A9099]">
            Organização de rotinas esportivas
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenWizard}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14171B] border border-[#262B31] hover:border-[#7FA324] hover:text-[#C6FF3D] text-[#F2F3F4] transition-colors cursor-pointer"
          title="Montar rotina com assistente passo a passo"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C6FF3D]" />
          <span>Criar Rotina</span>
        </button>

        <button
          onClick={onOpenSaved}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14171B] border border-[#262B31] hover:border-[#7FA324] hover:text-[#F2F3F4] text-[#8A9099] transition-colors cursor-pointer relative"
          title="Minhas rotinas salvas"
        >
          <Bookmark className="w-3.5 h-3.5 text-[#C6FF3D]" />
          <span className="hidden xs:inline">Salvas</span>
          {savedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#C6FF3D] text-[#0B0D0F] font-bold text-[10px] leading-tight">
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={onNewChat}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border border-[#262B31] hover:border-[#7FA324] hover:text-[#F2F3F4] text-[#8A9099] transition-colors cursor-pointer disabled:opacity-40"
          title="Iniciar nova conversa"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nova conversa</span>
        </button>
      </div>
    </header>
  );
};
