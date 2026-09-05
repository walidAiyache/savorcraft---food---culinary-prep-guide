import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Check,
  Plus,
  ArrowRight,
  ShoppingBag,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Recipe, Ingredient } from '../types';
import { RECIPES } from '../data/recipes';

interface PantryMatcherProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCooking: (recipe: Recipe) => void;
  onAddIngredientsToGrocery: (ingredients: Ingredient[], recipeTitle: string, scale: number) => void;
}

const COMMON_PANTRY_ITEMS = [
  // Proteins
  { id: 'p-chicken', name: 'Chicken (thighs/breast)', category: 'Proteins' },
  { id: 'p-beef', name: 'Beef / Steak', category: 'Proteins' },
  { id: 'p-salmon', name: 'Salmon / Fish fillets', category: 'Proteins' },
  { id: 'p-shrimp', name: 'Shrimp / Prawns', category: 'Proteins' },
  { id: 'p-bacon', name: 'Bacon / Guanciale / Pancetta', category: 'Proteins' },

  // Dairy & Eggs
  { id: 'p-eggs', name: 'Eggs', category: 'Dairy & Eggs' },
  { id: 'p-butter', name: 'Butter', category: 'Dairy & Eggs' },
  { id: 'p-parmesan', name: 'Parmigiano Reggiano / Pecorino', category: 'Dairy & Eggs' },
  { id: 'p-mozzarella', name: 'Mozzarella cheese', category: 'Dairy & Eggs' },
  { id: 'p-heavycream', name: 'Heavy Cream', category: 'Dairy & Eggs' },
  { id: 'p-feta', name: 'Greek Feta cheese', category: 'Dairy & Eggs' },

  // Aromatics & Veggies
  { id: 'p-garlic', name: 'Garlic', category: 'Produce' },
  { id: 'p-onion', name: 'Onion', category: 'Produce' },
  { id: 'p-spinach', name: 'Baby Spinach', category: 'Produce' },
  { id: 'p-tomatoes', name: 'Fresh / Cherry Tomatoes', category: 'Produce' },
  { id: 'p-lemon', name: 'Lemon', category: 'Produce' },
  { id: 'p-basil', name: 'Fresh Basil / Herbs', category: 'Produce' },
  { id: 'p-mushrooms', name: 'Mushrooms', category: 'Produce' },

  // Grains & Pastas
  { id: 'p-spaghetti', name: 'Spaghetti / Pasta', category: 'Grains' },
  { id: 'p-rice', name: 'Arborio Rice / Jasmine Rice', category: 'Grains' },
  { id: 'p-flour', name: 'Flour (Tipo 00 / AP)', category: 'Grains' },
  { id: 'p-panko', name: 'Panko / Breadcrumbs', category: 'Grains' },
  { id: 'p-quinoa', name: 'Quinoa', category: 'Grains' },

  // Pantry Liquids & Spices
  { id: 'p-oliveoil', name: 'Extra Virgin Olive Oil', category: 'Pantry' },
  { id: 'p-sundried', name: 'Sun-Dried Tomatoes', category: 'Pantry' },
  { id: 'p-coconutmilk', name: 'Coconut Milk', category: 'Pantry' },
  { id: 'p-redwine', name: 'Red / White Wine', category: 'Pantry' },
  { id: 'p-sanmarzano', name: 'Canned Tomatoes / Marinara', category: 'Pantry' },
  { id: 'p-chickpeas', name: 'Canned Chickpeas', category: 'Pantry' },
  { id: 'p-espresso', name: 'Espresso / Coffee', category: 'Pantry' },
];

