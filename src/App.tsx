import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Flame,
  Clock,
  Sparkles,
  Award,
  ChefHat,
  Bookmark,
  Plus,
  Play,
  RotateCcw,
  ArrowRight,
  SlidersHorizontal,
  X,
  Layers,
  Utensils
} from 'lucide-react';
import { Recipe, Ingredient, GroceryItem, ActiveCookingTimer, Cuisine, Category, Difficulty, CookingMethod, PrepTechnique } from './types';
import { RECIPES as INITIAL_RECIPES } from './data/recipes';
import { CULINARY_TECHNIQUES as INITIAL_TECHNIQUES } from './data/techniques';
import { Navbar } from './components/Navbar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { CookingModeModal } from './components/CookingModeModal';
import { PrepTechniquesGuide } from './components/PrepTechniquesGuide';
import { PantryMatcher } from './components/PantryMatcher';
import { MealPlanner } from './components/MealPlanner';
import { GroceryList } from './components/GroceryList';
import { CookingTimerWidget } from './components/CookingTimerWidget';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { AdminRecipeEditorModal } from './components/AdminRecipeEditorModal';
import { AccountSettings } from './components/AccountSettings';
import { AboutUs } from './components/AboutUs';
import { LegalPage } from './components/LegalPage';
import { GoogleAdSlot } from './components/GoogleAdSlot';
import { User } from './types/auth';
import { authApi } from './utils/api';
import {
  clearAdminSession,
  createAdminSession,
  hashPassword,
  generateSalt,
  sanitizeUrl,
  sanitizeSafeJsonString
} from './utils/security';

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'recipes' | 'techniques' | 'pantry' | 'mealplan' | 'grocery' | 'admin' | 'account' | 'about' | 'privacy' | 'terms'>('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cookingModeRecipe, setCookingModeRecipe] = useState<Recipe | null>(null);
  const [adminEditingRecipe, setAdminEditingRecipe] = useState<Recipe | 'new' | null>(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Administrator Account & Security State
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('savorcraft_admin_email');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'walidyach788@gmail.com';
  });

  const [adminPasscodeSalt, setAdminPasscodeSalt] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('savorcraft_admin_salt');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'savorcraft_secure_salt_2026';
  });

  const [adminPasscodeHash, setAdminPasscodeHash] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('savorcraft_admin_hash');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return false;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Restore the server-side session and initialize legacy dashboard settings.
  useEffect(() => {
    authApi.me()
      .then(({ user }) => {
        setCurrentUser(user);
        setIsAdminLoggedIn(user.role === 'admin');
      })
      .catch(() => {
        setCurrentUser(null);
        setIsAdminLoggedIn(false);
      });

    // Initialize default password hash if not set
    if (!adminPasscodeHash) {
      hashPassword('admin2026', adminPasscodeSalt).then((h) => {
        setAdminPasscodeHash(h);
      });
    }
  }, [adminPasscodeSalt, adminPasscodeHash]);

  // User Preferences & Settings
  const [unitSystem, setUnitSystem] = useState<'us' | 'metric'>('us');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');

  // Local Storage Persistent Collections
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('savorcraft_recipes_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_RECIPES;
  });

  const [techniques, setTechniques] = useState<PrepTechnique[]>(() => {
    try {
      const saved = localStorage.getItem('savorcraft_techniques_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_TECHNIQUES;
  });

  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [bookmarksLoadedFor, setBookmarksLoadedFor] = useState<string | null>(null);

  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(() => {
    try {
      const saved = localStorage.getItem('savorcraft_grocery');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: 'g-1', name: 'Fresh Rosemary & Thyme', amount: '1 bunch', category: 'Produce', checked: false, recipeSource: 'Cast-Iron Ribeye' },
      { id: 'g-2', name: 'San Marzano Canned Tomatoes DOP', amount: '2 cans', category: 'Pantry & Spices', checked: false, recipeSource: 'Pizza Margherita' },
      { id: 'g-3', name: 'Pecorino Romano DOP', amount: '200g', category: 'Dairy & Eggs', checked: false, recipeSource: 'Spaghetti Carbonara' },
    ];
  });

  // Active Multi-Timers State
  const [activeTimers, setActiveTimers] = useState<ActiveCookingTimer[]>([]);

  // Persist recipes
  useEffect(() => {
    try {
      localStorage.setItem('savorcraft_recipes_v2', JSON.stringify(recipes));
    } catch {
      // ignore
    }
  }, [recipes]);

  // Persist techniques
  useEffect(() => {
    try {
      localStorage.setItem('savorcraft_techniques_v2', JSON.stringify(techniques));
    } catch {
      // ignore
    }
  }, [techniques]);

  // Load saved recipes for the signed-in account.
  useEffect(() => {
    if (!currentUser) {
      setBookmarks(new Set());
      setBookmarksLoadedFor(null);
      return;
    }
    try {
      const saved = localStorage.getItem(`savorcraft_bookmarks_${currentUser.id}`);
      setBookmarks(saved ? new Set(JSON.parse(saved)) : new Set());
      setBookmarksLoadedFor(currentUser.id);
    } catch {
      setBookmarks(new Set());
      setBookmarksLoadedFor(currentUser.id);
    }
  }, [currentUser]);

  // Persist saved recipes for the signed-in account.
  useEffect(() => {
    if (!currentUser || bookmarksLoadedFor !== currentUser.id) return;
    try {
      localStorage.setItem(`savorcraft_bookmarks_${currentUser.id}`, JSON.stringify(Array.from(bookmarks)));
    } catch {
      // ignore
    }
  }, [bookmarks, bookmarksLoadedFor, currentUser]);

  // Persist grocery items
  useEffect(() => {
    try {
      localStorage.setItem('savorcraft_grocery', JSON.stringify(groceryItems));
    } catch {
      // ignore
    }
  }, [groceryItems]);

  // Admin Data Handlers
  const handleUpdateRecipes = (newRecipesList: Recipe[]) => {
    setRecipes(newRecipesList);
    setSelectedRecipe((current) => {
      if (!current) return current;
      return newRecipesList.find((recipe) => recipe.id === current.id) || null;
    });
  };

  const handleUpdateTechniques = (newTechList: PrepTechnique[]) => {
    setTechniques(newTechList);
  };

  const handleResetAllData = () => {
    setRecipes(INITIAL_RECIPES);
    setTechniques(INITIAL_TECHNIQUES);
    setSelectedRecipe(null);
    try {
      localStorage.removeItem('savorcraft_recipes_v2');
      localStorage.removeItem('savorcraft_techniques_v2');
      localStorage.removeItem('savorcraft_custom_recipes');
    } catch {
      // ignore
    }
  };

  // Admin Authentication Handlers
  const handleAdminLoginSuccess = async (_email: string) => {
    try {
      const { user } = await authApi.me();
      setCurrentUser(user);
      setIsAdminLoggedIn(user.role === 'admin');
      setActiveTab(user.role === 'admin' ? 'admin' : 'recipes');
    } catch {
      setCurrentUser(null);
      setIsAdminLoggedIn(false);
    }
  };

  const handleAdminLogout = async () => {
    setIsAdminLoggedIn(false);
    setCurrentUser(null);
    await authApi.logout().catch(() => undefined);
    clearAdminSession();
    setActiveTab('recipes');
  };

  const handlePasscodeChange = (newHash: string, newSalt: string) => {
    setAdminPasscodeHash(newHash);
    setAdminPasscodeSalt(newSalt);
    try {
      localStorage.setItem('savorcraft_admin_hash', newHash);
      localStorage.setItem('savorcraft_admin_salt', newSalt);
      localStorage.removeItem('savorcraft_admin_pass'); // remove cleartext legacy passcode
    } catch {
      // ignore
    }
  };

  const handleAdminEmailChange = (newEmail: string) => {
    setAdminEmail(newEmail);
    if (isAdminLoggedIn) {
      createAdminSession(newEmail);
    }
    try {
      localStorage.setItem('savorcraft_admin_email', newEmail);
    } catch {
      // ignore
    }
  };

  // Bookmark Toggle Handler
  const toggleBookmark = (recipeId: string) => {
    if (!currentUser) {
      setActiveTab('admin');
      setSelectedRecipe(null);
      return;
    }
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });
  };

  // Add or edit recipe from Admin Editor (Strictly Admin Only)
  const handleSaveAdminRecipe = (recipeToSave: Recipe) => {
    if (!isAdminLoggedIn) return;

    setRecipes((prev) => {
      const exists = prev.some((r) => r.id === recipeToSave.id);
      const updated = exists
        ? prev.map((r) => (r.id === recipeToSave.id ? recipeToSave : r))
        : [recipeToSave, ...prev];
      try {
        localStorage.setItem('savorcraft_custom_recipes', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (selectedRecipe && selectedRecipe.id === recipeToSave.id) {
      setSelectedRecipe(recipeToSave);
    }
    setAdminEditingRecipe(null);
  };

  // Add ingredients to Smart Grocery List
  const handleAddIngredientsToGrocery = (ingredients: Ingredient[], recipeTitle: string, scale: number = 1) => {
    const newItems: GroceryItem[] = ingredients.map((ing) => {
      const amountStr =
        unitSystem === 'metric'
          ? `${Number((ing.metricBase * scale).toFixed(1))} ${ing.metricUnit}`
          : `${Number((ing.amountBase * scale).toFixed(2))} ${ing.unit}`;

      return {
        id: `g-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: ing.name,
        amount: amountStr,
        category: ing.category.includes('meat') ? 'Meat & Seafood' : ing.category.includes('dairy') ? 'Dairy & Eggs' : ing.category.includes('produce') ? 'Produce' : ing.category.includes('grain') ? 'Grains & Pasta' : 'Pantry & Spices',
        checked: false,
        recipeSource: recipeTitle,
      };
    });

    setGroceryItems((prev) => [...prev, ...newItems]);
  };

  // Grocery List Handlers
  const handleToggleGroceryItem = (id: string) => {
    setGroceryItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const handleDeleteGroceryItem = (id: string) => {
    setGroceryItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddCustomGroceryItem = (name: string, category: string, amount: string) => {
    const item: GroceryItem = {
      id: `g-custom-${Date.now()}`,
      name,
      category,
      amount,
      checked: false,
      recipeSource: 'Custom Item',
    };
    setGroceryItems((prev) => [item, ...prev]);
  };

  const handleClearCheckedGrocery = () => {
    setGroceryItems((prev) => prev.filter((i) => !i.checked));
  };

  const handleClearAllGrocery = () => {
    setGroceryItems([]);
  };

  // Multi-Timer Controls
  const handleStartTimer = (label: string, seconds: number, recipeTitle: string, stepNum: number) => {
    const newTimer: ActiveCookingTimer = {
      id: `timer-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      label: `Step ${stepNum}: ${label}`,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: true,
      recipeTitle,
      stepNumber: stepNum,
    };
    setActiveTimers((prev) => [newTimer, ...prev]);
  };

  const handleToggleTimerRunning = (id: string) => {
    setActiveTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const handleResetTimer = (id: string) => {
    setActiveTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false } : t))
    );
  };

  const handleDeleteTimer = (id: string) => {
    setActiveTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTickTimers = () => {
    setActiveTimers((prev) =>
      prev.map((t) => {
        if (t.isRunning && t.remainingSeconds > 0) {
          return { ...t, remainingSeconds: t.remainingSeconds - 1 };
        }
        return t;
      })
    );
  };

  // Filter Recipes
  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCuisine = selectedCuisine === 'all' || r.cuisine === selectedCuisine;
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || r.difficulty === selectedDifficulty;
    const matchesMethod = selectedMethod === 'all' || r.method === selectedMethod;
    const matchesDietary = selectedDietary === 'all' || r.dietary.includes(selectedDietary as any);
    const matchesBookmarks = !showBookmarksOnly || bookmarks.has(r.id);

    return (
      matchesSearch &&
      matchesCuisine &&
      matchesCategory &&
      matchesDifficulty &&
      matchesMethod &&
      matchesDietary &&
      matchesBookmarks
    );
  });

  const featuredRecipe = recipes.find((r) => r.isFeatured) || recipes[0];

  return (
    <div id="savorcraft-app" className="min-h-screen bg-[#faf8f5] text-[#2c2825] font-sans antialiased flex flex-col justify-between selection:bg-[#c85a32]/20 selection:text-[#943614]">
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedRecipe(null);
            setShowBookmarksOnly(false);
          }}
          unitSystem={unitSystem}
          setUnitSystem={setUnitSystem}
          bookmarksCount={bookmarks.size}
          onOpenBookmarks={() => {
            if (!currentUser) {
              setActiveTab('admin');
              setSelectedRecipe(null);
              return;
            }
            setActiveTab('recipes');
            setSelectedRecipe(null);
            setShowBookmarksOnly(true);
          }}
          activeTimers={activeTimers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isAdminLoggedIn={isAdminLoggedIn}
          currentUserName={currentUser?.name}
          onOpenAccount={() => {
            setActiveTab('account');
            setSelectedRecipe(null);
          }}
        />

        {/* Dynamic View Body */}
        <main className="pb-16">
          {/* 1. RECIPE DETAIL VIEW (If a recipe is clicked) */}
          {selectedRecipe ? (
            <RecipeDetail
              recipe={selectedRecipe}
              onBack={() => setSelectedRecipe(null)}
              onStartCooking={(r) => setCookingModeRecipe(r)}
              isBookmarked={bookmarks.has(selectedRecipe.id)}
              onToggleBookmark={toggleBookmark}
              unitSystem={unitSystem}
              setUnitSystem={setUnitSystem}
              onAddIngredientsToGrocery={handleAddIngredientsToGrocery}
              onStartTimer={handleStartTimer}
              isAdminLoggedIn={isAdminLoggedIn}
              onEditRecipe={(r) => setAdminEditingRecipe(r)}
            />
          ) : activeTab === 'recipes' ? (
            /* 2. MAIN RECIPES EXPLORER CATALOG */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn">

              {/* Top Hero Editorial Banner (when not searching or filtering by bookmark) */}
              {!searchQuery && !showBookmarksOnly && selectedCuisine === 'all' && selectedCategory === 'all' && (
                <div className="mb-10 p-6 sm:p-10 bg-gradient-to-br from-[#26201b] via-[#1c1815] to-[#120f0d] text-white rounded-3xl shadow-lg border border-[#3e342c] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#c85a32] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Editor's Feature Dish
                      </span>
                      <span className="text-xs text-[#c5b8ac]">
                        {featuredRecipe.cuisine} • {featuredRecipe.method}
                      </span>
                    </div>

                    <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-3">
                      {featuredRecipe.title}
                    </h1>

                    <p className="text-sm sm:text-base text-[#d1c5b8] leading-relaxed mb-6 line-clamp-3">
                      {featuredRecipe.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setSelectedRecipe(featuredRecipe)}
                        className="px-5 py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b04a25] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                      >
                        <span>View Preparation Guide</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setCookingModeRecipe(featuredRecipe)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border border-white/10"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Interactive Cooking Mode</span>
                      </button>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedRecipe(featuredRecipe)}
                    className="relative w-full lg:w-96 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-white/15 cursor-pointer group shrink-0"
                  >
                    <img
                      src={featuredRecipe.heroImage}
                      alt={featuredRecipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white text-xs font-semibold">
                      Prep: {featuredRecipe.prepTimeMins}m | Cook: {featuredRecipe.cookTimeMins}m
                    </div>
                  </div>
                </div>
              )}

              <GoogleAdSlot
                slot={import.meta.env.VITE_ADSENSE_SLOT_HOME as string | undefined}
                className="mb-8"
              />

              {/* Filter Bar & Controls */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebd8c8] shadow-xs mb-8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f2ece3] pb-3">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#c85a32]" />
                    <h3 className="font-serif-display font-bold text-base text-[#1f1a16]">
                      Filter Recipes & Preparation Methods
                    </h3>
                  </div>

                  {showBookmarksOnly && (
                    <div className="flex items-center gap-2 bg-[#fdf5f0] text-[#9c3a17] text-xs font-bold px-3 py-1 rounded-lg border border-[#fae2d0]">
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                      <span>Showing Saved Bookmarks ({bookmarks.size})</span>
                      <button
                        onClick={() => setShowBookmarksOnly(false)}
                        className="ml-1 hover:text-black"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {(selectedCuisine !== 'all' || selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedMethod !== 'all' || selectedDietary !== 'all' || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCuisine('all');
                        setSelectedCategory('all');
                        setSelectedDifficulty('all');
                        setSelectedMethod('all');
                        setSelectedDietary('all');
                        setSearchQuery('');
                        setShowBookmarksOnly(false);
                      }}
                      className="text-xs text-[#9c3a17] font-semibold hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Filters
                    </button>
                  )}
                </div>

                {/* Filter Dropdown Selectors */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#887a6c] mb-1">Cuisine</label>
                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#ded5c8] bg-[#faf8f5] text-[#342c24] focus:outline-none"
                    >
                      <option value="all">All Cuisines</option>
                      {['Italian', 'French', 'Japanese', 'Thai', 'Spanish', 'Mediterranean', 'American'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#887a6c] mb-1">Dish Type</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#ded5c8] bg-[#faf8f5] text-[#342c24] focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      {['Appetizers', 'Mains', 'Pasta & Noodles', 'Soups & Stews', 'Bowls & Salads', 'Baking & Bread', 'Desserts'].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#887a6c] mb-1">Cooking Method</label>
                    <select
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#ded5c8] bg-[#faf8f5] text-[#342c24] focus:outline-none"
                    >
                      <option value="all">All Methods</option>
                      {['Stovetop / Pan-Sear', 'Oven / Roasting', 'Air Fryer', 'Slow Simmer', 'Boiling / Pasta', 'No-Cook / Fresh'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#887a6c] mb-1">Skill Level</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#ded5c8] bg-[#faf8f5] text-[#342c24] focus:outline-none"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-[#887a6c] mb-1">Dietary Preference</label>
                    <select
                      value={selectedDietary}
                      onChange={(e) => setSelectedDietary(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#ded5c8] bg-[#faf8f5] text-[#342c24] focus:outline-none"
                    >
                      <option value="all">Any Diet</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                      <option value="Dairy-Free">Dairy-Free</option>
                      <option value="High-Protein">High-Protein</option>
                      <option value="Low-Carb">Low-Carb</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Recipe Cards Grid */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif-display text-2xl font-bold text-[#1f1a16]">
                  Culinary Repertoire ({filteredRecipes.length})
                </h2>
                <span className="text-xs text-[#85776a]">
                  Chef tested step-by-step guides
                </span>
              </div>

              {filteredRecipes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#ded5c8] p-8">
                  <div className="w-12 h-12 rounded-full bg-[#faefe5] text-[#c85a32] flex items-center justify-center mx-auto mb-3">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-display font-bold text-xl text-[#1f1a16] mb-1">
                    No matching recipes found
                  </h3>
                  <p className="text-xs text-[#786b5e] max-w-sm mx-auto mb-4">
                    Try adjusting your filter settings or search keyword to discover more culinary guides.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCuisine('all');
                      setSelectedCategory('all');
                      setSelectedDifficulty('all');
                      setSelectedMethod('all');
                      setSelectedDietary('all');
                      setSearchQuery('');
                      setShowBookmarksOnly(false);
                    }}
                    className="px-4 py-2 bg-[#c85a32] text-white text-xs font-bold rounded-xl"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onSelectRecipe={(r) => setSelectedRecipe(r)}
                      onStartCooking={(r) => setCookingModeRecipe(r)}
                      isBookmarked={bookmarks.has(recipe.id)}
                      onToggleBookmark={toggleBookmark}
                      isAdminLoggedIn={isAdminLoggedIn}
                      onEditRecipe={(r) => setAdminEditingRecipe(r)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'techniques' ? (
            /* 3. MASTER PREP SKILLS GUIDE */
            <PrepTechniquesGuide techniques={techniques} />
          ) : activeTab === 'pantry' ? (
            /* 4. PANTRY MATCHER */
            <PantryMatcher
              onSelectRecipe={(r) => {
                setSelectedRecipe(r);
                setActiveTab('recipes');
              }}
              onStartCooking={(r) => setCookingModeRecipe(r)}
              onAddIngredientsToGrocery={handleAddIngredientsToGrocery}
            />
          ) : activeTab === 'mealplan' ? (
            /* 5. WEEKLY MEAL PLANNER */
            <MealPlanner
              onSelectRecipe={(r) => {
                setSelectedRecipe(r);
                setActiveTab('recipes');
              }}
              onStartCooking={(r) => setCookingModeRecipe(r)}
              onAddIngredientsToGrocery={handleAddIngredientsToGrocery}
            />
          ) : activeTab === 'grocery' ? (
            /* 6. SMART GROCERY LIST */
            <GroceryList
              groceryItems={groceryItems}
              onToggleItem={handleToggleGroceryItem}
              onDeleteItem={handleDeleteGroceryItem}
              onAddItem={handleAddCustomGroceryItem}
              onClearChecked={handleClearCheckedGrocery}
              onClearAll={handleClearAllGrocery}
            />
          ) : activeTab === 'account' && currentUser ? (
            <AccountSettings
              user={currentUser}
              onUserUpdated={setCurrentUser}
              onLogout={handleAdminLogout}
            />
          ) : activeTab === 'about' ? (
            <AboutUs onExploreRecipes={() => setActiveTab('recipes')} />
          ) : activeTab === 'privacy' ? (
            <LegalPage type="privacy" onBack={() => setActiveTab('recipes')} />
          ) : activeTab === 'terms' ? (
            <LegalPage type="terms" onBack={() => setActiveTab('recipes')} />
          ) : !isAdminLoggedIn ? (
            /* 7. SECURE ADMIN AUTHENTICATION GATE */
            <AdminLogin
              onLoginSuccess={handleAdminLoginSuccess}
              onCancel={() => setActiveTab('recipes')}
              allowedEmail={adminEmail}
              adminPasscodeHash={adminPasscodeHash}
              adminPasscodeSalt={adminPasscodeSalt}
              legacyPasscode="admin2026"
            />
          ) : (
            /* 8. ADMIN CONSOLE & CATALOG MANAGEMENT */
            <AdminDashboard
              recipes={recipes}
              onUpdateRecipes={handleUpdateRecipes}
              techniques={techniques}
              onUpdateTechniques={handleUpdateTechniques}
              bookmarksCount={bookmarks.size}
              onViewRecipe={(r) => {
                setSelectedRecipe(r);
                setActiveTab('recipes');
              }}
              onResetAllData={handleResetAllData}
              adminEmail={adminEmail}
              onLogout={handleAdminLogout}
              adminPasscodeHash={adminPasscodeHash}
              adminPasscodeSalt={adminPasscodeSalt}
              legacyPasscode="admin2026"
              onChangePasscode={handlePasscodeChange}
              onChangeAdminEmail={handleAdminEmailChange}
            />
          )}
        </main>
      </div>

      {/* Persistent Docked Multi-Timer Widget */}
      <CookingTimerWidget
        timers={activeTimers}
        onToggleTimer={handleToggleTimerRunning}
        onResetTimer={handleResetTimer}
        onDeleteTimer={handleDeleteTimer}
        onTickTimers={handleTickTimers}
      />

      {/* Full-Screen Hands-Free Cooking Mode Modal */}
      {cookingModeRecipe && (
        <CookingModeModal
          recipe={cookingModeRecipe}
          onClose={() => setCookingModeRecipe(null)}
        />
      )}

      {/* Admin Recipe Editor & Creator Modal (Restricted Exclusively to Authenticated Administrator) */}
      {adminEditingRecipe && isAdminLoggedIn && (
        <AdminRecipeEditorModal
          initialRecipe={adminEditingRecipe === 'new' ? null : adminEditingRecipe}
          onClose={() => setAdminEditingRecipe(null)}
          onSave={handleSaveAdminRecipe}
        />
      )}

      {/* Editorial Footer */}
      <footer className="no-print border-t border-[#ebd8c8] bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d7064]">
          <div className="flex items-center gap-2">
            <span className="font-serif-display font-bold text-base text-[#1f1a16]">
              Savor & Craft
            </span>
            <span className="text-[#d8cdbf]">•</span>
            <span>Culinary Academy & Food Preparation Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <span>© 2026 SavorCraft Kitchen</span>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('privacy');
                setSelectedRecipe(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#c85a32] font-semibold"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('terms');
                setSelectedRecipe(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#c85a32] font-semibold"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#c85a32] font-semibold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
