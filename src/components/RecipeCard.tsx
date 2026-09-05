import React from 'react';
import { Clock, Flame, Users, Star, Bookmark, ChefHat, Play, Edit } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCooking: (recipe: Recipe) => void;
  isBookmarked: boolean;
  onToggleBookmark: (recipeId: string) => void;
  isAdminLoggedIn?: boolean;
  onEditRecipe?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelectRecipe,
  onStartCooking,
  isBookmarked,
  onToggleBookmark,
  isAdminLoggedIn = false,
  onEditRecipe,
}) => {
  return (
    <article
      id={`recipe-card-${recipe.id}`}
      className="group bg-white rounded-2xl border border-[#ebd8c8]/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden hover:border-[#c85a32]/40 relative"
    >
      {/* Hero Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#241e1a] cursor-pointer" onClick={() => onSelectRecipe(recipe)}>
        <img
          src={recipe.heroImage}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Gradient Scrim for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top Badges: Cuisine & Method */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-[#c85a32] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
            {recipe.cuisine}
          </span>
          <span className="bg-black/65 backdrop-blur text-white text-[11px] font-medium px-2 py-0.5 rounded-full border border-white/20">
            {recipe.method}
          </span>
        </div>

        {/* Action Buttons: Edit (Admin) & Bookmark */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isAdminLoggedIn && onEditRecipe && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditRecipe(recipe);
              }}
              className="p-2 rounded-full bg-[#c85a32] text-white hover:bg-[#b04a25] shadow-md transition-transform active:scale-90"
              title="Edit Recipe (Admin)"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bookmark Action Button */}
          <button
            id={`bookmark-btn-${recipe.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(recipe.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${isBookmarked
                ? 'bg-[#c85a32] text-white shadow-md'
                : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
              }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Recipe'}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Bottom Bar inside Image: Total Time & Difficulty */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium drop-shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#ffbe9e]" />
            <span>{recipe.totalTimeMins} mins total</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5 mb-2 text-xs">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current mr-1" />
              <span>{recipe.rating}</span>
            </div>
            <span className="text-[#998b7e]">({recipe.reviewsCount} reviews)</span>
            <span className="text-[#c7baa9]">•</span>
            <span className="text-[#7c6f62] truncate">{recipe.category}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectRecipe(recipe)}
            className="font-serif-display font-bold text-lg sm:text-xl text-[#1e1a17] leading-tight group-hover:text-[#c85a32] transition-colors cursor-pointer line-clamp-2 mb-1.5"
          >
            {recipe.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-[#63574c] line-clamp-2 leading-relaxed mb-3">
            {recipe.description}
          </p>

          {/* Dietary & Highlight Chips */}
          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.dietary.slice(0, 2).map((diet) => (
              <span
                key={diet}
                className="text-[10px] font-medium bg-[#f6efe6] text-[#715c48] px-2 py-0.5 rounded-md"
              >
                {diet}
              </span>
            ))}
            {recipe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium bg-[#faf3ed] text-[#9c4b2b] px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between gap-2">
          <div className="text-[11px] text-[#7e7266]">
            <span className="font-semibold text-[#2b2520]">{recipe.nutrition.calories}</span> kcal / serv
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onStartCooking(recipe)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2b2520] hover:bg-[#c85a32] text-white text-xs font-semibold transition-colors shadow-xs"
              title="Launch Hands-Free Step-by-Step Cooking Assistant"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Cook Now</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