export const PantryMatcher: React.FC<PantryMatcherProps> = ({
  onSelectRecipe,
  onStartCooking,
  onAddIngredientsToGrocery,
}) => {
  const [selectedPantry, setSelectedPantry] = useState<Set<string>>(
    new Set(['p-garlic', 'p-oliveoil', 'p-butter', 'p-eggs', 'p-parmesan'])
  );

  const togglePantryItem = (id: string) => {
    setSelectedPantry((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedPantry(new Set(COMMON_PANTRY_ITEMS.map((item) => item.id)));
  };

  const clearAll = () => {
    setSelectedPantry(new Set());
  };

  // Helper to match pantry selections with recipe ingredients loosely
  const matchRecipe = (recipe: Recipe) => {
    const totalIngredients = recipe.ingredients.length;
    let matchCount = 0;
    const haveList: Ingredient[] = [];
    const missingList: Ingredient[] = [];

    recipe.ingredients.forEach((ing) => {
      const ingName = ing.name.toLowerCase();
      let matched = false;

      if (selectedPantry.has('p-garlic') && ingName.includes('garlic')) matched = true;
      else if (selectedPantry.has('p-oliveoil') && (ingName.includes('olive oil') || ingName.includes('evoo'))) matched = true;
      else if (selectedPantry.has('p-butter') && ingName.includes('butter')) matched = true;
      else if (selectedPantry.has('p-eggs') && (ingName.includes('egg') || ingName.includes('yolk'))) matched = true;
      else if (selectedPantry.has('p-parmesan') && (ingName.includes('parmigiano') || ingName.includes('pecorino') || ingName.includes('parmesan'))) matched = true;
      else if (selectedPantry.has('p-chicken') && ingName.includes('chicken')) matched = true;
      else if (selectedPantry.has('p-beef') && (ingName.includes('beef') || ingName.includes('ribeye') || ingName.includes('steak'))) matched = true;
      else if (selectedPantry.has('p-salmon') && ingName.includes('salmon')) matched = true;
      else if (selectedPantry.has('p-shrimp') && (ingName.includes('shrimp') || ingName.includes('prawn'))) matched = true;
      else if (selectedPantry.has('p-bacon') && (ingName.includes('bacon') || ingName.includes('guanciale') || ingName.includes('pancetta'))) matched = true;
      else if (selectedPantry.has('p-spaghetti') && (ingName.includes('spaghetti') || ingName.includes('pasta'))) matched = true;
      else if (selectedPantry.has('p-rice') && ingName.includes('rice')) matched = true;
      else if (selectedPantry.has('p-spinach') && ingName.includes('spinach')) matched = true;
      else if (selectedPantry.has('p-tomatoes') && ingName.includes('tomato')) matched = true;
      else if (selectedPantry.has('p-lemon') && ingName.includes('lemon')) matched = true;
      else if (selectedPantry.has('p-heavycream') && ingName.includes('cream')) matched = true;
      else if (selectedPantry.has('p-mozzarella') && ingName.includes('mozzarella')) matched = true;
      else if (selectedPantry.has('p-flour') && ingName.includes('flour')) matched = true;
      else if (selectedPantry.has('p-panko') && (ingName.includes('panko') || ingName.includes('breadcrumb'))) matched = true;
      else if (selectedPantry.has('p-coconutmilk') && ingName.includes('coconut milk')) matched = true;
      else if (selectedPantry.has('p-redwine') && (ingName.includes('wine') || ingName.includes('sherry'))) matched = true;
      else if (selectedPantry.has('p-sundried') && ingName.includes('sun-dried')) matched = true;
      else if (selectedPantry.has('p-onion') && ingName.includes('onion')) matched = true;
      else if (selectedPantry.has('p-mushrooms') && ingName.includes('mushroom')) matched = true;
      else if (selectedPantry.has('p-chickpeas') && ingName.includes('chickpea')) matched = true;
      else if (selectedPantry.has('p-quinoa') && ingName.includes('quinoa')) matched = true;
      else if (selectedPantry.has('p-feta') && ingName.includes('feta')) matched = true;
      else if (selectedPantry.has('p-espresso') && (ingName.includes('espresso') || ingName.includes('coffee'))) matched = true;
      else if (selectedPantry.has('p-basil') && (ingName.includes('basil') || ingName.includes('thyme') || ingName.includes('rosemary') || ingName.includes('parsley'))) matched = true;

      if (matched) {
        matchCount++;
        haveList.push(ing);
      } else {
        missingList.push(ing);
      }
    });

    const percent = Math.round((matchCount / totalIngredients) * 100);
    return { percent, matchCount, totalIngredients, haveList, missingList };
  };

  const rankedRecipes = RECIPES.map((recipe) => ({
    recipe,
    match: matchRecipe(recipe),
  })).sort((a, b) => b.match.percent - a.match.percent);

  const categories = ['Proteins', 'Dairy & Eggs', 'Produce', 'Grains', 'Pantry'];

  return (
    <div id="pantry-matcher-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] bg-[#fcf0e8] px-2.5 py-0.5 rounded-md">
            Pantry-To-Table Finder
          </span>
          <span className="text-[#c1b6a7]">•</span>
          <span className="text-xs text-[#73685e]">Smart Ingredient Matcher</span>
        </div>

        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1815] leading-tight mb-2">
          What Ingredients Do You Have Right Now?
        </h1>

        <p className="text-sm sm:text-base text-[#5c5045] leading-relaxed">
          Select the items in your fridge and pantry. We’ll match you with restaurant-quality recipes, showing exactly what you have and what single ingredient you might need.
        </p>
      </div>

      {/* Pantry Selector Panel */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e8dfd2] shadow-xs mb-10">
        <div className="flex items-center justify-between border-b border-[#f0e9df] pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#c85a32]" />
            <h2 className="font-serif-display text-xl font-bold text-[#1f1a16]">
              Your Kitchen Inventory ({selectedPantry.size} selected)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="text-xs text-[#9c3a17] font-semibold hover:underline"
            >
              Select All
            </button>
            <span className="text-[#d8cdbf]">•</span>
            <button
              onClick={clearAll}
              className="text-xs text-[#75675a] hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Category Item Badges */}
        <div className="space-y-4">
          {categories.map((cat) => {
            const items = COMMON_PANTRY_ITEMS.filter((item) => item.category === cat);
            return (
              <div key={cat} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b7d70] w-28 shrink-0">
                  {cat}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => {
                    const isSelected = selectedPantry.has(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => togglePantryItem(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#c85a32] text-white shadow-xs scale-[1.02]'
                            : 'bg-[#faf6f0] text-[#554a40] border border-[#e8dfd3] hover:bg-[#f2eae0]'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-[#a89c90]" />}
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matched Recipes Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif-display text-2xl font-bold text-[#1f1a16]">
            Matching Recipes ({rankedRecipes.length})
          </h2>
          <span className="text-xs text-[#83766a]">
            Sorted by highest ingredient availability
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedRecipes.map(({ recipe, match }) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-[#e8ded1] shadow-xs flex flex-col justify-between overflow-hidden hover:border-[#c85a32]/50 transition-all group"
            >
              <div>
                {/* Image & Match Percentage Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#241e1a] cursor-pointer" onClick={() => onSelectRecipe(recipe)}>
                  <img
                    src={recipe.heroImage}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Match Percentage Chip */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 ${
                        match.percent >= 70
                          ? 'bg-green-700 text-white'
                          : match.percent >= 40
                          ? 'bg-amber-600 text-white'
                          : 'bg-black/60 backdrop-blur text-white'
                      }`}
                    >
                      {match.percent}% Match
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                    {recipe.totalTimeMins} mins • {recipe.cuisine}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3
                    onClick={() => onSelectRecipe(recipe)}
                    className="font-serif-display font-bold text-lg text-[#1f1a16] leading-snug cursor-pointer group-hover:text-[#c85a32] transition-colors mb-2 line-clamp-1"
                  >
                    {recipe.title}
                  </h3>

                  {/* Match Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-[#796c5f] mb-1">
                      <span>You have <strong>{match.matchCount}</strong> of {match.totalIngredients} items</span>
                      <span className="font-bold text-[#c85a32]">{match.percent}%</span>
                    </div>
                    <div className="w-full bg-[#f0e8dc] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          match.percent >= 70 ? 'bg-green-600' : match.percent >= 40 ? 'bg-amber-500' : 'bg-[#c85a32]'
                        }`}
                        style={{ width: `${match.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Missing ingredients preview */}
                  {match.missingList.length > 0 && (
                    <div className="p-3 bg-[#fdf8f4] rounded-xl border border-[#fae8dc] text-xs">
                      <span className="font-bold text-[#943614] text-[11px] uppercase block mb-1">
                        Missing ({match.missingList.length}):
                      </span>
                      <p className="text-[#6d5b4f] line-clamp-2">
                        {match.missingList.map((m) => m.name.split('(')[0].trim()).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-[#f2ece3] mt-2">
                {match.missingList.length > 0 && (
                  <button
                    onClick={() => onAddIngredientsToGrocery(match.missingList, recipe.title, 1)}
                    className="text-xs text-[#9c3a17] font-semibold hover:underline flex items-center gap-1"
                    title="Add only missing ingredients to grocery list"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>+ Missing</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => onSelectRecipe(recipe)}
                    className="px-3 py-1.5 rounded-lg border border-[#ded5c8] bg-white text-xs font-semibold text-[#483d34] hover:bg-[#f4efe8] transition-colors"
                  >
                    View Guide
                  </button>
                  <button
                    onClick={() => onStartCooking(recipe)}
                    className="px-3 py-1.5 rounded-lg bg-[#c85a32] hover:bg-[#b04a25] text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Cook</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
