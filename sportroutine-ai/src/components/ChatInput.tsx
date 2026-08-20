import React, { useRef, useEffect } from 'react';
import { SendHorizontal, Sparkles, AlertCircle } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onOpenWizard: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  onOpenWizard,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoGrow = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  useEffect(() => {
    autoGrow();
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <footer className="border-t border-[#262B31] p-3 sm:p-4 bg-[#0B0D0F] sticky bottom-0 z-20">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        {/* Input Wrapper */}
        <div className="flex items-end gap-2 bg-[#14171B] border border-[#262B31] focus-within:border-[#7FA324] rounded-2xl p-2 pl-3.5 transition-colors shadow-lg">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva seu esporte, objetivo, dias e tempo disponível..."
            className="flex-1 bg-transparent border-none outline-none resize-none text-[#F2F3F4] text-sm sm:text-[14.5px] leading-relaxed max-h-[140px] py-1.5 placeholder:text-[#8A9099]"
            disabled={isLoading}
          />

          <div className="flex items-center gap-1 shrink-0 pb-0.5">
            <button
              type="button"
              onClick={onOpenWizard}
              className="p-2 rounded-xl text-[#8A9099] hover:text-[#C6FF3D] hover:bg-[#1B1F24] transition-colors cursor-pointer"
              title="Assistente de formulário"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              onClick={onSend}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-[#C6FF3D] text-[#0B0D0F] flex items-center justify-center font-bold hover:opacity-90 active:scale-95 transition disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              aria-label="Enviar mensagem"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Disclaimer / Hint */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A9099] text-center px-2">
          <AlertCircle className="w-3 h-3 text-[#8A9099] shrink-0" />
          <span>
            Assistente de organização de hábitos. Não substitui orientação de profissionais de saúde ou educação física.
          </span>
        </div>
      </div>
    </footer>
  );
};
