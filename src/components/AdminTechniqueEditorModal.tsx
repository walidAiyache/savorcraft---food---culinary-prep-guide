import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  Scissors,
  Flame,
  Droplet,
  Layers,
  Wind,
  Lightbulb,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { PrepTechnique, Difficulty } from '../types';
import { sanitizeSafeJsonString } from '../utils/security';

interface AdminTechniqueEditorModalProps {
  initialTechnique?: PrepTechnique | null;
  onClose: () => void;
  onSave: (technique: PrepTechnique) => void;
}

export const AdminTechniqueEditorModal: React.FC<AdminTechniqueEditorModalProps> = ({
  initialTechnique,
  onClose,
  onSave,
}) => {
  const isEditing = !!initialTechnique;

  const [title, setTitle] = useState<string>(initialTechnique?.title || '');
  const [category, setCategory] = useState<PrepTechnique['category']>(
    initialTechnique?.category || 'Knife Skills'
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(initialTechnique?.difficulty || 'Intermediate');
  const [timeNeeded, setTimeNeeded] = useState<string>(initialTechnique?.timeNeeded || '15 mins');
  const [summary, setSummary] = useState<string>(initialTechnique?.summary || '');
  const [sciencePrinciple, setSciencePrinciple] = useState<string>(
    initialTechnique?.sciencePrinciple || ''
  );
  const [proTip, setProTip] = useState<string>(initialTechnique?.proTip || '');
  const [equipmentInput, setEquipmentInput] = useState<string>(
    initialTechnique?.equipment?.join(', ') || '8-inch Chef Knife, End-grain Cutting Board'
  );
  const [mistakesInput, setMistakesInput] = useState<string>(
    initialTechnique?.mistakesToAvoid?.join('\n') ||
      'Using a dull blade\nMoving knife tip off the board\nFlat fingers on food'
  );

  const [steps, setSteps] = useState<Array<{ number: number; title: string; description: string }>>(
    initialTechnique?.steps?.length
      ? initialTechnique.steps
      : [
          {
            number: 1,
            title: 'Initial Preparation & Grip',
            description: 'Establish safe finger positioning and proper kitchen stance.',
          },
          {
            number: 2,
            title: 'Execution & Control',
            description: 'Maintain uniform pressure and steady motion through each cut.',
          },
        ]
  );

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        number: steps.length + 1,
        title: '',
        description: '',
      },
    ]);
  };

  const handleUpdateStep = (
    index: number,
    fields: Partial<{ title: string; description: string }>
  ) => {
    const next = [...steps];
    next[index] = { ...next[index], ...fields };
    setSteps(next);
  };

  const handleRemoveStep = (index: number) => {
    const next = steps
      .filter((_, i) => i !== index)
      .map((st, i) => ({ ...st, number: i + 1 }));
    setSteps(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedTechnique: PrepTechnique = {
      id:
        initialTechnique?.id ||
        `tech-${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)}`,
      title: sanitizeSafeJsonString(title),
      category,
      difficulty,
      timeNeeded: sanitizeSafeJsonString(timeNeeded || '10 mins'),
      summary: sanitizeSafeJsonString(summary || 'Master this fundamental culinary preparation technique.'),
      iconName:
        category === 'Knife Skills'
          ? 'Scissors'
          : category === 'Heat & Searing'
          ? 'Flame'
          : category === 'Emulsions & Sauces'
          ? 'Droplet'
          : category === 'Dough & Baking'
          ? 'Layers'
          : 'Wind',
      sciencePrinciple: sanitizeSafeJsonString(
        sciencePrinciple ||
        'Understanding heat transfer and cellular structure allows for optimal texture and flavor retention.'
      ),
      mistakesToAvoid: mistakesInput
        .split('\n')
        .map((m) => sanitizeSafeJsonString(m))
        .filter(Boolean),
      equipment: equipmentInput
        .split(',')
        .map((e) => sanitizeSafeJsonString(e))
        .filter(Boolean),
      steps: steps.map((st, i) => ({
        number: i + 1,
        title: sanitizeSafeJsonString(st.title || `Step ${i + 1}`),
        description: sanitizeSafeJsonString(st.description || 'Execute step.'),
      })),
      proTip: sanitizeSafeJsonString(proTip || 'Practice regularly with inexpensive vegetables like carrots and onions.'),
    };

    onSave(formattedTechnique);
    onClose();
  };

  return (
    <div
      id="admin-technique-editor-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-3xl w-full max-h-[90vh] rounded-3xl p-6 sm:p-8 overflow-y-auto shadow-2xl border border-[#ebd8c8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0e8dc] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c85a32] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display font-bold text-2xl text-[#1e1a17]">
                {isEditing ? 'Admin: Edit Master Technique' : 'Admin: Create Master Technique'}
              </h2>
              <p className="text-xs text-[#7e7164]">
                Publish a culinary masterclass guide with food science principles
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0e8dc] text-[#6d6054] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Technique Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Searing: The Maillard Reaction"
                className="w-full text-sm font-semibold px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:ring-2 focus:ring-[#c85a32]/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
              >
                <option value="Knife Skills">Knife Skills</option>
                <option value="Heat & Searing">Heat & Searing</option>
                <option value="Emulsions & Sauces">Emulsions & Sauces</option>
                <option value="Dough & Baking">Dough & Baking</option>
                <option value="Flavor & Seasoning">Flavor & Seasoning</option>
                <option value="Air Fryer & Convection">Air Fryer & Convection</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
                >
                  <option value="Easy">Easy</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Practice Time
                </label>
                <input
                  type="text"
                  value={timeNeeded}
                  onChange={(e) => setTimeNeeded(e.target.value)}
                  placeholder="e.g. 15 mins"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Technique Summary
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Explain the culinary objective and what the student will achieve..."
                className="w-full text-xs p-3 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                The Food Chemistry & Physics Principle
              </label>
              <textarea
                rows={3}
                value={sciencePrinciple}
                onChange={(e) => setSciencePrinciple(e.target.value)}
                placeholder="Explain why this works on a physical/chemical level..."
                className="w-full text-xs p-3 rounded-xl border border-[#ebd8c8] bg-[#faf5ef] text-[#4d4034] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Equipment Needed (comma separated)
              </label>
              <input
                type="text"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                placeholder="e.g. Cast Iron Skillet, Digital Thermometer, Tongs"
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Critical Mistakes to Avoid (one per line)
              </label>
              <textarea
                rows={3}
                value={mistakesInput}
                onChange={(e) => setMistakesInput(e.target.value)}
                placeholder="Using a cold pan&#10;Crowding ingredients&#10;Moving meat too early"
                className="w-full text-xs p-3 rounded-xl border border-[#fed7d7] bg-[#fff8f8] text-[#7a2727] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Chef's Pro Tip
              </label>
              <input
                type="text"
                value={proTip}
                onChange={(e) => setProTip(e.target.value)}
                placeholder="e.g. Always dry the surface with a paper towel before searing."
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#fae2d0] bg-[#fffaf5] text-[#8c3b1c]"
              />
            </div>
          </div>

          {/* Steps */}
          <div className="border-t border-[#f0e8dc] pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif-display font-bold text-lg text-[#1f1a16]">
                Step-by-Step Instructions ({steps.length})
              </h3>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs font-bold text-[#c85a32] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((st, idx) => (
                <div key={idx} className="p-3.5 bg-[#faf6f0] rounded-xl border border-[#eae0d2] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#c85a32] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => handleUpdateStep(idx, { title: e.target.value })}
                      placeholder="Step Title (e.g. Dry-Brining)"
                      className="flex-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#ded5c8] bg-white"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1 text-[#a89c90] hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={st.description}
                    onChange={(e) => handleUpdateStep(idx, { description: e.target.value })}
                    placeholder="Step detailed instructions..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#ded5c8] bg-white focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-[#f0e8dc] pt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#ded5c8] text-xs font-semibold text-[#5a4d41] hover:bg-[#f4efe8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b04a25] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              {isEditing ? 'Save Technique Changes' : 'Publish Technique to Academy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
