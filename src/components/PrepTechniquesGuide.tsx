import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Droplet,
  Layers,
  Wind,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Search,
  BookOpen,
  Scissors
} from 'lucide-react';
import { CULINARY_TECHNIQUES } from '../data/techniques';
import { PrepTechnique } from '../types';

interface PrepTechniquesGuideProps {
  techniques?: PrepTechnique[];
}

export const PrepTechniquesGuide: React.FC<PrepTechniquesGuideProps> = ({
  techniques = CULINARY_TECHNIQUES,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTechnique, setActiveTechnique] = useState<PrepTechnique>(
    techniques[0] || CULINARY_TECHNIQUES[0]
  );

  const categories = [
    { id: 'all', label: 'All Masterclasses' },
    { id: 'Knife Skills', label: 'Knife Skills' },
    { id: 'Heat & Searing', label: 'Heat & Searing' },
    { id: 'Emulsions & Sauces', label: 'Emulsions & Sauces' },
    { id: 'Dough & Baking', label: 'Dough & Baking' },
    { id: 'Air Fryer & Convection', label: 'Air Fryer Dynamics' },
  ];

  const filteredTechniques = techniques.filter((tech) => {
    const matchesCat = selectedCategory === 'all' || tech.category === selectedCategory;
    const matchesSearch =
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.sciencePrinciple.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Knife Skills':
        return Scissors;
      case 'Heat & Searing':
        return Flame;
      case 'Emulsions & Sauces':
        return Droplet;
      case 'Dough & Baking':
        return Layers;
      case 'Air Fryer & Convection':
        return Wind;
      default:
        return Sparkles;
    }
  };

  return (
    <div id="prep-techniques-guide" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] bg-[#fcf0e8] px-2.5 py-0.5 rounded-md">
            Culinary Arts Academy
          </span>
          <span className="text-[#c1b6a7]">•</span>
          <span className="text-xs text-[#73685e]">Fundamental Food Prep Science</span>
        </div>

        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1815] leading-tight mb-2">
          Master Prep Skills & Culinary Foundations
        </h1>

        <p className="text-sm sm:text-base text-[#5c5045] leading-relaxed">
          Great cooking is 80% preparation. Master the knife cuts, thermodynamic heat transfers, stable emulsions, and fermentation tests that elevate home cooks into culinary artisans.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#c85a32] text-white shadow-xs'
                  : 'bg-white text-[#5f5247] border border-[#e4dcd0] hover:bg-[#f7f2ea]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#9b8d80] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, cuts, science..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#ded5c8] rounded-xl text-[#2c2825] placeholder-[#a69a8d] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30"
          />
        </div>
      </div>

      {/* Two Column Layout: Technique Selector List on Left, Deep Drill-down on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Technique Menu Cards */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#796c60] mb-1">
            Curriculum Lessons ({filteredTechniques.length})
          </h3>

          {filteredTechniques.map((tech) => {
            const IconComp = getCategoryIcon(tech.category);
            const isSelected = activeTechnique.id === tech.id;

            return (
              <div
                key={tech.id}
                onClick={() => setActiveTechnique(tech)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#c85a32] shadow-sm ring-1 ring-[#c85a32]/30'
                    : 'bg-white border-[#ebe2d6] hover:border-[#dbcbb9] hover:bg-[#faf7f2]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#c85a32] text-white'
                        : 'bg-[#f4efe8] text-[#786a5d]'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase text-[#9e3a17]">
                        {tech.category}
                      </span>
                      <span className="text-[10px] text-[#8e8175] bg-[#f5ede3] px-1.5 py-0.5 rounded">
                        {tech.difficulty}
                      </span>
                    </div>

                    <h4 className="font-serif-display font-bold text-base text-[#1f1a17] leading-snug line-clamp-1">
                      {tech.title}
                    </h4>

                    <p className="text-xs text-[#6e6155] line-clamp-2 mt-1">
                      {tech.summary}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Deep Drill-down Detail Panel */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#e8ded1] shadow-xs space-y-6">
          
          {/* Active Technique Header */}
          <div className="border-b border-[#f0e8dd] pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c85a32] bg-[#faf0e8] px-2.5 py-0.5 rounded-md">
                {activeTechnique.category}
              </span>
              <span className="text-xs text-[#877a6e] bg-[#f6efe6] px-2 py-0.5 rounded-md">
                Difficulty: {activeTechnique.difficulty}
              </span>
              <span className="text-xs text-[#877a6e] bg-[#f6efe6] px-2 py-0.5 rounded-md">
                Practice Time: {activeTechnique.timeNeeded}
              </span>
            </div>

            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1c1815] leading-tight mb-3">
              {activeTechnique.title}
            </h2>

            <p className="text-sm sm:text-base text-[#574c42] leading-relaxed">
              {activeTechnique.summary}
            </p>
          </div>

          {/* The Science Principle Highlight Card */}
          <div className="p-5 bg-[#faf5ef] rounded-2xl border border-[#ebd8c8]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#c85a32]/10 rounded-xl text-[#c85a32] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-display font-bold text-lg text-[#1f1a16] mb-1">
                  The Food Chemistry & Physics Principle
                </h4>
                <p className="text-xs sm:text-sm text-[#5f5247] leading-relaxed">
                  {activeTechnique.sciencePrinciple}
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Technique Execution */}
          <div>
            <h3 className="font-serif-display font-bold text-xl text-[#1f1a16] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#c85a32]" />
              Execution Steps
            </h3>

            <div className="space-y-4">
              {activeTechnique.steps.map((st) => (
                <div key={st.number} className="p-4 rounded-xl bg-[#faf8f5] border border-[#eee6dc]">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#c85a32] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {st.number}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-[#251f1a] mb-1">
                        {st.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#5a4e44] leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Pitfalls & Mistakes to Avoid */}
          <div className="p-5 bg-[#fff7f7] rounded-2xl border border-[#fed7d7]">
            <h4 className="font-bold text-sm text-[#c53030] mb-2.5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical Mistakes to Avoid
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#6c2828]">
              {activeTechnique.mistakesToAvoid.map((err, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#c53030] font-bold">•</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Gear & Chef Pro Tip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#faf6f1] border border-[#ede3d5]">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#796c60] mb-2">
                Essential Gear
              </h4>
              <ul className="text-xs text-[#594d42] space-y-1">
                {activeTechnique.equipment.map((eq, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700 shrink-0" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#fdf5f0] border border-[#fae2d0]">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#9c3a17] mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Chef's Pro Tip
              </h4>
              <p className="text-xs text-[#6e493b] leading-relaxed">
                {activeTechnique.proTip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
