import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ChefHat,
  Sparkles,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Edit,
  Trash2,
  Copy,
  Eye,
  Download,
  Upload,
  RotateCcw,
  BarChart3,
  Database,
  Layers,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  Flame,
  FileJson,
  Check,
  X,
  LogOut,
  KeyRound,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';
import { Recipe, PrepTechnique, Cuisine, Category, Difficulty } from '../types';
import { AdminRecipeEditorModal } from './AdminRecipeEditorModal';
import { AdminTechniqueEditorModal } from './AdminTechniqueEditorModal';
import { UserManagement } from './UserManagement';
import { hashPassword, generateSalt, sanitizeUrl, sanitizeSafeJsonString } from '../utils/security';

interface AdminDashboardProps {
  recipes: Recipe[];
  onUpdateRecipes: (recipes: Recipe[]) => void;
  techniques: PrepTechnique[];
  onUpdateTechniques: (techniques: PrepTechnique[]) => void;
  bookmarksCount: number;
  onViewRecipe: (recipe: Recipe) => void;
  onResetAllData: () => void;
  adminEmail: string;
  onLogout: () => void;
  adminPasscodeHash: string;
  adminPasscodeSalt: string;
  legacyPasscode?: string;
  onChangePasscode: (newHash: string, newSalt: string) => void;
  onChangeAdminEmail: (newEmail: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  recipes,
  onUpdateRecipes,
  techniques,
  onUpdateTechniques,
  bookmarksCount,
  onViewRecipe,
  onResetAllData,
  adminEmail,
  onLogout,
  adminPasscodeHash,
  adminPasscodeSalt,
  legacyPasscode,
  onChangePasscode,
  onChangeAdminEmail,
}) => {
  const [adminTab, setAdminTab] = useState<'recipes' | 'techniques' | 'analytics' | 'backup' | 'security' | 'users' | 'categories'>('recipes');

  // Recipe sub-filters
  const [recipeSearch, setRecipeSearch] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState<boolean>(false);

  // Technique sub-filters
  const [techSearch, setTechSearch] = useState<string>('');
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>('all');
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState<string[]>(() => {
    const defaults = ['Appetizers', 'Mains', 'Pasta & Noodles', 'Soups & Stews', 'Bowls & Salads', 'Baking & Bread', 'Desserts'];
    try {
      const saved = localStorage.getItem('savorcraft_categories');
      return saved ? Array.from(new Set([...defaults, ...JSON.parse(saved)])) : defaults;
    } catch {
      return defaults;
    }
  });

  // Modals state
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState<boolean>(false);
  const [editingTechnique, setEditingTechnique] = useState<PrepTechnique | null>(null);
  const [isCreatingTechnique, setIsCreatingTechnique] = useState<boolean>(false);

  // JSON Import & Backup states
  const [jsonInput, setJsonInput] = useState<string>('');
  const [jsonFeedback, setJsonFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Security & Credentials change state
  const [newEmailInput, setNewEmailInput] = useState<string>(adminEmail);
  const [oldPasscode, setOldPasscode] = useState<string>('');
  const [newPasscode, setNewPasscode] = useState<string>('');
  const [confirmNewPasscode, setConfirmNewPasscode] = useState<string>('');
  const [securityFeedback, setSecurityFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const discovered = recipes.map((recipe) => recipe.category).filter(Boolean);
    setCategories((current) => {
      const next = Array.from(new Set([...current, ...discovered]));
      return next;
    });
  }, [recipes]);

  useEffect(() => {
    try { localStorage.setItem('savorcraft_categories', JSON.stringify(categories)); } catch { /* ignore */ }
  }, [categories]);

  // Handlers for Recipes
  const handleSaveRecipe = (recipeToSave: Recipe) => {
    const exists = recipes.some((r) => r.id === recipeToSave.id);
    let updated: Recipe[];
    if (exists) {
      updated = recipes.map((r) => (r.id === recipeToSave.id ? recipeToSave : r));
    } else {
      updated = [recipeToSave, ...recipes];
    }
    onUpdateRecipes(updated);
    setEditingRecipe(null);
    setIsCreatingRecipe(false);
  };

  const handleDeleteRecipe = (id: string) => {
    if (window.confirm('Are you sure you want to delete this recipe from the catalog?')) {
      const updated = recipes.filter((r) => r.id !== id);
      onUpdateRecipes(updated);
    }
  };

  const handleToggleFeatured = (id: string) => {
    const updated = recipes.map((r) => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r));
    onUpdateRecipes(updated);
  };

  const handleDuplicateRecipe = (recipe: Recipe) => {
    const duplicate: Recipe = {
      ...recipe,
      id: `recipe-copy-${Date.now()}`,
      title: `${recipe.title} (Copy)`,
      slug: `${recipe.slug}-copy-${Date.now().toString().slice(-4)}`,
      isFeatured: false,
    };
    onUpdateRecipes([duplicate, ...recipes]);
  };

  // Handlers for Techniques
  const handleSaveTechnique = (techToSave: PrepTechnique) => {
    const exists = techniques.some((t) => t.id === techToSave.id);
    let updated: PrepTechnique[];
    if (exists) {
      updated = techniques.map((t) => (t.id === techToSave.id ? techToSave : t));
    } else {
      updated = [techToSave, ...techniques];
    }
    onUpdateTechniques(updated);
    setEditingTechnique(null);
    setIsCreatingTechnique(false);
  };

  const handleDeleteTechnique = (id: string) => {
    if (window.confirm('Are you sure you want to delete this technique?')) {
      const updated = techniques.filter((t) => t.id !== id);
      onUpdateTechniques(updated);
    }
  };

  const handleAddCategory = () => {
    const name = categoryInput.trim();
    if (!name || categories.some((category) => category.toLowerCase() === name.toLowerCase())) return;
    setCategories((current) => [...current, name]);
    setCategoryInput('');
  };

  const handleRenameCategory = (category: string) => {
    const replacement = window.prompt('New category name', category)?.trim();
    if (!replacement || replacement === category || categories.some((item) => item.toLowerCase() === replacement.toLowerCase())) return;
    setCategories((current) => current.map((item) => item === category ? replacement : item));
    onUpdateRecipes(recipes.map((recipe) => recipe.category === category ? { ...recipe, category: replacement } : recipe));
  };

  const handleDeleteCategory = (category: string) => {
    if (recipes.some((recipe) => recipe.category === category)) {
      window.alert('Move or rename recipes in this category before deleting it.');
      return;
    }
    setCategories((current) => current.filter((item) => item !== category));
    if (selectedCategory === category) setSelectedCategory('all');
  };

  // Export JSON
  const handleExportJSON = () => {
    const exportData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      recipesCount: recipes.length,
      techniquesCount: techniques.length,
      recipes,
      techniques,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `savorcraft-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON with Strict Schema Validation and Sanitization
  const handleImportJSON = () => {
    try {
      if (!jsonInput.trim()) {
        setJsonFeedback({ type: 'error', message: 'Please paste valid JSON data into the text box.' });
        return;
      }
      const parsed = JSON.parse(jsonInput);
      let importedRecipesCount = 0;
      let importedTechniquesCount = 0;

      const rawRecipes = Array.isArray(parsed.recipes)
        ? parsed.recipes
        : Array.isArray(parsed) && parsed[0]?.title && parsed[0]?.ingredients
          ? parsed
          : null;

      if (rawRecipes) {
        // Sanitize imported recipes against XSS, Prototype Pollution & Missing fields
        const sanitizedRecipes: Recipe[] = rawRecipes
          .filter((r: any) => r && typeof r === 'object' && typeof r.title === 'string' && r.title.trim())
          .map((r: any, idx: number) => ({
            id: typeof r.id === 'string' && r.id ? r.id : `imported-recipe-${Date.now()}-${idx}`,
            slug: typeof r.slug === 'string' && r.slug ? r.slug : `imported-${idx}`,
            title: sanitizeSafeJsonString(r.title),
            subtitle: sanitizeSafeJsonString(r.subtitle || ''),
            cuisine: r.cuisine || 'International',
            category: r.category || 'Mains',
            difficulty: r.difficulty || 'Intermediate',
            method: r.method || 'Stovetop / Pan-Sear',
            prepTimeMins: Number(r.prepTimeMins) || 15,
            cookTimeMins: Number(r.cookTimeMins) || 20,
            totalTimeMins: Number(r.totalTimeMins) || (Number(r.prepTimeMins) || 15) + (Number(r.cookTimeMins) || 20),
            servings: Number(r.servings) || 4,
            rating: Math.min(5, Math.max(1, Number(r.rating) || 4.9)),
            reviewsCount: Number(r.reviewsCount) || 1,
            author: sanitizeSafeJsonString(r.author || 'Curated Culinary Chef'),
            heroImage: sanitizeUrl(r.heroImage, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'),
            description: sanitizeSafeJsonString(r.description || ''),
            chefNotes: sanitizeSafeJsonString(r.chefNotes || ''),
            winePairing: sanitizeSafeJsonString(r.winePairing || ''),
            dietary: Array.isArray(r.dietary) ? r.dietary : [],
            tags: Array.isArray(r.tags) ? r.tags.map((t: any) => sanitizeSafeJsonString(String(t))).filter(Boolean) : [],
            equipmentNeeded: Array.isArray(r.equipmentNeeded) ? r.equipmentNeeded.map((e: any) => sanitizeSafeJsonString(String(e))).filter(Boolean) : [],
            ingredients: Array.isArray(r.ingredients)
              ? r.ingredients.map((ing: any, iIdx: number) => ({
                id: ing.id || `ing-imp-${iIdx}`,
                name: sanitizeSafeJsonString(ing.name || 'Ingredient'),
                amountBase: Number(ing.amountBase) || 1,
                unit: sanitizeSafeJsonString(ing.unit || 'unit'),
                metricBase: Number(ing.metricBase) || 100,
                metricUnit: sanitizeSafeJsonString(ing.metricUnit || 'g'),
                category: ing.category || 'pantry_spices',
                note: sanitizeSafeJsonString(ing.note || ''),
              }))
              : [],
            steps: Array.isArray(r.steps)
              ? r.steps.map((st: any, sIdx: number) => ({
                step: sIdx + 1,
                title: sanitizeSafeJsonString(st.title || `Step ${sIdx + 1}`),
                time: sanitizeSafeJsonString(st.time || ''),
                desc: sanitizeSafeJsonString(st.desc || ''),
                timerSeconds: Number(st.timerSeconds) > 0 ? Number(st.timerSeconds) : undefined,
                chefTip: sanitizeSafeJsonString(st.chefTip || ''),
              }))
              : [],
            nutrition: {
              calories: Number(r.nutrition?.calories) || 450,
              proteinGrams: Number(r.nutrition?.proteinGrams) || 25,
              carbsGrams: Number(r.nutrition?.carbsGrams) || 35,
              fatGrams: Number(r.nutrition?.fatGrams) || 15,
              fiberGrams: Number(r.nutrition?.fiberGrams) || 4,
              sodiumMg: Number(r.nutrition?.sodiumMg) || 500,
            },
            isFeatured: Boolean(r.isFeatured),
          }));

        if (sanitizedRecipes.length > 0) {
          onUpdateRecipes(sanitizedRecipes);
          importedRecipesCount = sanitizedRecipes.length;
        }
      }

      if (Array.isArray(parsed.techniques)) {
        const sanitizedTechniques: PrepTechnique[] = parsed.techniques
          .filter((t: any) => t && typeof t === 'object' && typeof t.title === 'string' && t.title.trim())
          .map((t: any, idx: number) => ({
            id: typeof t.id === 'string' && t.id ? t.id : `imported-tech-${Date.now()}-${idx}`,
            title: sanitizeSafeJsonString(t.title),
            category: t.category || 'Knife Skills',
            difficulty: t.difficulty || 'Intermediate',
            timeNeeded: sanitizeSafeJsonString(t.timeNeeded || '10 mins'),
            summary: sanitizeSafeJsonString(t.summary || ''),
            iconName: t.iconName || 'Scissors',
            sciencePrinciple: sanitizeSafeJsonString(t.sciencePrinciple || ''),
            proTip: sanitizeSafeJsonString(t.proTip || ''),
            mistakesToAvoid: Array.isArray(t.mistakesToAvoid) ? t.mistakesToAvoid.map((m: any) => sanitizeSafeJsonString(String(m))).filter(Boolean) : [],
            equipment: Array.isArray(t.equipment) ? t.equipment.map((e: any) => sanitizeSafeJsonString(String(e))).filter(Boolean) : [],
            steps: Array.isArray(t.steps)
              ? t.steps.map((st: any, sIdx: number) => ({
                number: sIdx + 1,
                title: sanitizeSafeJsonString(st.title || `Step ${sIdx + 1}`),
                description: sanitizeSafeJsonString(st.description || ''),
              }))
              : [],
          }));

        if (sanitizedTechniques.length > 0) {
          onUpdateTechniques(sanitizedTechniques);
          importedTechniquesCount = sanitizedTechniques.length;
        }
      }

      if (importedRecipesCount === 0 && importedTechniquesCount === 0) {
        setJsonFeedback({
          type: 'error',
          message: 'No valid recipe or culinary technique objects were found in the JSON payload.',
        });
        return;
      }

      setJsonFeedback({
        type: 'success',
        message: `Successfully validated & imported ${importedRecipesCount} recipes and ${importedTechniquesCount} master techniques!`,
      });
      setJsonInput('');
    } catch (err: any) {
      setJsonFeedback({
        type: 'error',
        message: `JSON validation error: ${err.message || 'Invalid format'}`,
      });
    }
  };

  // Update Credentials Handler with Cryptographic SHA-256 Hashing
  const handleUpdateSecurityCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityFeedback(null);

    // Validate old password using hash
    try {
      const computedOldHash = await hashPassword(oldPasscode, adminPasscodeSalt);
      const isOldHashMatch = adminPasscodeHash && computedOldHash === adminPasscodeHash;
      const isLegacyMatch = legacyPasscode && oldPasscode === legacyPasscode;

      if (!isOldHashMatch && !isLegacyMatch) {
        setSecurityFeedback({ type: 'error', message: 'Current administrator password verification failed.' });
        return;
      }

      // Validate email format
      const trimmedEmail = newEmailInput.trim().toLowerCase();
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setSecurityFeedback({ type: 'error', message: 'Please provide a valid administrator email address format.' });
        return;
      }

      // Check if updating password
      if (newPasscode) {
        if (newPasscode.length < 6) {
          setSecurityFeedback({ type: 'error', message: 'New password must be at least 6 characters for security.' });
          return;
        }
        if (newPasscode !== confirmNewPasscode) {
          setSecurityFeedback({ type: 'error', message: 'New password confirmation does not match.' });
          return;
        }

        // Generate fresh cryptographic salt and hash
        const freshSalt = generateSalt();
        const freshHash = await hashPassword(newPasscode, freshSalt);
        onChangePasscode(freshHash, freshSalt);
      }

      if (trimmedEmail !== adminEmail.toLowerCase()) {
        onChangeAdminEmail(trimmedEmail);
      }

      setOldPasscode('');
      setNewPasscode('');
      setConfirmNewPasscode('');
      setSecurityFeedback({
        type: 'success',
        message: 'Administrator account security credentials updated and cryptographically hashed!',
      });
    } catch {
      setSecurityFeedback({
        type: 'error',
        message: 'An unexpected cryptographic error occurred during credential update.',
      });
    }
  };

  // Filtered recipes
  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.author.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(recipeSearch.toLowerCase()));
    const matchesCuisine = selectedCuisine === 'all' || r.cuisine === selectedCuisine;
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesFeatured = !filterFeaturedOnly || r.isFeatured;
    return matchesSearch && matchesCuisine && matchesCategory && matchesFeatured;
  });

  // Filtered techniques
  const filteredTechniques = techniques.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(techSearch.toLowerCase()) ||
      t.summary.toLowerCase().includes(techSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(techSearch.toLowerCase());
    const matchesCat = selectedTechCategory === 'all' || t.category === selectedTechCategory;
    return matchesSearch && matchesCat;
  });

  // Analytics aggregations
  const cuisineCounts: Record<string, number> = {};
  recipes.forEach((r) => {
    cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1;
  });

  const methodCounts: Record<string, number> = {};
  recipes.forEach((r) => {
    methodCounts[r.method] = (methodCounts[r.method] || 0) + 1;
  });

  const categoryCounts: Record<string, number> = {};
  recipes.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  const totalIngredientsCount = recipes.reduce((acc, r) => acc + (r.ingredients?.length || 0), 0);
  const featuredCount = recipes.filter((r) => r.isFeatured).length;

  return (<>
    <div id="admin-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#221c17] via-[#2d251f] to-[#1c1815] text-white p-6 sm:p-8 rounded-3xl border border-[#3e342c] shadow-lg mb-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[#c85a32] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Administrator Console
              </span>
              <span className="bg-white/10 text-[#e4dacd] text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/15">
                <UserCheck className="w-3 h-3 text-[#4ade80]" />
                <span>{adminEmail}</span>
              </span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Culinary Management & Administration
            </h1>
            <p className="text-xs sm:text-sm text-[#d4c6b8] max-w-2xl leading-relaxed">
              Welcome back, Administrator. Manage recipes, update masterclass techniques, curate featured dishes, and configure security.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCreatingRecipe(true)}
              className="px-4 py-2 rounded-xl bg-[#c85a32] hover:bg-[#b04a25] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Recipe</span>
            </button>

            <button
              onClick={() => setIsCreatingTechnique(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/15"
            >
              <Sparkles className="w-4 h-4" />
              <span>New Technique</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/15"
              title="Download Full Database Backup"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Backup</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-red-800/80"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-[#ebd8c8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8c7e71] mb-1">
            <span>Total Recipes</span>
            <ChefHat className="w-4 h-4 text-[#c85a32]" />
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1f1a16]">
            {recipes.length}
          </div>
          <div className="text-[11px] text-[#a09285] mt-0.5">In live registry</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#ebd8c8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8c7e71] mb-1">
            <span>Featured Dishes</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1f1a16]">
            {featuredCount}
          </div>
          <div className="text-[11px] text-[#a09285] mt-0.5">Top spotlight</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#ebd8c8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8c7e71] mb-1">
            <span>Master Techniques</span>
            <Sparkles className="w-4 h-4 text-[#c85a32]" />
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1f1a16]">
            {techniques.length}
          </div>
          <div className="text-[11px] text-[#a09285] mt-0.5">Science guides</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#ebd8c8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8c7e71] mb-1">
            <span>Total Ingredients</span>
            <Database className="w-4 h-4 text-[#c85a32]" />
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1f1a16]">
            {totalIngredientsCount}
          </div>
          <div className="text-[11px] text-[#a09285] mt-0.5">Tracked in database</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-[#ebd8c8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8c7e71] mb-1">
            <span>User Bookmarks</span>
            <Tag className="w-4 h-4 text-[#c85a32]" />
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1f1a16]">
            {bookmarksCount}
          </div>
          <div className="text-[11px] text-[#a09285] mt-0.5">Saved recipes</div>
        </div>
      </div>

      {/* Admin Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#e6dcce] pb-3 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setAdminTab('recipes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'recipes'
            ? 'bg-[#c85a32] text-white shadow-xs'
            : 'bg-white text-[#5f5347] border border-[#ded5c8] hover:bg-[#f5ede3]'
            }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Recipe Catalog ({recipes.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('techniques')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'techniques'
            ? 'bg-[#c85a32] text-white shadow-xs'
            : 'bg-white text-[#5f5347] border border-[#ded5c8] hover:bg-[#f5ede3]'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Master Techniques ({techniques.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'analytics'
            ? 'bg-[#c85a32] text-white shadow-xs'
            : 'bg-white text-[#5f5347] border border-[#ded5c8] hover:bg-[#f5ede3]'
            }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Taxonomy</span>
        </button>

        <button
          onClick={() => setAdminTab('backup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'backup'
            ? 'bg-[#c85a32] text-white shadow-xs'
            : 'bg-white text-[#5f5347] border border-[#ded5c8] hover:bg-[#f5ede3]'
            }`}
        >
          <Database className="w-4 h-4" />
          <span>JSON Sync & Backups</span>
        </button>

        <button
          onClick={() => setAdminTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'security'
            ? 'bg-[#c85a32] text-white shadow-xs'
            : 'bg-white text-[#5f5347] border border-[#ded5c8] hover:bg-[#f5ede3]'
            }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security & Credentials</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'users'
            ? 'bg-[#c85a32] text-white shadow-xs'
            : 'bg-white text-[#5f5347] border border-[#ded5c8] hover:bg-[#f5ede3]'
            }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>User Management</span>
        </button>

        <button
          onClick={() => setAdminTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'categories'
            ? 'bg-[#c85a32] text-white shadow-xs'
            : 'bg-white text-[#5f5347] border border-[#ded5c8] hover:bg-[#f5ede3]'
            }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories</span>
        </button>
      </div>

      {adminTab === 'users' && <UserManagement />}

      {adminTab === 'categories' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-white p-5 rounded-2xl border border-[#ebd8c8] shadow-xs">
            <h2 className="font-serif-display text-xl font-bold text-[#1f1a16]">Recipe categories</h2>
            <p className="text-xs text-[#7d7064] mt-1">Create and organize the categories used across your recipe catalog.</p>
            <div className="flex gap-2 mt-4">
              <input
                value={categoryInput}
                onChange={(event) => setCategoryInput(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Enter') handleAddCategory(); }}
                placeholder="New category name"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30"
              />
              <button onClick={handleAddCategory} className="px-4 py-2 rounded-xl bg-[#c85a32] text-white text-xs font-bold flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add category
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div key={category} className="bg-white p-4 rounded-2xl border border-[#ebd8c8] shadow-xs flex items-center justify-between gap-3">
                <div><div className="font-semibold text-sm text-[#1f1a16]">{category}</div><div className="text-[11px] text-[#827467]">{categoryCounts[category] || 0} recipes</div></div>
                <div className="flex gap-1">
                  <button onClick={() => handleRenameCategory(category)} className="p-1.5 rounded-lg text-[#c85a32] hover:bg-[#f8ede5]" title="Rename category"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteCategory(category)} className="p-1.5 rounded-lg text-[#a89c90] hover:text-red-700 hover:bg-red-50" title="Delete category"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: RECIPES MANAGEMENT */}
      {adminTab === 'recipes' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#ebd8c8] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#9c8e80] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                placeholder="Search by title, cuisine, author, tags..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#faf8f5] border border-[#ded5c8] rounded-xl text-[#2c2825] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
              >
                <option value="all">All Cuisines</option>
                {['Italian', 'French', 'Japanese', 'Thai', 'Spanish', 'Mediterranean', 'American'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-[#ded5c8] bg-[#faf8f5]"
              >
                <option value="all">All Categories</option>
                {categories.map(
                  (cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  )
                )}
              </select>

              <button
                onClick={() => setFilterFeaturedOnly(!filterFeaturedOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${filterFeaturedOnly
                  ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                  : 'bg-[#faf8f5] text-[#6d6053] border-[#ded5c8]'
                  }`}
              >
                <Star className={`w-3.5 h-3.5 ${filterFeaturedOnly ? 'fill-current' : ''}`} />
                <span>Featured Only</span>
              </button>
            </div>
          </div>

          {/* Recipes Table */}
          <div className="bg-white rounded-2xl border border-[#ebd8c8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf6f1] border-b border-[#ebd8c8] text-[#786b5e] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Recipe</th>
                    <th className="py-3 px-3">Cuisine / Category</th>
                    <th className="py-3 px-3">Timing & Servings</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2ebe1]">
                  {filteredRecipes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-xs text-[#8c7f73]">
                        No recipes matched your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRecipes.map((recipe) => (
                      <tr key={recipe.id} className="hover:bg-[#faf7f3] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={recipe.heroImage}
                              alt={recipe.title}
                              className="w-12 h-12 rounded-xl object-cover border border-[#e4dacd] shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-serif-display font-bold text-sm text-[#1f1a16]">
                                {recipe.title}
                              </div>
                              <div className="text-[11px] text-[#827467] line-clamp-1 max-w-xs">
                                By {recipe.author}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="inline-block bg-[#f3ece3] text-[#6d6052] font-semibold px-2 py-0.5 rounded text-[11px] mr-1.5">
                            {recipe.cuisine}
                          </span>
                          <span className="text-[#887a6e]">{recipe.category}</span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="text-[#3a3128] font-medium">
                            Prep: {recipe.prepTimeMins}m | Cook: {recipe.cookTimeMins}m
                          </div>
                          <div className="text-[11px] text-[#8c7f73]">
                            {recipe.servings} Servings • {recipe.nutrition?.calories || 400} kcal
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="inline-block bg-[#faefe5] text-[#9c3a17] text-[10px] font-bold px-2 py-0.5 rounded">
                            {recipe.method}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleFeatured(recipe.id)}
                            className={`p-1.5 rounded-lg transition-colors ${recipe.isFeatured
                              ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                              : 'text-[#beb4a8] hover:text-[#7d7063]'
                              }`}
                            title={recipe.isFeatured ? 'Featured (Click to unfeature)' : 'Mark as Featured'}
                          >
                            <Star className={`w-4 h-4 ${recipe.isFeatured ? 'fill-current' : ''}`} />
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onViewRecipe(recipe)}
                              className="p-1.5 rounded-lg text-[#6b5f54] hover:bg-[#ede5da]"
                              title="View in Customer View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDuplicateRecipe(recipe)}
                              className="p-1.5 rounded-lg text-[#6b5f54] hover:bg-[#ede5da]"
                              title="Duplicate Recipe"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setEditingRecipe(recipe)}
                              className="p-1.5 rounded-lg text-[#c85a32] hover:bg-[#f8ede5]"
                              title="Edit Recipe Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              className="p-1.5 rounded-lg text-[#a89c90] hover:text-red-700 hover:bg-red-50"
                              title="Delete Recipe"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECHNIQUES MANAGEMENT */}
      {adminTab === 'techniques' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search & Action */}
          <div className="bg-white p-4 rounded-2xl border border-[#ebd8c8] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#9c8e80] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                placeholder="Search culinary techniques, science..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#faf8f5] border border-[#ded5c8] rounded-xl text-[#2c2825] focus:outline-none"
              />
            </div>

            <button
              onClick={() => setIsCreatingTechnique(true)}
              className="px-4 py-2 rounded-xl bg-[#c85a32] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Master Technique</span>
            </button>
          </div>

          {/* Techniques Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTechniques.map((tech) => (
              <div
                key={tech.id}
                className="bg-white p-5 rounded-2xl border border-[#ebd8c8] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase bg-[#faefe5] text-[#9c3a17] px-2 py-0.5 rounded">
                        {tech.category}
                      </span>
                      <span className="text-[10px] text-[#7d7064] bg-[#f0e9df] px-1.5 py-0.5 rounded">
                        {tech.difficulty}
                      </span>
                      <span className="text-[10px] text-[#7d7064]">
                        {tech.timeNeeded}
                      </span>
                    </div>
                    <h3 className="font-serif-display font-bold text-base text-[#1f1a16]">
                      {tech.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingTechnique(tech)}
                      className="p-1.5 rounded-lg text-[#c85a32] hover:bg-[#f8ede5]"
                      title="Edit Technique"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTechnique(tech.id)}
                      className="p-1.5 rounded-lg text-[#a89c90] hover:text-red-700 hover:bg-red-50"
                      title="Delete Technique"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#5e5145] leading-relaxed line-clamp-2">
                  {tech.summary}
                </p>

                <div className="p-2.5 bg-[#faf5ef] rounded-xl border border-[#ede3d5] text-[11px] text-[#6d5b4b]">
                  <span className="font-bold text-[#8c3b1c]">Science Principle:</span> {tech.sciencePrinciple}
                </div>

                <div className="text-[11px] text-[#887a6d] flex items-center justify-between pt-1 border-t border-[#f2ece3]">
                  <span>{tech.steps?.length || 0} Execution Steps</span>
                  <span>{tech.equipment?.length || 0} Tools Needed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & TAXONOMY */}
      {adminTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cuisine Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-[#ebd8c8] shadow-xs space-y-3">
              <h3 className="font-serif-display font-bold text-base text-[#1f1a16] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#c85a32]" />
                Cuisine Distribution
              </h3>
              <div className="space-y-2">
                {Object.entries(cuisineCounts).map(([cuisine, count]) => {
                  const percentage = Math.round((count / recipes.length) * 100);
                  return (
                    <div key={cuisine} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#4e4237]">
                        <span>{cuisine}</span>
                        <span>
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#f0e9df] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#c85a32] h-full rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cooking Method Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-[#ebd8c8] shadow-xs space-y-3">
              <h3 className="font-serif-display font-bold text-base text-[#1f1a16] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#c85a32]" />
                Cooking Methods
              </h3>
              <div className="space-y-2">
                {Object.entries(methodCounts).map(([method, count]) => {
                  const percentage = Math.round((count / recipes.length) * 100);
                  return (
                    <div key={method} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#4e4237]">
                        <span>{method}</span>
                        <span>
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#f0e9df] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#9c3a17] h-full rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dish Category Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-[#ebd8c8] shadow-xs space-y-3">
              <h3 className="font-serif-display font-bold text-base text-[#1f1a16] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#c85a32]" />
                Dish Categories
              </h3>
              <div className="space-y-2">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const percentage = Math.round((count / recipes.length) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#4e4237]">
                        <span>{cat}</span>
                        <span>
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#f0e9df] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#d97746] h-full rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JSON BACKUP & RESTORATION */}
      {adminTab === 'backup' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Panel */}
            <div className="bg-white p-6 rounded-2xl border border-[#ebd8c8] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#faefe5] text-[#c85a32] flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-lg text-[#1f1a16]">
                    Download Backup (JSON)
                  </h3>
                  <p className="text-xs text-[#7d7064]">
                    Export all current recipes, masterclasses, and ingredients in full schema.
                  </p>
                </div>
              </div>

              <div className="bg-[#faf8f5] p-4 rounded-xl border border-[#ede3d5] text-xs text-[#5e5145] space-y-2">
                <div className="flex justify-between">
                  <span>Recipes to Export:</span>
                  <span className="font-bold text-[#1f1a16]">{recipes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Techniques to Export:</span>
                  <span className="font-bold text-[#1f1a16]">{techniques.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-mono font-bold text-[#c85a32]">Standard JSON</span>
                </div>
              </div>

              <button
                onClick={handleExportJSON}
                className="w-full py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b04a25] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Download .json Backup File</span>
              </button>
            </div>

            {/* Import Panel */}
            <div className="bg-white p-6 rounded-2xl border border-[#ebd8c8] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#faefe5] text-[#c85a32] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-lg text-[#1f1a16]">
                    Import JSON Catalog
                  </h3>
                  <p className="text-xs text-[#7d7064]">
                    Paste JSON content to append or replace recipes and guides.
                  </p>
                </div>
              </div>

              <textarea
                rows={4}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste JSON array of recipes or full backup object: { "recipes": [...] }'
                className="w-full text-xs font-mono p-3 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:outline-none"
              />

              {jsonFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${jsonFeedback.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                >
                  {jsonFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{jsonFeedback.message}</span>
                </div>
              )}

              <button
                onClick={handleImportJSON}
                className="w-full py-2.5 rounded-xl bg-[#2b2520] hover:bg-[#1f1a16] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <Upload className="w-4 h-4" />
                <span>Parse & Import Data</span>
              </button>
            </div>
          </div>

          {/* Reset Defaults Warning Box */}
          <div className="p-6 bg-red-50/70 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-red-900 mb-1">
                Factory Reset Recipes & Techniques
              </h4>
              <p className="text-xs text-red-700">
                Clear all custom entries and restore the default chef-curated recipes and techniques.
              </p>
            </div>

            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onResetAllData();
                    setShowResetConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Yes, Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-2 bg-white text-gray-700 text-xs font-semibold rounded-xl border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded-xl transition-colors"
              >
                Reset Database
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY & CREDENTIALS MANAGEMENT */}
      {adminTab === 'security' && (
        <div className="space-y-6 animate-fadeIn max-w-2xl">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ebd8c8] shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-[#f0e8dc] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#faefe5] text-[#c85a32] flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-display font-bold text-xl text-[#1f1a16]">
                  Administrator Security & Access Controls
                </h3>
                <p className="text-xs text-[#7d7064]">
                  Update your authorized admin email or password to keep your dashboard secure.
                </p>
              </div>
            </div>

            {/* Current status pill */}
            <div className="p-3.5 bg-[#faf6f0] rounded-xl border border-[#ebd8c8] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[#635547] font-medium">Currently Verified Admin:</span>
                <span className="font-bold text-[#1f1a16]">{adminEmail}</span>
              </div>
              <span className="text-[10px] font-bold uppercase bg-[#e9ddcf] text-[#594b3d] px-2 py-0.5 rounded">
                Super Admin
              </span>
            </div>

            <form onSubmit={handleUpdateSecurityCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Authorized Admin Email / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9c8e80] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    placeholder="e.g. walidyach788@gmail.com"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                  Current Password (Required for any changes) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#9c8e80] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={oldPasscode}
                    onChange={(e) => setOldPasscode(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                    New Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#796c5f] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPasscode}
                    onChange={(e) => setConfirmNewPasscode(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30"
                  />
                </div>
              </div>

              {securityFeedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${securityFeedback.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                >
                  {securityFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{securityFeedback.message}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b04a25] text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Save Security Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Recipe Modal */}
      {(editingRecipe || isCreatingRecipe) && (
        <AdminRecipeEditorModal
          initialRecipe={editingRecipe}
          categories={categories}
          onClose={() => {
            setEditingRecipe(null);
            setIsCreatingRecipe(false);
          }}
          onSave={handleSaveRecipe}
        />
      )}

      {/* Admin Technique Modal */}
      {(editingTechnique || isCreatingTechnique) && (
        <AdminTechniqueEditorModal
          initialTechnique={editingTechnique}
          onClose={() => {
            setEditingTechnique(null);
            setIsCreatingTechnique(false);
          }}
          onSave={handleSaveTechnique}
        />
      )}
    </div>
  </>
  );

};
