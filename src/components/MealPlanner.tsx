import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Utensils,
  ChevronRight,
  Play
} from 'lucide-react';
import { Recipe, Ingredient } from '../types';
import { RECIPES } from '../data/recipes';

interface MealPlannerProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCooking: (recipe: Recipe) => void;
  onAddIngredientsToGrocery: (ingredients: Ingredient[], recipeTitle: string, scale: number) => void;
}

type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner';

interface PlanSlot {
  day: string;
  slot: MealSlot;
  recipeId?: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const MealPlanner: React.FC<MealPlannerProps> = ({
  onSelectRecipe,
  onStartCooking,
  onAddIngredientsToGrocery,
}) => {
  // Sample initial meal plan
  const [plannerState, setPlannerState] = useState<Record<string, string>>({
    'Monday-Dinner': 'creamy-tuscan-salmon',
    'Tuesday-Dinner': 'classic-spaghetti-carbonara',
    'Wednesday-Lunch': 'mediterranean-quinoa-power-bowl',
    'Wednesday-Dinner': 'thai-green-coconut-curry',
    'Friday-Dinner': 'artisan-neapolitan-margherita-pizza',
    'Saturday-Dinner': 'cast-iron-ribeye-steak',
    'Sunday-Lunch': 'air-fryer-arancini',
    'Sunday-Dinner': 'french-beef-bourguignon',
  });

  const [pickingSlot, setPickingSlot] = useState<{ day: string; slot: MealSlot } | null>(null);
  const [exportedNotice, setExportedNotice] = useState<boolean>(false);

  const getRecipe = (id?: string) => RECIPES.find((r) => r.id === id);

  const handleSetRecipe = (recipeId: string) => {
    if (!pickingSlot) return;
    const key = `${pickingSlot.day}-${pickingSlot.slot}`;
    setPlannerState((prev) => ({ ...prev, [key]: recipeId }));
    setPickingSlot(null);
  };

  const handleRemoveRecipe = (day: string, slot: MealSlot) => {
    const key = `${day}-${slot}`;
    setPlannerState((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleClearWeek = () => {
    setPlannerState({});
  };

  // Generate combined grocery list for all planned meals
  const handleExportWeekToGrocery = () => {
    const plannedRecipeIds: string[] = Object.values(plannerState);
    if (plannedRecipeIds.length === 0) return;

    plannedRecipeIds.forEach((id: string) => {
      const rec = getRecipe(id);
      if (rec) {
        onAddIngredientsToGrocery(rec.ingredients, `${rec.title} (Meal Plan)`, 1);
      }
    });

    setExportedNotice(true);
    setTimeout(() => setExportedNotice(false), 3000);
  };

  // Calculate total weekly metrics
  const plannedRecipes = (Object.values(plannerState) as string[])
    .map((id: string) => getRecipe(id))
    .filter(Boolean) as Recipe[];

  const totalPrepTime = plannedRecipes.reduce((acc, r) => acc + r.totalTimeMins, 0);
  const totalMealsCount = plannedRecipes.length;

  return (
    <div id="meal-planner-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] bg-[#fcf0e8] px-2.5 py-0.5 rounded-md">
              Prep Organization
            </span>
            <span className="text-[#c1b6a7]">•</span>
            <span className="text-xs text-[#73685e]">7-Day Cooking Calendar</span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1815] leading-tight">
            Weekly Meal Planner & Prep Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#5d5146] mt-1">
            Map out your week's meals, calculate prep workloads, and auto-export all needed ingredients directly to your Smart Grocery List.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={handleClearWeek}
            className="px-3 py-2 rounded-xl border border-[#ded5c8] bg-white text-xs font-medium text-[#5f5146] hover:bg-[#f4efe8] transition-colors"
          >
            Clear Week
          </button>

          <button
            id="export-mealplan-grocery-btn"
            onClick={handleExportWeekToGrocery}
            disabled={totalMealsCount === 0}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              totalMealsCount === 0
                ? 'bg-[#ded5c8] text-[#8e8174] cursor-not-allowed'
                : 'bg-[#c85a32] hover:bg-[#b04a25] text-white active:scale-95'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{exportedNotice ? 'Added to Grocery List!' : 'Export Week to Grocery List'}</span>
          </button>
        </div>
      </div>

      {/* Weekly Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-2xl border border-[#eae0d2] shadow-xs mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7f73]">Planned Meals</p>
          <p className="text-lg font-bold text-[#1f1a16]">{totalMealsCount} dishes</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7f73]">Total Kitchen Time</p>
          <p className="text-lg font-bold text-[#1f1a16]">{Math.round(totalPrepTime / 60)}h {totalPrepTime % 60}m</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7f73]">Avg Daily Prep</p>
          <p className="text-lg font-bold text-[#1f1a16]">{totalMealsCount ? Math.round(totalPrepTime / 7) : 0} mins/day</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7f73]">Status</p>
          <p className="text-lg font-bold text-[#c85a32]">
            {totalMealsCount >= 5 ? 'Well Organized' : 'Planning in Progress'}
          </p>
        </div>
      </div>

      {/* 7-Day Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS.map((day) => {
          const slots: MealSlot[] = ['Lunch', 'Dinner'];

          return (
            <div
              key={day}
              className="bg-white rounded-2xl border border-[#ebd8c8] p-4 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="border-b border-[#f0e8dc] pb-2 mb-3">
                  <h3 className="font-serif-display font-bold text-base text-[#1c1815]">
                    {day}
                  </h3>
                </div>

                <div className="space-y-3">
                  {slots.map((slot) => {
                    const key = `${day}-${slot}`;
                    const recipeId = plannerState[key];
                    const recipe = getRecipe(recipeId);

                    return (
                      <div key={slot} className="bg-[#faf6f0] p-2.5 rounded-xl border border-[#ece2d4]">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#87786b] mb-1">
                          <span>{slot}</span>
                          {recipe && (
                            <button
                              onClick={() => handleRemoveRecipe(day, slot)}
                              className="text-[#a49688] hover:text-red-700"
                              title="Remove meal"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {recipe ? (
                          <div className="group">
                            <div
                              onClick={() => onSelectRecipe(recipe)}
                              className="cursor-pointer"
                            >
                              <img
                                src={recipe.heroImage}
                                alt={recipe.title}
                                className="w-full h-16 object-cover rounded-lg mb-1.5"
                                referrerPolicy="no-referrer"
                              />
                              <h4 className="font-serif-display font-bold text-xs text-[#1e1b18] line-clamp-1 group-hover:text-[#c85a32] transition-colors">
                                {recipe.title}
                              </h4>
                              <p className="text-[10px] text-[#786b5e] mt-0.5">
                                {recipe.totalTimeMins}m • {recipe.nutrition.calories} kcal
                              </p>
                            </div>

                            <button
                              onClick={() => onStartCooking(recipe)}
                              className="w-full mt-2 py-1 bg-[#251f1a] hover:bg-[#c85a32] text-white text-[10px] font-bold rounded-md flex items-center justify-center gap-1 transition-colors"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" /> Cook
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setPickingSlot({ day, slot })}
                            className="w-full py-3 border border-dashed border-[#d8cbba] rounded-lg text-xs font-semibold text-[#8a7a6c] hover:bg-[#f4efe8] hover:border-[#c85a32] hover:text-[#c85a32] transition-all flex flex-col items-center justify-center gap-1"
                          >
                            <Plus className="w-4 h-4 text-[#c85a32]" />
                            <span>Add Recipe</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Picker Modal */}
      {pickingSlot && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPickingSlot(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[85vh] rounded-2xl p-6 overflow-y-auto shadow-2xl border border-[#ebd8c8]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f0e8dc] pb-4 mb-4">
              <div>
                <h3 className="font-serif-display font-bold text-xl text-[#1f1a16]">
                  Select Recipe for {pickingSlot.day} {pickingSlot.slot}
                </h3>
                <p className="text-xs text-[#7e7164]">
                  Choose from our master chef recipe catalog
                </p>
              </div>
              <button
                onClick={() => setPickingSlot(null)}
                className="text-xs text-[#7e7164] hover:text-black"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RECIPES.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleSetRecipe(r.id)}
                  className="p-3 rounded-xl border border-[#e8dfd2] hover:border-[#c85a32] hover:bg-[#fff9f5] cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <img
                    src={r.heroImage}
                    alt={r.title}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-[#9e3a17]">
                      {r.cuisine} • {r.totalTimeMins}m
                    </span>
                    <h4 className="font-serif-display font-bold text-sm text-[#1e1b18] line-clamp-1 group-hover:text-[#c85a32]">
                      {r.title}
                    </h4>
                    <p className="text-[11px] text-[#716559] mt-0.5">
                      {r.difficulty} • {r.nutrition.calories} kcal
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
