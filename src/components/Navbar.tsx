import React from 'react';
import {
  Utensils,
  BookOpen,
  ShoppingBag,
  Calendar,
  Layers,
  Sparkles,
  Clock,
  Bookmark,
  Search,
  ShieldCheck,
  UserRound,
  Info
} from 'lucide-react';
import { ActiveCookingTimer } from '../types';

interface NavbarProps {
  activeTab: 'recipes' | 'techniques' | 'pantry' | 'mealplan' | 'grocery' | 'admin' | 'account' | 'about' | 'privacy' | 'terms';
  setActiveTab: (tab: 'recipes' | 'techniques' | 'pantry' | 'mealplan' | 'grocery' | 'admin' | 'account' | 'about' | 'privacy' | 'terms') => void;
  unitSystem: 'us' | 'metric';
  setUnitSystem: (system: 'us' | 'metric') => void;
  bookmarksCount: number;
  onOpenBookmarks: () => void;
  activeTimers: ActiveCookingTimer[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdminLoggedIn?: boolean;
  currentUserName?: string;
  onOpenAccount?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unitSystem,
  setUnitSystem,
  bookmarksCount,
  onOpenBookmarks,
  activeTimers,
  searchQuery,
  setSearchQuery,
  isAdminLoggedIn = false,
  currentUserName,
  onOpenAccount,
}) => {
  const runningTimersCount = activeTimers.filter((t) => t.isRunning).length;

  return (
    <header id="main-navbar" className="no-print sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur border-b border-[#e7ded3] shadow-xs">
      {/* Top Banner / Brand Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={() => setActiveTab('recipes')}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c85a32] to-[#9e3b16] text-white flex items-center justify-center shadow-sm">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-display font-bold text-xl tracking-tight text-[#1e1b18]">
                Savor & Craft
              </span>
              <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider bg-[#f6e5dc] text-[#9c3a17] px-2 py-0.5 rounded">
                Culinary Academy & Kitchen Lab
              </span>
            </div>
            <p className="text-[11px] text-[#7a6f64] hidden sm:block">
              Chef-Tested Recipes & Master Food Preparation Guides
            </p>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 text-[#9c8e80] absolute left-3 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'recipes') setActiveTab('recipes');
            }}
            placeholder="Search recipes, ingredients, techniques..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#ded5c8] rounded-xl text-[#2c2825] placeholder-[#a69a8d] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30 focus:border-[#c85a32] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-xs text-[#9a8c7e] hover:text-[#2c2825]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unit Toggle */}
          <div className="flex items-center bg-[#f0e9df] p-0.5 rounded-lg border border-[#ded5c8] text-xs font-semibold">
            <button
              id="unit-us-toggle"
              onClick={() => setUnitSystem('us')}
              className={`px-2.5 py-1 rounded-md transition-all ${unitSystem === 'us'
                ? 'bg-white text-[#1f1a16] shadow-xs'
                : 'text-[#7e7368] hover:text-[#2c2825]'
                }`}
            >
              US
            </button>
            <button
              id="unit-metric-toggle"
              onClick={() => setUnitSystem('metric')}
              className={`px-2.5 py-1 rounded-md transition-all ${unitSystem === 'metric'
                ? 'bg-white text-[#1f1a16] shadow-xs'
                : 'text-[#7e7368] hover:text-[#2c2825]'
                }`}
            >
              Metric
            </button>
          </div>

          {/* Active Timers Badge */}
          {activeTimers.length > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#27221e] text-white text-xs font-mono shadow-xs animate-pulse">
              <Clock className="w-3.5 h-3.5 text-[#ffab80]" />
              <span>{runningTimersCount} Active</span>
            </div>
          )}

          {/* Bookmarks Counter Button */}
          <button
            id="bookmarks-button"
            onClick={onOpenBookmarks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ded5c8] bg-white text-xs font-medium text-[#4a423b] hover:bg-[#f5efe7] transition-all shadow-xs"
            title="Saved Recipes"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#c85a32]" />
            <span className="hidden sm:inline">Saved</span>
            <span className="bg-[#f5e6dd] text-[#9c3a17] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {bookmarksCount}
            </span>
          </button>
          {currentUserName && (
            <button
              id="account-button"
              onClick={onOpenAccount}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ded5c8] bg-white text-xs font-medium text-[#4a423b] hover:bg-[#f5efe7] transition-all shadow-xs"
              title="My Account"
            >
              <UserRound className="w-3.5 h-3.5 text-[#c85a32]" />
              <span className="hidden sm:inline max-w-24 truncate">{currentUserName}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation Row */}
      <div className="border-t border-[#ede5db] bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1.5">
          <button
            id="nav-tab-recipes"
            onClick={() => setActiveTab('recipes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'recipes'
              ? 'bg-[#c85a32] text-white shadow-xs'
              : 'text-[#5f5449] hover:bg-[#f2ece3] hover:text-[#1c1815]'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            Recipes & Guides
          </button>

          <button
            id="nav-tab-techniques"
            onClick={() => setActiveTab('techniques')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'techniques'
              ? 'bg-[#c85a32] text-white shadow-xs'
              : 'text-[#5f5449] hover:bg-[#f2ece3] hover:text-[#1c1815]'
              }`}
          >
            <Sparkles className="w-4 h-4" />
            Master Prep Skills
          </button>

          <button
            id="nav-tab-pantry"
            onClick={() => setActiveTab('pantry')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'pantry'
              ? 'bg-[#c85a32] text-white shadow-xs'
              : 'text-[#5f5449] hover:bg-[#f2ece3] hover:text-[#1c1815]'
              }`}
          >
            <Layers className="w-4 h-4" />
            Pantry Matcher
          </button>

          <button
            id="nav-tab-mealplan"
            onClick={() => setActiveTab('mealplan')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'mealplan'
              ? 'bg-[#c85a32] text-white shadow-xs'
              : 'text-[#5f5449] hover:bg-[#f2ece3] hover:text-[#1c1815]'
              }`}
          >
            <Calendar className="w-4 h-4" />
            Weekly Meal Planner
          </button>

          <button
            id="nav-tab-grocery"
            onClick={() => setActiveTab('grocery')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'grocery'
              ? 'bg-[#c85a32] text-white shadow-xs'
              : 'text-[#5f5449] hover:bg-[#f2ece3] hover:text-[#1c1815]'
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Smart Grocery List
          </button>

          <button
            id="nav-tab-about"
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'about'
              ? 'bg-[#c85a32] text-white shadow-xs'
              : 'text-[#5f5449] hover:bg-[#f2ece3] hover:text-[#1c1815]'
              }`}
          >
            <Info className="w-4 h-4" />
            About Us
          </button>

          <button
            id="nav-tab-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ml-auto ${activeTab === 'admin'
              ? 'bg-[#26201b] text-white shadow-xs ring-1 ring-[#c85a32]'
              : isAdminLoggedIn
                ? 'text-[#2e261f] hover:bg-[#efe7dd] bg-[#faefe5] border border-[#d8c2b0]'
                : 'text-[#6c5e51] hover:bg-[#efe7dd] hover:text-[#1c1815] bg-[#faf3ea] border border-[#e6dbce]'
              }`}
          >
            <ShieldCheck
              className={`w-4 h-4 ${isAdminLoggedIn ? 'text-[#16a34a]' : 'text-[#c85a32]'}`}
            />
            <span>{isAdminLoggedIn ? 'Admin Portal' : 'Login / Sign up'}</span>
            {isAdminLoggedIn && (
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
