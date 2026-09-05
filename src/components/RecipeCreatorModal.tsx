import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, ChefHat, Clock, Flame } from 'lucide-react';
import { Recipe, Cuisine, Category, Difficulty, CookingMethod, Ingredient, Step } from '../types';

interface RecipeCreatorModalProps {
  onClose: () => void;
  onSaveRecipe: (recipe: Recipe) => void;
}

export const RecipeCreatorModal: React.FC<RecipeCreatorModalProps> = ({ onClose, onSaveRecipe }) => {
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [cuisine, setCuisine] = useState<Cuisine>('Italian');
  const [category, setCategory] = useState<Category>('Mains');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [method, setMethod] = useState<CookingMethod>('Stovetop / Pan-Sear');
  const [prepTimeMins, setPrepTimeMins] = useState<number>(15);
  const [cookTimeMins, setCookTimeMins] = useState<number>(20);
  const [servings, setServings] = useState<number>(4);
  const [calories, setCalories] = useState<number>(450);
  const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80');
  const [description, setDescription] = useState<string>('');

  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: number; unit: string; category: any; note: string }>>([
    { name: 'Extra virgin olive oil', amount: 2, unit: 'tbsp', category: 'pantry_spices', note: '' },
    { name: 'Garlic cloves, minced', amount: 4, unit: 'cloves', category: 'produce', note: '' },
  ]);

  const [steps, setSteps] = useState<Array<{ title: string; time: string; timerSeconds: number; desc: string; secret: string }>>([
    { title: 'Prep the ingredients', time: '10 mins', timerSeconds: 0, desc: 'Mince garlic and wash all vegetables.', secret: 'Keep ingredients at uniform size for even cooking.' },
    { title: 'Cook and finish', time: '15 mins', timerSeconds: 15 * 60, desc: 'Heat olive oil and gently sauté aromatics until golden.', secret: 'Never burn the garlic!' },
  ]);

  const addIngredientRow = () => {
    setIngredients([...ingredients, { name: '', amount: 1, unit: 'cup', category: 'produce', note: '' }]);
  };

  const removeIngredientRow = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const addStepRow = () => {
    setSteps([...steps, { title: '', time: '5 mins', timerSeconds: 0, desc: '', secret: '' }]);
  };

  const removeStepRow = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedIngredients: Ingredient[] = ingredients.map((ing, i) => ({
      id: `custom-ing-${Date.now()}-${i}`,
      name: ing.name || 'Ingredient',
      amountBase: Number(ing.amount) || 1,
      unit: ing.unit || 'unit',
      metricBase: (Number(ing.amount) || 1) * 30,
      metricUnit: 'g',
      category: ing.category,
      note: ing.note,
    }));

    const formattedSteps: Step[] = steps.map((st, i) => ({
      step: i + 1,
      title: st.title || `Step ${i + 1}`,
      time: st.time || '5 mins',
      timerSeconds: st.timerSeconds > 0 ? st.timerSeconds : undefined,
      desc: st.desc || 'Follow the step instructions.',
      secret: st.secret || undefined,
    }));

    const newRecipe: Recipe = {
      id: `custom-recipe-${Date.now()}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      subtitle: subtitle || 'Custom handcrafted recipe',
      cuisine,
      category,
      difficulty,
      method,
      prepTimeMins: Number(prepTimeMins),
      cookTimeMins: Number(cookTimeMins),
      totalTimeMins: Number(prepTimeMins) + Number(cookTimeMins),
      servings: Number(servings),
      rating: 5.0,
      reviewsCount: 1,
      author: 'You (Custom Chef Recipe)',
      heroImage: heroImage.trim() || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
      description: description || 'A customized chef recipe created in Savor & Craft.',
      dietary: [],
      tags: ['Custom Recipe', 'Handcrafted'],
      equipmentNeeded: ['Chef Knife', 'Skillet / Pot'],
      ingredients: formattedIngredients,
      steps: formattedSteps,
      nutrition: {
        calories: Number(calories) || 400,
        proteinGrams: 20,
        carbsGrams: 35,
        fatGrams: 15,
      },
    };

    onSaveRecipe(newRecipe);
    onClose();
  };

  return (
    <div
      id="recipe-creator-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-3xl w-full max-h-[90vh] rounded-3xl p-6 sm:p-8 overflow-y-auto shadow-2xl border border-[#ebd8c8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#f0e8dc] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c85a32] text-white flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display font-bold text-2xl text-[#1e1a17]">
                Create & Publish Recipe
              </h2>
              <p className="text-xs text-[#7e7164]">
                Add your personal signature dish to the culinary guide
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
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Recipe Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Crispy Garlic Butter Pork Chops"
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:ring-2 focus:ring-[#c85a32]/30 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Short Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Pan-seared with rosemary and charred lemon butter sauce"
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:ring-2 focus:ring-[#c85a32]/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Cuisine
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value as Cuisine)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
              >
                {['Italian', 'French', 'Japanese', 'Thai', 'Spanish', 'Mediterranean', 'American', 'Mexican'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
              >
                {['Appetizers', 'Mains', 'Pasta & Noodles', 'Soups & Stews', 'Bowls & Salads', 'Baking & Bread', 'Desserts'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Cooking Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as CookingMethod)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
              >
                {['Stovetop / Pan-Sear', 'Oven / Roasting', 'Air Fryer', 'Slow Simmer', 'Boiling / Pasta', 'No-Cook / Fresh'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
              >
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">Prep Time (mins)</label>
                <input
                  type="number"
                  min="1"
                  value={prepTimeMins}
                  onChange={(e) => setPrepTimeMins(Number(e.target.value))}
                  className="w-full text-sm px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">Cook Time (mins)</label>
                <input
                  type="number"
                  min="0"
                  value={cookTimeMins}
                  onChange={(e) => setCookTimeMins(Number(e.target.value))}
                  className="w-full text-sm px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">Servings</label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full text-sm px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                Hero Image URL
              </label>
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
              />
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="border-t border-[#f0e8dc] pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif-display font-bold text-lg text-[#1f1a16]">
                Ingredients ({ingredients.length})
              </h3>
              <button
                type="button"
                onClick={addIngredientRow}
                className="text-xs font-bold text-[#c85a32] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Ingredient
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={ing.amount}
                    onChange={(e) => {
                      const next = [...ingredients];
                      next[idx].amount = Number(e.target.value);
                      setIngredients(next);
                    }}
                    placeholder="Qty"
                    className="w-16 text-xs px-2.5 py-1.5 rounded-lg border border-[#ded5c8] bg-[#faf8f5]"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => {
                      const next = [...ingredients];
                      next[idx].unit = e.target.value;
                      setIngredients(next);
                    }}
                    placeholder="Unit"
                    className="w-20 text-xs px-2.5 py-1.5 rounded-lg border border-[#ded5c8] bg-[#faf8f5]"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => {
                      const next = [...ingredients];
                      next[idx].name = e.target.value;
                      setIngredients(next);
                    }}
                    placeholder="Ingredient name (e.g. Boneless Chicken Thighs)"
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-[#ded5c8] bg-[#faf8f5]"
                  />
                  <select
                    value={ing.category}
                    onChange={(e) => {
                      const next = [...ingredients];
                      next[idx].category = e.target.value;
                      setIngredients(next);
                    }}
                    className="w-28 text-xs px-2 py-1.5 rounded-lg border border-[#ded5c8] bg-[#faf8f5]"
                  >
                    <option value="produce">Produce</option>
                    <option value="meat_seafood">Meat</option>
                    <option value="dairy_eggs">Dairy</option>
                    <option value="grains_pasta">Grains</option>
                    <option value="pantry_spices">Pantry</option>
                    <option value="garnish">Garnish</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeIngredientRow(idx)}
                    className="p-1.5 text-[#a89c90] hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Steps Section */}
          <div className="border-t border-[#f0e8dc] pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif-display font-bold text-lg text-[#1f1a16]">
                Preparation Steps ({steps.length})
              </h3>
              <button
                type="button"
                onClick={addStepRow}
                className="text-xs font-bold text-[#c85a32] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((st, idx) => (
                <div key={idx} className="p-3.5 bg-[#faf6f0] rounded-xl border border-[#eae0d2] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#c85a32] text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => {
                        const next = [...steps];
                        next[idx].title = e.target.value;
                        setSteps(next);
                      }}
                      placeholder="Step Title (e.g. Sear protein in hot skillet)"
                      className="flex-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#ded5c8] bg-white"
                    />

                    <input
                      type="text"
                      value={st.time}
                      onChange={(e) => {
                        const next = [...steps];
                        next[idx].time = e.target.value;
                        setSteps(next);
                      }}
                      placeholder="Time (e.g. 8 mins)"
                      className="w-24 text-xs px-2.5 py-1.5 rounded-lg border border-[#ded5c8] bg-white"
                    />

                    <button
                      type="button"
                      onClick={() => removeStepRow(idx)}
                      className="p-1 text-[#a89c90] hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={st.desc}
                    onChange={(e) => {
                      const next = [...steps];
                      next[idx].desc = e.target.value;
                      setSteps(next);
                    }}
                    placeholder="Step details & exact technique..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#ded5c8] bg-white focus:outline-none"
                  />

                  <input
                    type="text"
                    value={st.secret}
                    onChange={(e) => {
                      const next = [...steps];
                      next[idx].secret = e.target.value;
                      setSteps(next);
                    }}
                    placeholder="Chef's Secret / Pro Tip (optional)"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-[#fae2d0] bg-[#fffaf5] text-[#8c3b1c]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
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
              Publish Recipe to SavorCraft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
