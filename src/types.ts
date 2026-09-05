export type Cuisine =
  | 'Italian'
  | 'French'
  | 'Japanese'
  | 'Thai'
  | 'Spanish'
  | 'Mediterranean'
  | 'Vietnamese'
  | 'American'
  | 'Mexican'
  | 'Indian';

export type Category = string;

export type Difficulty = 'Easy' | 'Intermediate' | 'Advanced';

export type CookingMethod =
  | 'Stovetop / Pan-Sear'
  | 'Oven / Roasting'
  | 'Air Fryer'
  | 'Slow Simmer'
  | 'Boiling / Pasta'
  | 'Baking'
  | 'No-Cook / Fresh';

export interface Ingredient {
  id: string;
  name: string;
  amountBase: number;
  unit: string;
  metricBase: number;
  metricUnit: string;
  category: 'produce' | 'meat_seafood' | 'dairy_eggs' | 'pantry_spices' | 'grains_pasta' | 'garnish';
  note?: string;
  optional?: boolean;
}

export interface Step {
  step: number;
  title: string;
  time: string;
  timerSeconds?: number;
  desc: string;
  secret?: string;
  proTip?: string;
  warning?: string;
  temp?: string;
  targetVisual?: string;
  requiredIngredientIds?: string[];
}

export interface NutritionInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
  sodiumMg?: number;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  cuisine: Cuisine;
  category: Category;
  difficulty: Difficulty;
  method: CookingMethod;
  prepTimeMins: number;
  cookTimeMins: number;
  totalTimeMins: number;
  servings: number;
  rating: number;
  reviewsCount: number;
  author: string;
  heroImage: string;
  galleryImages?: string[];
  description: string;
  dietary: Array<'Vegetarian' | 'Gluten-Free' | 'Dairy-Free' | 'Low-Carb' | 'High-Protein' | 'Pescatarian'>;
  tags: string[];
  equipmentNeeded: string[];
  ingredients: Ingredient[];
  steps: Step[];
  nutrition: NutritionInfo;
  chefNotes?: string;
  flavorProfile?: string[];
  winePairing?: string;
  isFeatured?: boolean;
}

export interface PrepTechnique {
  id: string;
  title: string;
  category: 'Knife Skills' | 'Heat & Searing' | 'Emulsions & Sauces' | 'Dough & Baking' | 'Flavor & Seasoning' | 'Air Fryer & Convection';
  difficulty: Difficulty;
  timeNeeded: string;
  summary: string;
  iconName: string;
  sciencePrinciple: string;
  mistakesToAvoid: string[];
  steps: {
    number: number;
    title: string;
    description: string;
  }[];
  equipment: string[];
  proTip: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  checked: boolean;
  recipeSource?: string;
}

export interface MealPlanDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfastRecipeId?: string;
  lunchRecipeId?: string;
  dinnerRecipeId?: string;
  snackRecipeId?: string;
}

export interface ActiveCookingTimer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  recipeTitle?: string;
  stepNumber?: number;
}
