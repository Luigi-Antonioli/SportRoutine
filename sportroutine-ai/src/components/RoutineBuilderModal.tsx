import React, { useState } from 'react';
import { X, Sparkles, Clock, Target, Calendar, Dumbbell, AlertCircle } from 'lucide-react';
import { SportFormData } from '../types';

interface RoutineBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export const RoutineBuilderModal: React.FC<RoutineBuilderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<SportFormData>({
    sport: 'Corrida',
    level: 'Iniciante',
    objective: 'Melhorar o condicionamento físico geral',
    days: ['Segunda', 'Quarta', 'Sexta'],
    timePerDay: '45 minutos',
    notes: '',
  });

  if (!isOpen) return null;

  const sportsList = [
    'Corrida',
    'Vôlei',
    'Musculação',
    'Calistenia',
    'Ciclismo',
    'Natação',
    'Futebol',
    'Basquete',
    'Artes Marciais / Boxe',
    'Pilates / Mobilidade',
    'Outro',
  ];

  const levelsList = ['Iniciante', 'Intermediário', 'Avançado'];

  const objectivesList = [
    'Melhorar o condicionamento físico geral',
    'Ganho de força e massa muscular',
    'Evoluir técnica e fundamentos específicos',
    'Aumentar resistência e ritmo (pace)',
    'Perda de gordura e consistência',
    'Flexibilidade, postura e prevenção de lesões',
  ];

  const allDays = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo',
  ];

  const timesList = [
    '20 minutos',
    '30 minutos',
    '45 minutos',
    '60 minutos',
    '90 minutos',
  ];

  const toggleDay = (day: string) => {
    setFormData((prev) => {
      const exists = prev.days.includes(day);
      const newDays = exists ? prev.days.filter((d) => d !== day) : [...prev.days, day];
      return { ...prev, days: newDays };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = `Gere uma rotina estruturada de ${formData.sport}:
- Nível de experiência: ${formData.level}
- Objetivo principal: ${formData.objective}
- Dias disponíveis: ${formData.days.length > 0 ? formData.days.join(', ') : '3 dias na semana'}
- Tempo disponível por sessão: ${formData.timePerDay}
${formData.notes.trim() ? `- Observações / Restrições: ${formData.notes.trim()}` : ''}

Por favor, apresente a divisão detalhada com tarefas, durações exatas respeitando os ${formData.timePerDay}, prioridades (Alta, Média ou Baixa) e orientações práticas.`;

    onSubmit(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#14171B] border border-[#262B31] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#262B31]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C6FF3D]/10 text-[#C6FF3D]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#F2F3F4]">
                Assistente de Rotina
              </h3>
              <p className="text-xs text-[#8A9099]">
                Preencha seus parâmetros e a IA criará uma rotina personalizada
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A9099] hover:text-[#F2F3F4] hover:bg-[#1B1F24] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Esporte */}
          <div>
            <label className="block text-xs font-semibold text-[#8A9099] uppercase tracking-wider mb-2">
              1. Modalidade ou Esporte
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sportsList.map((sport) => (
                <button
                  type="button"
                  key={sport}
                  onClick={() => setFormData({ ...formData, sport })}
                  className={`p-2 rounded-xl text-xs font-medium border text-left transition cursor-pointer ${
                    formData.sport === sport
                      ? 'bg-[#C6FF3D]/10 border-[#C6FF3D] text-[#C6FF3D]'
                      : 'bg-[#1B1F24] border-[#262B31] text-[#8A9099] hover:text-[#F2F3F4]'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* Nível */}
          <div>
            <label className="block text-xs font-semibold text-[#8A9099] uppercase tracking-wider mb-2">
              2. Nível de Experiência
            </label>
            <div className="grid grid-cols-3 gap-2">
              {levelsList.map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setFormData({ ...formData, level })}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                    formData.level === level
                      ? 'bg-[#C6FF3D]/10 border-[#C6FF3D] text-[#C6FF3D]'
                      : 'bg-[#1B1F24] border-[#262B31] text-[#8A9099] hover:text-[#F2F3F4]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-xs font-semibold text-[#8A9099] uppercase tracking-wider mb-2">
              3. Objetivo Principal
            </label>
            <div className="space-y-1.5">
              {objectivesList.map((obj) => (
                <button
                  type="button"
                  key={obj}
                  onClick={() => setFormData({ ...formData, objective: obj })}
                  className={`w-full p-2.5 rounded-xl text-xs font-medium border text-left transition flex items-center justify-between cursor-pointer ${
                    formData.objective === obj
                      ? 'bg-[#C6FF3D]/10 border-[#C6FF3D] text-[#C6FF3D]'
                      : 'bg-[#1B1F24] border-[#262B31] text-[#8A9099] hover:text-[#F2F3F4]'
                  }`}
                >
                  <span>{obj}</span>
                  {formData.objective === obj && <span className="text-[#C6FF3D] text-xs font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Dias Disponíveis */}
          <div>
            <label className="block text-xs font-semibold text-[#8A9099] uppercase tracking-wider mb-2">
              4. Dias Disponíveis
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allDays.map((day) => {
                const isSelected = formData.days.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#C6FF3D] text-[#0B0D0F] border-[#C6FF3D] font-semibold'
                        : 'bg-[#1B1F24] border-[#262B31] text-[#8A9099] hover:text-[#F2F3F4]'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tempo Disponível */}
          <div>
            <label className="block text-xs font-semibold text-[#8A9099] uppercase tracking-wider mb-2">
              5. Tempo por Sessão
            </label>
            <div className="flex flex-wrap gap-2">
              {timesList.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setFormData({ ...formData, timePerDay: t })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    formData.timePerDay === t
                      ? 'bg-[#C6FF3D]/10 border-[#C6FF3D] text-[#C6FF3D]'
                      : 'bg-[#1B1F24] border-[#262B31] text-[#8A9099] hover:text-[#F2F3F4]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Observações / Restrições */}
          <div>
            <label className="block text-xs font-semibold text-[#8A9099] uppercase tracking-wider mb-2">
              6. Observações ou Restrições (Opcional)
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ex: Treino em casa sem equipamentos; Leve dor no joelho; Foco em técnicas de saque..."
              className="w-full bg-[#1B1F24] border border-[#262B31] rounded-xl p-3 text-xs text-[#F2F3F4] outline-none focus:border-[#7FA324] placeholder:text-[#8A9099]/60"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#262B31] bg-[#0B0D0F] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#8A9099] hover:text-[#F2F3F4] hover:bg-[#14171B] transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#C6FF3D] text-[#0B0D0F] font-['Space_Grotesk'] font-bold text-xs hover:opacity-90 active:scale-95 transition shadow-md shadow-[#C6FF3D]/10 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gerar Rotina com IA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
