import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  ChefHat,
  Clock,
  Flame,
  Star,
  Check,
  Tag,
  Scale,
  Utensils
} from 'lucide-react';
import {
  Recipe,
  Cuisine,
  Category,
  Difficulty,
  CookingMethod,
  Ingredient,
  Step
} from '../types';
import { sanitizeUrl, sanitizeSafeJsonString } from '../utils/security';

interface AdminRecipeEditorModalProps {
  initialRecipe?: Recipe | null;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  categories?: string[];
}

export const AdminRecipeEditorModal: React.FC<AdminRecipeEditorModalProps> = ({
  initialRecipe,
  onClose,
  onSave,
  categories = ['Appetizers', 'Mains', 'Pasta & Noodles', 'Soups & Stews', 'Bowls & Salads', 'Baking & Bread', 'Desserts'],
}) => {
  const isEditing = !!initialRecipe;

  const [title, setTitle] = useState<string>(initialRecipe?.title || '');
  const [subtitle, setSubtitle] = useState<string>(initialRecipe?.subtitle || '');
  const [slug, setSlug] = useState<string>(initialRecipe?.slug || '');
  const [cuisine, setCuisine] = useState<Cuisine>(initialRecipe?.cuisine || 'Italian');
  const [category, setCategory] = useState<Category>(initialRecipe?.category || 'Mains');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialRecipe?.difficulty || 'Intermediate');
  const [method, setMethod] = useState<CookingMethod>(initialRecipe?.method || 'Stovetop / Pan-Sear');
  const [prepTimeMins, setPrepTimeMins] = useState<number>(initialRecipe?.prepTimeMins || 15);
  const [cookTimeMins, setCookTimeMins] = useState<number>(initialRecipe?.cookTimeMins || 20);
  const [servings, setServings] = useState<number>(initialRecipe?.servings || 4);
  const [rating, setRating] = useState<number>(initialRecipe?.rating || 4.9);
  const [reviewsCount, setReviewsCount] = useState<number>(initialRecipe?.reviewsCount || 12);
  const [author, setAuthor] = useState<string>(initialRecipe?.author || 'Executive Chef SavorCraft');
  const [heroImage, setHeroImage] = useState<string>(
    initialRecipe?.heroImage ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'
  );
  const [imageUploadError, setImageUploadError] = useState<string>('');
  const [description, setDescription] = useState<string>(
    initialRecipe?.description || 'A gourmet culinary preparation curated for the SavorCraft Academy.'
  );
  const [chefNotes, setChefNotes] = useState<string>(initialRecipe?.chefNotes || '');
  const [winePairing, setWinePairing] = useState<string>(initialRecipe?.winePairing || '');
  const [isFeatured, setIsFeatured] = useState<boolean>(initialRecipe?.isFeatured || false);

  const [dietary, setDietary] = useState<string[]>(initialRecipe?.dietary || []);
  const [tagsInput, setTagsInput] = useState<string>(initialRecipe?.tags?.join(', ') || 'Chef Curated, Gourmet');
  const [equipmentInput, setEquipmentInput] = useState<string>(
    initialRecipe?.equipmentNeeded?.join(', ') || 'Chef Knife, Heavy Skillet'
  );

  // Nutrition
  const [calories, setCalories] = useState<number>(initialRecipe?.nutrition?.calories || 480);
  const [proteinGrams, setProteinGrams] = useState<number>(initialRecipe?.nutrition?.proteinGrams || 28);
  const [carbsGrams, setCarbsGrams] = useState<number>(initialRecipe?.nutrition?.carbsGrams || 42);
  const [fatGrams, setFatGrams] = useState<number>(initialRecipe?.nutrition?.fatGrams || 18);
  const [fiberGrams, setFiberGrams] = useState<number>(initialRecipe?.nutrition?.fiberGrams || 4);
  const [sodiumMg, setSodiumMg] = useState<number>(initialRecipe?.nutrition?.sodiumMg || 540);

  // Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialRecipe?.ingredients?.length
      ? initialRecipe.ingredients
      : [
        {
          id: 'ing-1',
          name: 'Extra Virgin Olive Oil',
          amountBase: 2,
          unit: 'tbsp',
          metricBase: 30,
          metricUnit: 'ml',
          category: 'pantry_spices',
          note: 'Cold-pressed',
        },
        {
          id: 'ing-2',
          name: 'Garlic cloves',
          amountBase: 4,
          unit: 'cloves',
          metricBase: 4,
          metricUnit: 'cloves',
          category: 'produce',
          note: 'Finely minced',
        },
      ]
  );

  // Steps
  const [steps, setSteps] = useState<Step[]>(
    initialRecipe?.steps?.length
      ? initialRecipe.steps
      : [
        {
          step: 1,
          title: 'Mise en Place & Prep',
          time: '10 mins',
          timerSeconds: 0,
          desc: 'Gather and measure all ingredients. Finely mince the aromatics and organize equipment.',
          secret: 'Uniform cutting creates consistent heat transfer.',
        },
        {
          step: 2,
          title: 'Sear & Sauté',
          time: '12 mins',
          timerSeconds: 720,
          desc: 'Heat the skillet until oil shimmers. Gently introduce the ingredients and cook until golden.',
          secret: 'Avoid overcrowding the pan to prevent unwanted steaming.',
        },
      ]
  );

  const handleHeroImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setImageUploadError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please choose an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('Please choose an image smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setHeroImage(reader.result);
    };
    reader.onerror = () => setImageUploadError('The image could not be read. Please try again.');
    reader.readAsDataURL(file);
  };

  const toggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleAddIngredient = () => {
    const newIng: Ingredient = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: '',
      amountBase: 1,
      unit: 'cup',
      metricBase: 100,
      metricUnit: 'g',
      category: 'produce',
      note: '',
    };
    setIngredients([...ingredients, newIng]);
  };

  const handleUpdateIngredient = (index: number, fields: Partial<Ingredient>) => {
    const next = [...ingredients];
    next[index] = { ...next[index], ...fields };
    setIngredients(next);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    const newStep: Step = {
      step: steps.length + 1,
      title: '',
      time: '5 mins',
      timerSeconds: 0,
      desc: '',
      secret: '',
    };
    setSteps([...steps, newStep]);
  };

  const handleUpdateStep = (index: number, fields: Partial<Step>) => {
    const next = [...steps];
    next[index] = { ...next[index], ...fields };
    setSteps(next);
  };

  const handleRemoveStep = (index: number) => {
    const next = steps
      .filter((_, i) => i !== index)
      .map((st, i) => ({ ...st, step: i + 1 }));
    setSteps(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const generatedSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const formattedRecipe: Recipe = {
      id: initialRecipe?.id || `recipe-admin-${Date.now()}`,
      slug: generatedSlug,
      title: sanitizeSafeJsonString(title),
      subtitle: sanitizeSafeJsonString(subtitle),
      cuisine,
      category,
      difficulty,
      method,
      prepTimeMins: Number(prepTimeMins) || 15,
      cookTimeMins: Number(cookTimeMins) || 20,
      totalTimeMins: (Number(prepTimeMins) || 15) + (Number(cookTimeMins) || 20),
      servings: Number(servings) || 4,
      rating: Number(rating) || 5.0,
      reviewsCount: Number(reviewsCount) || 1,
      author: sanitizeSafeJsonString(author || 'SavorCraft Culinary Team'),
      heroImage: sanitizeUrl(
        heroImage,
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'
      ),
      description: sanitizeSafeJsonString(description),
      dietary: dietary as any,
      tags: tagsInput
        .split(',')
        .map((t) => sanitizeSafeJsonString(t))
        .filter(Boolean),
      equipmentNeeded: equipmentInput
        .split(',')
        .map((e) => sanitizeSafeJsonString(e))
        .filter(Boolean),
      ingredients: ingredients.map((ing) => ({
        ...ing,
        name: sanitizeSafeJsonString(ing.name || 'Ingredient'),
        amountBase: Number(ing.amountBase) || 1,
        metricBase: Number(ing.metricBase) || 100,
      })),
      steps: steps.map((st, i) => ({
        ...st,
        step: i + 1,
        title: sanitizeSafeJsonString(st.title || `Step ${i + 1}`),
        desc: sanitizeSafeJsonString(st.desc || 'Execute step.'),
        timerSeconds: Number(st.timerSeconds) > 0 ? Number(st.timerSeconds) : undefined,
      })),
      nutrition: {
        calories: Number(calories) || 400,
        proteinGrams: Number(proteinGrams) || 20,
        carbsGrams: Number(carbsGrams) || 30,
        fatGrams: Number(fatGrams) || 15,
        fiberGrams: Number(fiberGrams) || 4,
        sodiumMg: Number(sodiumMg) || 500,
      },
      chefNotes: chefNotes.trim() || undefined,
      winePairing: winePairing.trim() || undefined,
      isFeatured,
    };

    onSave(formattedRecipe);
    onClose();
  };

  return (
    <div
      id="admin-recipe-editor-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-4xl w-full max-h-[92vh] rounded-3xl p-6 sm:p-8 overflow-y-auto shadow-2xl border border-[#ebd8c8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0e8dc] pb-4 mb-6 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c85a32] text-white flex items-center justify-center shadow-sm">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display font-bold text-2xl text-[#1e1a17]">
                  {isEditing ? 'Admin: Edit Recipe' : 'Admin: Create New Recipe'}
                </h2>
                {isFeatured && (
                  <span className="bg-[#fef3c7] text-[#92400e] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#fde68a]">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7e7164]">
                Complete recipe metadata, timing, nutrition, ingredients & cooking steps
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
          {/* Section 1: General Info */}
          <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#ede4d8] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#827161] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c85a32]" /> General Metadata
            </h3>

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
                  placeholder="e.g. Crispy Air Fryer Arancini"
                  className="w-full text-sm font-semibold px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-white focus:ring-2 focus:ring-[#c85a32]/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Golden Sicilian saffron rice balls with mozzarella core"
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Author / Chef Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Chef Marco Silvestri"
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Cuisine
                </label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value as Cuisine)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#ded5c8] bg-white"
                >
                  {[
                    'Italian',
                    'French',
                    'Japanese',
                    'Thai',
                    'Spanish',
                    'Mediterranean',
                    'Vietnamese',
                    'American',
                    'Mexican',
                    'Indian',
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Category / Course
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#ded5c8] bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
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
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#ded5c8] bg-white"
                >
                  {[
                    'Stovetop / Pan-Sear',
                    'Oven / Roasting',
                    'Air Fryer',
                    'Slow Simmer',
                    'Boiling / Pasta',
                    'Baking',
                    'No-Cook / Fresh',
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#ded5c8] bg-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={prepTimeMins}
                    onChange={(e) => setPrepTimeMins(Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">
                    Cook Time (min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={cookTimeMins}
                    onChange={(e) => setCookTimeMins(Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">
                    Servings
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Hero Image
                </label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-white"
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center rounded-lg bg-[#f0e9df] px-3 py-2 text-xs font-bold text-[#5e5146] transition-colors hover:bg-[#e4dcd0]">
                    <span>Import photo from PC</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                      onChange={handleHeroImageUpload}
                      className="sr-only"
                    />
                  </label>
                  <span className="text-[11px] text-[#7d7064]">PNG, JPG, WebP, GIF or SVG, up to 5 MB</span>
                </div>
                {imageUploadError && (
                  <p className="mt-1 text-[11px] font-semibold text-red-600">{imageUploadError}</p>
                )}
                {heroImage && (
                  <img
                    src={heroImage}
                    alt="Hero image preview"
                    className="mt-3 h-28 w-full rounded-xl object-cover border border-[#ded5c8]"
                  />
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#ded5c8] bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between p-3 bg-white rounded-xl border border-[#ded5c8]">
                <div>
                  <span className="text-xs font-bold text-[#1f1a16] block">Featured Recipe Status</span>
                  <span className="text-[11px] text-[#7d7064]">Showcase on home screen banner</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${isFeatured
                    ? 'bg-[#c85a32] text-white'
                    : 'bg-[#f0e9df] text-[#5e5146] hover:bg-[#e4dcd0]'
                    }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>{isFeatured ? 'Featured Dish' : 'Standard'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Dietary Tags & Equipment */}
          <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#ede4d8] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#827161] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#c85a32]" /> Dietary Badges & Kitchen Equipment
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-2">
                Dietary Compatibility
              </label>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'High-Protein', 'Pescatarian'].map(
                  (d) => {
                    const active = dietary.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDietary(d)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${active
                          ? 'bg-[#c85a32] text-white border-[#c85a32]'
                          : 'bg-white text-[#5b4e43] border-[#ded5c8] hover:bg-[#f6eee4]'
                          }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        <span>{d}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Search Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Crispy, Italian, Air Fryer, Saffron"
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Equipment Needed (comma separated)
                </label>
                <input
                  type="text"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  placeholder="e.g. Air Fryer, Chef Knife, Mixing Bowls"
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Ingredients Editor */}
          <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#ede4d8] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#827161] flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#c85a32]" /> Ingredients List ({ingredients.length})
              </h3>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-xs font-bold text-[#c85a32] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Ingredient Row
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {ingredients.map((ing, idx) => (
                <div key={ing.id || idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#e8ded1]">
                <input
                    type="number"
                    step="0.1"
                    value={ing.amountBase}
                    onChange={(e) => handleUpdateIngredient(idx, { amountBase: Number(e.target.value) })}
                    placeholder="US Qty"
                    className="w-16 text-xs px-2 py-1 rounded-lg border border-[#ded5c8] text-center"
                    title="US Amount"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => handleUpdateIngredient(idx, { unit: e.target.value })}
                    placeholder="US Unit"
                    className="w-16 text-xs px-2 py-1 rounded-lg border border-[#ded5c8]"
                    title="US Unit"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleUpdateIngredient(idx, { name: e.target.value })}
                    placeholder="Ingredient Name"
                    className="flex-1 text-xs px-2.5 py-1 rounded-lg border border-[#ded5c8] font-medium"
                  />
                  <input
                    type="number"
                    step="1"
                    value={ing.metricBase}
                    onChange={(e) => handleUpdateIngredient(idx, { metricBase: Number(e.target.value) })}
                    placeholder="Metric Qty"
                    className="w-16 text-xs px-2 py-1 rounded-lg border border-[#ded5c8] text-center"
                    title="Metric Amount"
                  />
                  <input
                    type="text"
                    value={ing.metricUnit}
                    onChange={(e) => handleUpdateIngredient(idx, { metricUnit: e.target.value })}
                    placeholder="Metric Unit"
                    className="w-14 text-xs px-2 py-1 rounded-lg border border-[#ded5c8]"
                    title="Metric Unit"
                  />
                  <select
                    value={ing.category}
                    onChange={(e) => handleUpdateIngredient(idx, { category: e.target.value as any })}
                    className="w-24 text-[11px] px-1.5 py-1 rounded-lg border border-[#ded5c8]"
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
                    onClick={() => handleRemoveIngredient(idx)}
                    className="p-1.5 text-[#a89c90] hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Steps & Timers */}
          <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#ede4d8] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#827161] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c85a32]" /> Preparation Steps & Multi-Timers ({steps.length})
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
                <div key={idx} className="p-3.5 bg-white rounded-xl border border-[#e6dcce] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#c85a32] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => handleUpdateStep(idx, { title: e.target.value })}
                      placeholder="Step Title"
                      className="flex-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#ded5c8]"
                    />

                    <input
                      type="text"
                      value={st.time}
                      onChange={(e) => handleUpdateStep(idx, { time: e.target.value })}
                      placeholder="Display Time (e.g. 10m)"
                      className="w-24 text-xs px-2 py-1.5 rounded-lg border border-[#ded5c8]"
                    />

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[#7d7064]">Timer(sec):</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={st.timerSeconds || 0}
                        onChange={(e) => handleUpdateStep(idx, { timerSeconds: Number(e.target.value) })}
                        placeholder="Seconds"
                        className="w-16 text-xs px-1.5 py-1.5 rounded-lg border border-[#ded5c8] text-center"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1 text-[#a89c90] hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={st.desc}
                    onChange={(e) => handleUpdateStep(idx, { desc: e.target.value })}
                    placeholder="Step detailed instructions..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#ded5c8] focus:outline-none"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={st.secret || ''}
                      onChange={(e) => handleUpdateStep(idx, { secret: e.target.value })}
                      placeholder="Chef Secret / Pro Tip (optional)"
                      className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-[#fae2d0] bg-[#fffaf5] text-[#8c3b1c]"
                    />
                    <input
                      type="text"
                      value={st.warning || ''}
                      onChange={(e) => handleUpdateStep(idx, { warning: e.target.value })}
                      placeholder="Critical Warning / Pitfall (optional)"
                      className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-[#fed7d7] bg-[#fff8f8] text-[#9b2c2c]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Nutrition & Sommelier Pairings */}
          <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#ede4d8] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#827161] flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#c85a32]" /> Nutrition Facts & Sommelier Notes
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">Calories</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={fatGrams}
                  onChange={(e) => setFatGrams(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">Fiber (g)</label>
                <input
                  type="number"
                  value={fiberGrams}
                  onChange={(e) => setFiberGrams(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#796c5f] mb-1">Sodium (mg)</label>
                <input
                  type="number"
                  value={sodiumMg}
                  onChange={(e) => setSodiumMg(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Sommelier Wine & Beverage Pairing
                </label>
                <input
                  type="text"
                  value={winePairing}
                  onChange={(e) => setWinePairing(e.target.value)}
                  placeholder="e.g. Etna Bianco DOC (Carricante) or crisp Pinot Grigio"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#ded5c8] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Chef's Personal Notes & Origin
                </label>
                <input
                  type="text"
                  value={chefNotes}
                  onChange={(e) => setChefNotes(e.target.value)}
                  placeholder="e.g. Inspired by Palermo street food traditions."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#ded5c8] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-[#f0e8dc] pt-5 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
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
              {isEditing ? 'Save Changes to Recipe' : 'Publish Recipe to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
