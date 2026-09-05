import React, { useState } from 'react';
import {
  Clock,
  Flame,
  Users,
  Award,
  CheckCircle2,
  Circle,
  Play,
  Share2,
  Printer,
  Bookmark,
  Sparkles,
  Info,
  Layers,
  ThermometerSun,
  ChefHat,
  ShoppingBag,
  Maximize2,
  Check,
  Wine,
  Utensils,
  ArrowLeft,
  X,
  Volume2,
  Edit
} from 'lucide-react';
import { Recipe, Ingredient } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onStartCooking: (recipe: Recipe) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  unitSystem: 'us' | 'metric';
  setUnitSystem: (system: 'us' | 'metric') => void;
  onAddIngredientsToGrocery: (ingredients: Ingredient[], recipeTitle: string, scale: number) => void;
  onStartTimer: (label: string, seconds: number, recipeTitle: string, stepNum: number) => void;
  isAdminLoggedIn?: boolean;
  onEditRecipe?: (recipe: Recipe) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  onStartCooking,
  isBookmarked,
  onToggleBookmark,
  unitSystem,
  setUnitSystem,
  onAddIngredientsToGrocery,
  onStartTimer,
  isAdminLoggedIn = false,
  onEditRecipe,
}) => {
  const [servings, setServings] = useState<number>(recipe.servings);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [addedGroceryNotice, setAddedGroceryNotice] = useState<boolean>(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const scaleFactor = servings / recipe.servings;

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatAmount = (ing: Ingredient) => {
    if (unitSystem === 'metric') {
      const scaled = ing.metricBase * scaleFactor;
      return `${Number(scaled.toFixed(scaled >= 10 ? 0 : 1))} ${ing.metricUnit}`;
    }
    const scaled = ing.amountBase * scaleFactor;
    if (scaled === 0.25) return `1/4 ${ing.unit}`;
    if (scaled === 0.33 || Math.abs(scaled - 0.33) < 0.05) return `1/3 ${ing.unit}`;
    if (scaled === 0.5) return `1/2 ${ing.unit}`;
    if (scaled === 0.75) return `3/4 ${ing.unit}`;
    if (scaled === 1.5) return `1 1/2 ${ing.unit}`;
    if (scaled === 2.5) return `2 1/2 ${ing.unit}`;
    return `${Number(scaled.toFixed(scaled % 1 === 0 ? 0 : 2))} ${ing.unit}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddToGrocery = () => {
    onAddIngredientsToGrocery(recipe.ingredients, recipe.title, scaleFactor);
    setAddedGroceryNotice(true);
    setTimeout(() => setAddedGroceryNotice(false), 3000);
  };

  const ingredientCategories = [
    { key: 'produce', title: 'Fresh Produce & Herbs', icon: Sparkles },
    { key: 'meat_seafood', title: 'Meat & Seafood', icon: Flame },
    { key: 'dairy_eggs', title: 'Dairy & Eggs', icon: Layers },
    { key: 'grains_pasta', title: 'Grains, Flour & Pasta', icon: Utensils },
    { key: 'pantry_spices', title: 'Pantry, Oils & Spices', icon: Info },
    { key: 'garnish', title: 'Garnish & Serving Accents', icon: ChefHat },
  ];

  return (
    <div id="recipe-detail-view" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Back button & Action Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-xs font-semibold text-[#4a4036] hover:bg-[#f4eee6] transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Recipes</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Quick Edit Action (Admin only) */}
          {isAdminLoggedIn && onEditRecipe && (
            <button
              onClick={() => onEditRecipe(recipe)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#c85a32] bg-[#fbf0e8] hover:bg-[#c85a32] text-[#c85a32] hover:text-white text-xs font-bold transition-all shadow-xs"
              title="Edit recipe parameters, instructions & tips (Admin Only)"
            >
              <Edit className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Edit Recipe</span>
            </button>
          )}

          <button
            onClick={() => onToggleBookmark(recipe.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
              isBookmarked
                ? 'bg-[#c85a32] text-white border-[#c85a32]'
                : 'bg-white border-[#ded5c8] text-[#4a4036] hover:bg-[#f4eee6]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
            <span className="hidden xs:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-xs font-semibold text-[#4a4036] hover:bg-[#f4eee6] transition-all shadow-xs"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-700">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Share</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-xs font-semibold text-[#4a4036] hover:bg-[#f4eee6] transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Print</span>
          </button>

          <button
            onClick={() => onStartCooking(recipe)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#c85a32] hover:bg-[#b04a25] text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Cooking Mode</span>
          </button>
        </div>
      </div>

      {/* Main Header / Title Section */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold tracking-widest uppercase text-[#c85a32] bg-[#fbf0e8] px-2.5 py-0.5 rounded-md">
            {recipe.cuisine} • {recipe.category}
          </span>
          <span className="text-xs text-[#8a7d70] bg-white border border-[#eae1d5] px-2.5 py-0.5 rounded-md">
            Method: {recipe.method}
          </span>
          <span className="text-xs text-[#8a7d70] bg-white border border-[#eae1d5] px-2.5 py-0.5 rounded-md">
            By {recipe.author}
          </span>
        </div>

        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1c1815] leading-[1.15] mb-3">
          {recipe.title}
        </h1>

        <p className="text-base sm:text-lg text-[#554b42] leading-relaxed max-w-3xl">
          {recipe.subtitle}
        </p>

        {/* Quick Recipe Metrics Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-2xl border border-[#eae0d2] shadow-xs mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf3ed] flex items-center justify-center text-[#c85a32]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7f73]">Total Time</p>
              <p className="text-sm font-bold text-[#231e1a]">{recipe.totalTimeMins} mins ({recipe.prepTimeMins}m prep / {recipe.cookTimeMins}m cook)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf3ed] flex items-center justify-center text-[#c85a32]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7f73]">Servings</p>
              <p className="text-sm font-bold text-[#231e1a]">{servings} Portions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf3ed] flex items-center justify-center text-[#c85a32]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7f73]">Nutrition</p>
              <p className="text-sm font-bold text-[#231e1a]">{recipe.nutrition.calories} kcal / serv</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf3ed] flex items-center justify-center text-[#c85a32]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7f73]">Difficulty</p>
              <p className="text-sm font-bold text-[#231e1a]">{recipe.difficulty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image Showcase with Gallery Thumbnails */}
      <div className="mb-10">
        <div className="relative group rounded-2xl overflow-hidden shadow-md border border-[#e4dcd0] bg-[#1a1714]">
          <img
            src={recipe.heroImage}
            alt={recipe.title}
            className="w-full aspect-[16/9] object-cover cursor-pointer transition-transform duration-500 group-hover:scale-[1.01]"
            referrerPolicy="no-referrer"
            onClick={() => setLightboxSrc(recipe.heroImage)}
          />

          <div className="absolute top-4 left-4">
            <span className="bg-black/65 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#ffb088]" />
              Chef-Tested High Precision Guide
            </span>
          </div>

          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => setLightboxSrc(recipe.heroImage)}
              className="bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-medium px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all border border-white/20 shadow-md"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Photo</span>
            </button>
          </div>
        </div>

        {/* Gallery previews if available */}
        {recipe.galleryImages && recipe.galleryImages.length > 1 && (
          <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
            {recipe.galleryImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${recipe.title} gallery ${idx + 1}`}
                onClick={() => setLightboxSrc(img)}
                className="w-24 h-16 object-cover rounded-xl border border-[#ded5c8] cursor-pointer hover:opacity-80 transition-opacity shrink-0"
              />
            ))}
          </div>
        )}
      </div>

      {/* Two Column Layout: Ingredients & Scaling on Left, Steps & Preparation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Scalable Ingredients & Nutrition */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          
          {/* Ingredients Panel */}
          <div id="ingredients-panel" className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e8dfd2] shadow-xs">
            <div className="flex items-center justify-between border-b border-[#f0e9df] pb-4 mb-4">
              <div>
                <h2 className="font-serif-display text-2xl font-bold text-[#1f1a16]">
                  Ingredients
                </h2>
                <p className="text-xs text-[#7e7368] mt-0.5">
                  Click to check off while preparing
                </p>
              </div>

              {/* Unit Switcher */}
              <div className="flex items-center bg-[#f4efe8] p-0.5 rounded-lg border border-[#e5dcd0]">
                <button
                  onClick={() => setUnitSystem('us')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    unitSystem === 'us'
                      ? 'bg-white text-[#1f1a16] shadow-xs'
                      : 'text-[#7e7368] hover:text-[#2c2825]'
                  }`}
                >
                  US
                </button>
                <button
                  onClick={() => setUnitSystem('metric')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    unitSystem === 'metric'
                      ? 'bg-white text-[#1f1a16] shadow-xs'
                      : 'text-[#7e7368] hover:text-[#2c2825]'
                  }`}
                >
                  Metric
                </button>
              </div>
            </div>

            {/* Serving Scaler */}
            <div className="mb-5 p-3.5 bg-[#faf6f0] rounded-xl border border-[#ece3d6] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#4f453c]">
                Servings ({servings}):
              </span>
              <div className="flex items-center space-x-1">
                {[1, 2, 4, 6, 8, 12].map((count) => (
                  <button
                    key={count}
                    onClick={() => setServings(count)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      servings === count
                        ? 'bg-[#c85a32] text-white shadow-xs'
                        : 'bg-white text-[#63574c] border border-[#e0d6c8] hover:bg-[#f0e8de]'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredient Groups */}
            <div className="space-y-5 text-sm">
              {ingredientCategories.map((cat) => {
                const groupItems = recipe.ingredients.filter((i) => i.category === cat.key);
                if (groupItems.length === 0) return null;
                const IconComp = cat.icon;

                return (
                  <div key={cat.key} className="border-b border-[#f4eee6] pb-3 last:border-b-0 last:pb-0">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#943614] mb-2 flex items-center gap-1.5">
                      <IconComp className="w-3.5 h-3.5" />
                      {cat.title}
                    </h4>
                    <ul className="space-y-2">
                      {groupItems.map((ing) => {
                        const isChecked = checkedIngredients[ing.id];
                        return (
                          <li
                            key={ing.id}
                            onClick={() => toggleIngredient(ing.id)}
                            className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer select-none transition-colors ${
                              isChecked ? 'bg-[#f4efe8]/60 opacity-50' : 'hover:bg-[#faf7f2]'
                            }`}
                          >
                            <div className="mt-0.5 text-[#c85a32]">
                              {isChecked ? (
                                <CheckCircle2 className="w-4 h-4 text-green-700" />
                              ) : (
                                <Circle className="w-4 h-4 text-[#c3b6a6]" />
                              )}
                            </div>
                            <div className="flex-1">
                              <span className={`font-medium ${isChecked ? 'line-through text-[#82776c]' : 'text-[#2a241f]'}`}>
                                {formatAmount(ing)} — {ing.name}
                              </span>
                              {ing.note && (
                                <p className="text-[11px] text-[#8e8174] italic mt-0.5">{ing.note}</p>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* 1-Click Add to Grocery List Action */}
            <div className="mt-5 pt-4 border-t border-[#f0e8dc]">
              <button
                id="add-to-grocery-btn"
                onClick={handleAddToGrocery}
                className="w-full py-2.5 px-4 rounded-xl border border-[#c85a32] bg-[#fffaf5] hover:bg-[#faeee5] text-[#9c3a17] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                {addedGroceryNotice ? 'Added to Grocery List!' : 'Add All to Smart Grocery List'}
              </button>
            </div>
          </div>

          {/* Nutrition & Equipment Summary Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#e8dfd2] shadow-xs space-y-4">
            <h3 className="font-serif-display font-bold text-lg text-[#1f1a16]">
              Nutrition & Equipment
            </h3>

            {/* Macros Bar */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#faf5ef] p-2.5 rounded-xl border border-[#ede3d5]">
                <p className="text-[10px] uppercase font-bold text-[#8c7e70]">Calories</p>
                <p className="text-sm font-bold text-[#1f1a16]">{recipe.nutrition.calories}</p>
              </div>
              <div className="bg-[#faf5ef] p-2.5 rounded-xl border border-[#ede3d5]">
                <p className="text-[10px] uppercase font-bold text-[#8c7e70]">Protein</p>
                <p className="text-sm font-bold text-[#1f1a16]">{recipe.nutrition.proteinGrams}g</p>
              </div>
              <div className="bg-[#faf5ef] p-2.5 rounded-xl border border-[#ede3d5]">
                <p className="text-[10px] uppercase font-bold text-[#8c7e70]">Carbs</p>
                <p className="text-sm font-bold text-[#1f1a16]">{recipe.nutrition.carbsGrams}g</p>
              </div>
              <div className="bg-[#faf5ef] p-2.5 rounded-xl border border-[#ede3d5]">
                <p className="text-[10px] uppercase font-bold text-[#8c7e70]">Fat</p>
                <p className="text-sm font-bold text-[#1f1a16]">{recipe.nutrition.fatGrams}g</p>
              </div>
            </div>

            {/* Required Kitchen Equipment */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#796d60] mb-2 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#c85a32]" />
                Recommended Gear
              </h4>
              <ul className="text-xs text-[#5a4e44] space-y-1">
                {recipe.equipmentNeeded.map((eq, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-[#c85a32]">•</span> {eq}
                  </li>
                ))}
              </ul>
            </div>

            {/* Wine Pairing */}
            {recipe.winePairing && (
              <div className="p-3 bg-[#fdf5f0] rounded-xl border border-[#fae2d0] flex items-start gap-2.5">
                <Wine className="w-4 h-4 text-[#9c3a17] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#8a3415]">Sommelier Pairing:</p>
                  <p className="text-xs text-[#6e4e41]">{recipe.winePairing}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Method & Step-by-Step Preparation */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section Heading & Quick Cook Launch */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-display text-2xl font-bold text-[#1f1a16]">
                Method & Preparation Steps
              </h2>
              <p className="text-xs text-[#7e7368]">
                {recipe.steps.length} precision steps
              </p>
            </div>

            <button
              onClick={() => onStartCooking(recipe)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#c85a32] hover:bg-[#b04a25] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Interactive Assistant</span>
            </button>
          </div>

          {/* Step Cards List */}
          <div className="space-y-4">
            {recipe.steps.map((s) => (
              <div
                key={s.step}
                id={`step-${s.step}`}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  activeStepTab === s.step
                    ? 'bg-white border-[#c85a32]/60 shadow-sm ring-1 ring-[#c85a32]/20'
                    : 'bg-white border-[#e9e1d5] hover:border-[#dbcbb9]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Step Number Circle */}
                  <button
                    onClick={() => setActiveStepTab(s.step)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                      activeStepTab === s.step
                        ? 'bg-[#c85a32] text-white shadow-xs'
                        : 'bg-[#f4eee5] text-[#6d6155]'
                    }`}
                  >
                    {s.step}
                  </button>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3
                        onClick={() => setActiveStepTab(s.step)}
                        className="font-bold text-base text-[#241e1a] cursor-pointer hover:text-[#c85a32] transition-colors"
                      >
                        {s.title}
                      </h3>

                      <div className="flex items-center gap-2">
                        {s.temp && (
                          <span className="text-[11px] font-bold text-[#b44820] bg-[#fbf0e8] px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ThermometerSun className="w-3 h-3" />
                            {s.temp}
                          </span>
                        )}

                        <span className="text-xs font-medium text-[#847769] bg-[#f6efe6] px-2 py-0.5 rounded-md">
                          {s.time}
                        </span>

                        {/* Optional timer trigger button */}
                        {s.timerSeconds && (
                          <button
                            onClick={() => onStartTimer(s.title, s.timerSeconds!, recipe.title, s.step)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#29231f] hover:bg-[#c85a32] text-white text-[11px] font-semibold transition-colors"
                            title="Start Step Countdown Timer"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Timer ({Math.round(s.timerSeconds / 60)}m)</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Step Description */}
                    <p className="text-sm leading-relaxed text-[#4e443b] mb-3">
                      {s.desc}
                    </p>

                    {/* Visual cue indicator */}
                    {s.targetVisual && (
                      <div className="text-xs text-[#52473d] bg-[#faf6f0] p-2.5 rounded-xl border border-[#ede3d5] mb-2.5 flex items-center gap-2">
                        <span className="font-bold text-[#8a3415] text-[11px] uppercase">Look For:</span>
                        <span>{s.targetVisual}</span>
                      </div>
                    )}

                    {/* Chef Secret / Pro Tip Callouts */}
                    {s.secret && (
                      <div className="p-3 bg-[#fdf7f1] rounded-xl border border-[#fae2d0] flex items-start gap-2 text-xs text-[#8c3b1c]">
                        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#c85a32]" />
                        <div>
                          <strong className="font-semibold">Chef's Secret:</strong> {s.secret}
                        </div>
                      </div>
                    )}

                    {s.warning && (
                      <div className="p-3 bg-[#fff5f5] rounded-xl border border-[#fed7d7] flex items-start gap-2 text-xs text-[#c53030] mt-2">
                        <span className="font-bold text-sm">⚠️</span>
                        <div>
                          <strong className="font-semibold">Caution:</strong> {s.warning}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chef Notes & Storage Card */}
          {recipe.chefNotes && (
            <div className="p-5 bg-white rounded-2xl border border-[#e8ded1] shadow-xs">
              <h4 className="font-serif-display font-bold text-lg text-[#1f1a16] mb-2 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#c85a32]" />
                Chef's Master Notes & Preservation
              </h4>
              <p className="text-xs sm:text-sm text-[#5d5146] leading-relaxed">
                {recipe.chefNotes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxSrc && (
        <div
          id="photo-lightbox"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxSrc}
              alt="High Resolution Dish Photography"
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
