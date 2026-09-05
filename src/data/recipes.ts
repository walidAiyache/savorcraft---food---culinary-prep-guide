import { Recipe } from '../types';
import heroArancini from '../assets/images/crispy_arancini_hero_1788277964701.jpg';
import basketArancini from '../assets/images/air_fryer_basket_arancini_1788277988058.jpg';

export const RECIPES: Recipe[] = [
  {
    id: 'air-fryer-arancini',
    slug: 'air-fryer-arancini',
    title: 'Air-Fryer Crispy Sicilian Arancini',
    subtitle: 'Golden saffron risotto balls stuffed with ragù and molten mozzarella cheese',
    cuisine: 'Italian',
    category: 'Appetizers',
    difficulty: 'Intermediate',
    method: 'Air Fryer',
    prepTimeMins: 20,
    cookTimeMins: 16,
    totalTimeMins: 36,
    servings: 12,
    rating: 4.95,
    reviewsCount: 142,
    author: 'Chef Matteo Rossi',
    heroImage: heroArancini,
    galleryImages: [heroArancini, basketArancini],
    description: 'Crispy on the outside with an audible crunch, filled with creamy saffron risotto and a gooey, molten mozzarella core with savory Bolognese ragù. Made in the air fryer for 80% less oil without sacrificing texture.',
    dietary: ['Vegetarian'],
    tags: ['Crispy', 'Air Fryer', 'Street Food', 'Italian Classics', 'Party Appetizer'],
    equipmentNeeded: ['Air Fryer (400°F capable)', '3 Shallow Dredging Bowls', 'Silicone Tongs', 'Oil Sprayer (EVOO)'],
    flavorProfile: ['Rich & Cheesy', 'Savory Herb', 'Golden Crunch', 'Delicate Saffron'],
    winePairing: 'Crisp Sicilian Grillo or Sparkling Prosecco Superiore',
    isFeatured: true,
    nutrition: {
      calories: 165,
      proteinGrams: 7,
      carbsGrams: 22,
      fatGrams: 5.5,
      fiberGrams: 1.2,
      sodiumMg: 280,
    },
    ingredients: [
      { id: 'ar-1', name: 'Arborio or Carnaroli rice (cooked & chilled saffron risotto)', amountBase: 3, unit: 'cups', metricBase: 500, metricUnit: 'g', category: 'grains_pasta', note: 'Must be thoroughly chilled in fridge' },
      { id: 'ar-2', name: 'Parmigiano Reggiano, freshly microplaned', amountBase: 0.75, unit: 'cup', metricBase: 75, metricUnit: 'g', category: 'dairy_eggs', note: 'Aged 24 months for intense umami' },
      { id: 'ar-3', name: 'Large egg (for risotto matrix)', amountBase: 1, unit: 'egg', metricBase: 1, metricUnit: 'egg', category: 'dairy_eggs', note: 'Lightly beaten' },
      { id: 'ar-4', name: 'Low-moisture mozzarella or bocconcini cubes', amountBase: 12, unit: 'cubes (0.5 inch)', metricBase: 150, metricUnit: 'g', category: 'dairy_eggs', note: 'Patted dry with towel' },
      { id: 'ar-5', name: 'Thick Bolognese ragù or Marinara sauce', amountBase: 6, unit: 'tbsp', metricBase: 90, metricUnit: 'g', category: 'pantry_spices', note: 'Chilled so it stays firm during rolling' },
      { id: 'ar-6', name: 'All-purpose flour (for first dredge)', amountBase: 0.5, unit: 'cup', metricBase: 65, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'ar-7', name: 'Large eggs (for egg wash)', amountBase: 2, unit: 'eggs', metricBase: 2, metricUnit: 'eggs', category: 'dairy_eggs', note: 'Whisked with 1 tbsp water' },
      { id: 'ar-8', name: 'Coarse Japanese Panko breadcrumbs', amountBase: 1.5, unit: 'cups', metricBase: 120, metricUnit: 'g', category: 'pantry_spices', note: 'Creates thousands of micro-ridges for maximum crunch' },
      { id: 'ar-9', name: 'Extra virgin olive oil spray', amountBase: 2, unit: 'tbsp', metricBase: 30, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'ar-10', name: 'Warm San Marzano tomato marinara (for dipping)', amountBase: 1, unit: 'cup', metricBase: 240, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'ar-11', name: 'Fresh basil leaves & flaky sea salt', amountBase: 1, unit: 'handful', metricBase: 10, metricUnit: 'g', category: 'garnish' }
    ],
    steps: [
      {
        step: 1,
        title: 'Bind the Cold Risotto Matrix',
        time: '5 mins',
        desc: 'Take your chilled saffron risotto straight from the refrigerator. Fold in the grated Parmigiano Reggiano, 1 beaten egg, and fresh black pepper until homogenous and sticky.',
        secret: 'Cold rice starch holds shape effortlessly and locks in the melting cheese core during rapid convection frying.',
        targetVisual: 'Sticky, cohesive golden rice mixture that clumps in your hand without running.'
      },
      {
        step: 2,
        title: 'Shape, Stuff & Seal the Spheres',
        time: '10 mins',
        desc: 'Lightly wet your palms with cold water. Scoop 1/4 cup (~50g) of chilled rice, flatten into a disc on your palm, and place 1 cube of mozzarella and 1/2 tsp of thick ragù in the center. Carefully fold the rice up around the filling and roll into a tight, crack-free sphere.',
        secret: 'Ensure there are no exposed cheese cracks, or the mozzarella will burst out in the air fryer.',
        targetVisual: 'Smooth, seamless round spheres ready for dredging.'
      },
      {
        step: 3,
        title: 'The Triple-Dredge Coating',
        time: '6 mins',
        desc: 'Set up 3 shallow bowls: Flour, beaten Egg Wash, and seasoned Panko crumbs. Roll each arancino in flour (shake off excess), coat fully in egg wash, and dredge heavily in panko, pressing gently to adhere.',
        proTip: 'Use one hand for dry ingredients and the other for wet to keep your fingers clean.',
        targetVisual: 'Uniformly textured panko shell covering all surfaces.'
      },
      {
        step: 4,
        title: 'Generous EVOO Mist & Basket Spacing',
        time: '3 mins',
        desc: 'Preheat your air fryer to 400°F (200°C). Generously spray every surface of each breaded ball with extra virgin olive oil mist until no white dry spots remain. Place in the basket with at least 0.75-inch space between each.',
        temp: '400°F (200°C)',
        secret: 'Oil mist enables convective thermal conduction into the panko for a true golden crust.'
      },
      {
        step: 5,
        title: 'Convection Air Fry: Phase 1 & Mid-Flip',
        time: '14 mins',
        timerSeconds: 8 * 60,
        desc: 'Air fry at 400°F (200°C) for 8 minutes. Gently shake or rotate the balls with silicone tongs, apply another light spritz of olive oil, and air fry for 6 more minutes until deep amber-golden and audibly crisp.',
        temp: '400°F (200°C)',
        targetVisual: 'Deep golden-brown blistered shell that crackles when tapped.'
      },
      {
        step: 6,
        title: 'Rest & Serve with Warm Marinara',
        time: '3 mins',
        timerSeconds: 3 * 60,
        desc: 'Transfer arancini to a platter and rest 3 minutes so the interior molten mozzarella stabilizes. Garnish with microplaned Parmesan, chopped basil, and flaky sea salt. Serve with warm marinara dipping sauce.',
        secret: 'Resting allows the molten cheese core to reach optimal stringy texture without scalding.'
      }
    ],
    chefNotes: 'Leftover plain saffron risotto or mushroom risotto works just as well. You can freeze the breaded uncooked balls for up to 3 months and air fry directly from frozen at 375°F for 18 minutes.'
  },
  {
    id: 'cast-iron-ribeye-steak',
    slug: 'cast-iron-ribeye-steak',
    title: 'Cast-Iron Butter-Basted Prime Ribeye',
    subtitle: 'Caramelized crust with garlic, fresh rosemary, thyme, and French butter pan-basting',
    cuisine: 'French',
    category: 'Mains',
    difficulty: 'Intermediate',
    method: 'Stovetop / Pan-Sear',
    prepTimeMins: 15,
    cookTimeMins: 10,
    totalTimeMins: 25,
    servings: 2,
    rating: 4.98,
    reviewsCount: 219,
    author: 'Chef Antoine Laurent',
    heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    description: 'The definitive steakhouse technique: a screaming hot cast-iron skillet yields an intense Maillard crust, while continuous butter-basting (arroser) with aromatic garlic, thyme, and rosemary bathes the steak in decadent flavor.',
    dietary: ['Gluten-Free', 'Low-Carb', 'High-Protein'],
    tags: ['Steak', 'Cast Iron', 'Pan Basting', 'High Protein', 'Keto Friendly', 'Dinner Party'],
    equipmentNeeded: ['10 or 12-inch Heavy Cast-Iron Skillet', 'Instant-Read Digital Meat Thermometer', 'Large Metal Basting Spoon', 'Heavy-Duty Locking Tongs'],
    flavorProfile: ['Deep Umami', 'Browned Butter (Noisette)', 'Woody Herbs', 'Garlic Confit'],
    winePairing: 'Full-bodied Cabernet Sauvignon, Bordeaux, or Northern Rhône Syrah',
    isFeatured: true,
    nutrition: {
      calories: 680,
      proteinGrams: 58,
      carbsGrams: 1,
      fatGrams: 50,
      sodiumMg: 620,
    },
    ingredients: [
      { id: 'st-1', name: 'Prime Bone-In or Boneless Ribeye (1.5-inch thick)', amountBase: 1.5, unit: 'lbs', metricBase: 680, metricUnit: 'g', category: 'meat_seafood', note: 'Brought to room temperature 45 mins prior' },
      { id: 'st-2', name: 'Coarse Kosher salt or flaky sea salt', amountBase: 1.5, unit: 'tsp', metricBase: 8, metricUnit: 'g', category: 'pantry_spices', note: 'Season liberally on all sides including edges' },
      { id: 'st-3', name: 'Freshly cracked coarse black pepper', amountBase: 1, unit: 'tsp', metricBase: 4, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'st-4', name: 'High smoke-point neutral oil (avocado or grapeseed)', amountBase: 1.5, unit: 'tbsp', metricBase: 22, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'st-5', name: 'High-fat European unsalted butter', amountBase: 4, unit: 'tbsp', metricBase: 60, metricUnit: 'g', category: 'dairy_eggs', note: 'Cold cubes ready to drop in' },
      { id: 'st-6', name: 'Fresh garlic cloves, smashed with skin on', amountBase: 4, unit: 'cloves', metricBase: 4, metricUnit: 'cloves', category: 'produce' },
      { id: 'st-7', name: 'Fresh sprigs of rosemary & thyme', amountBase: 4, unit: 'sprigs', metricBase: 10, metricUnit: 'g', category: 'produce' }
    ],
    steps: [
      {
        step: 1,
        title: 'Dry-Brining & Room Temperature Rest',
        time: '45 mins (passive)',
        desc: 'Pat the ribeye completely dry with paper towels on all sides. Season aggressively with coarse kosher salt and black pepper. Let sit at room temperature for 30–45 minutes to draw surface moisture out and dissolve.',
        secret: 'A dry surface is mandatory for immediate caramelization; water on meat creates steam instead of a crust.',
        targetVisual: 'Matte, dry meat surface with glistening dissolved salt crystals.'
      },
      {
        step: 2,
        title: 'Preheat Cast-Iron to Smoking Point',
        time: '5 mins',
        desc: 'Place the heavy cast-iron skillet over high heat for 5 minutes until wisps of white smoke begin to rise. Add the high smoke-point avocado oil and swirl to coat.',
        temp: '500°F (Skillet surface)',
        warning: 'Do not use olive oil or butter here yet—their low smoke point will burn and turn bitter.'
      },
      {
        step: 3,
        title: 'Initial Sear & Fat Cap Rendering',
        time: '4 mins',
        timerSeconds: 4 * 60,
        desc: 'Lay the steak away from you into the hot pan. Press gently for full surface contact. Sear undisturbed for 2 minutes, then flip for 2 minutes. Use tongs to hold the steak vertically on its fat edge to render the fat cap until golden.',
        targetVisual: 'Dark mahogany, deeply browned crust with blistered sear marks.'
      },
      {
        step: 4,
        title: 'The French Butter Basting (Arroser)',
        time: '3 mins',
        timerSeconds: 3 * 60,
        desc: 'Reduce heat to medium. Drop in cold butter cubes, smashed garlic, and herb sprigs. As the butter foams and browns into a nutty beurre noisette, tilt the skillet toward you and use a large spoon to rapidly and continuously bathe the top of the steak in hot foaming butter.',
        secret: 'Basting cooks the steak evenly from the top down with herb-infused aromatic heat.',
        targetVisual: 'Frothy, hazelnut-colored butter bubbling vigorously around the herbs and garlic.'
      },
      {
        step: 5,
        title: 'Target Internal Temp & Resting',
        time: '8 mins',
        timerSeconds: 8 * 60,
        desc: 'Check internal temperature with a digital thermometer: 125°F (52°C) for Medium-Rare or 135°F (57°C) for Medium. Remove to a warm cutting board immediately and rest for 8 full minutes before carving against the grain.',
        temp: '125°F–130°F internal',
        secret: 'Resting allows muscle fibers to relax and reabsorb hot juices; cutting immediately loses 70% of moisture.'
      }
    ],
    chefNotes: 'Always slice perpendicular to the muscle fibers (against the grain) for maximum tenderness. Drizzle the leftover pan juices over the carved slices.'
  },
  {
    id: 'creamy-tuscan-salmon',
    slug: 'creamy-tuscan-salmon',
    title: 'Pan-Seared Creamy Tuscan Garlic Salmon',
    subtitle: 'Crispy skin salmon fillets nestled in a silky sun-dried tomato, spinach, and Parmesan cream sauce',
    cuisine: 'Italian',
    category: 'Mains',
    difficulty: 'Easy',
    method: 'Stovetop / Pan-Sear',
    prepTimeMins: 10,
    cookTimeMins: 18,
    totalTimeMins: 28,
    servings: 4,
    rating: 4.92,
    reviewsCount: 187,
    author: 'Chef Elena Moretti',
    heroImage: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    description: 'A 25-minute restaurant-quality dinner: fresh Atlantic salmon fillets seared to crispy-skin perfection, bathed in a velvety sauce of garlic, sweet sun-dried tomatoes, tender baby spinach, and aged Parmesan cheese.',
    dietary: ['Gluten-Free', 'Low-Carb', 'High-Protein', 'Pescatarian'],
    tags: ['Salmon', 'Seafood', 'Quick Dinner', 'Keto', 'Cream Sauce', 'One Pan'],
    equipmentNeeded: ['Stainless Steel or Non-Stick Skillet', 'Fish Spatula', 'Paper Towels'],
    flavorProfile: ['Garlic Cream', 'Tangy Sun-Dried Tomato', 'Earthy Spinach', 'Savory Salmon'],
    winePairing: 'Chardonnay (lightly oaked), Pinot Grigio, or Vermentino',
    isFeatured: true,
    nutrition: {
      calories: 520,
      proteinGrams: 42,
      carbsGrams: 7,
      fatGrams: 36,
      fiberGrams: 2,
      sodiumMg: 490,
    },
    ingredients: [
      { id: 'sal-1', name: 'Fresh skin-on Atlantic salmon fillets (6 oz each)', amountBase: 4, unit: 'fillets', metricBase: 680, metricUnit: 'g', category: 'meat_seafood', note: 'Scaled and pin bones removed' },
      { id: 'sal-2', name: 'Extra virgin olive oil', amountBase: 1.5, unit: 'tbsp', metricBase: 22, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'sal-3', name: 'Unsalted butter', amountBase: 2, unit: 'tbsp', metricBase: 30, metricUnit: 'g', category: 'dairy_eggs' },
      { id: 'sal-4', name: 'Garlic cloves, finely minced', amountBase: 5, unit: 'cloves', metricBase: 20, metricUnit: 'g', category: 'produce' },
      { id: 'sal-5', name: 'Sun-dried tomatoes in oil, drained & sliced', amountBase: 0.5, unit: 'cup', metricBase: 80, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'sal-6', name: 'Heavy whipping cream', amountBase: 1, unit: 'cup', metricBase: 240, metricUnit: 'ml', category: 'dairy_eggs' },
      { id: 'sal-7', name: 'Low-sodium vegetable or chicken broth', amountBase: 0.33, unit: 'cup', metricBase: 80, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'sal-8', name: 'Fresh baby spinach leaves', amountBase: 3, unit: 'cups (packed)', metricBase: 100, metricUnit: 'g', category: 'produce' },
      { id: 'sal-9', name: 'Freshly grated Parmigiano Reggiano', amountBase: 0.5, unit: 'cup', metricBase: 50, metricUnit: 'g', category: 'dairy_eggs' },
      { id: 'sal-10', name: 'Fresh lemon juice & chopped flat-leaf parsley', amountBase: 1, unit: 'tbsp', metricBase: 15, metricUnit: 'ml', category: 'garnish' }
    ],
    steps: [
      {
        step: 1,
        title: 'Prep & Dry Salmon Skin',
        time: '5 mins',
        desc: 'Thoroughly pat salmon fillets dry on all sides using paper towels. Season both sides with kosher salt, black pepper, and garlic powder.',
        secret: 'Dry skin prevents sticking and yields an ultra-crispy, crackling texture in the pan.'
      },
      {
        step: 2,
        title: 'Crispy Skin Pan-Sear',
        time: '7 mins',
        timerSeconds: 7 * 60,
        desc: 'Heat olive oil in a skillet over medium-high heat until shimmering. Place salmon skin-side down, pressing gently with a fish spatula for 15 seconds to prevent curling. Sear 4–5 minutes until skin is golden-crisp, flip and cook 2 minutes more. Remove salmon to a plate.',
        temp: 'Medium-High',
        targetVisual: 'Golden crisp skin that releases cleanly from the skillet.'
      },
      {
        step: 3,
        title: 'Build the Aromatic Garlic & Tomato Base',
        time: '3 mins',
        desc: 'Lower heat to medium. Melt butter in the same pan. Add minced garlic and sliced sun-dried tomatoes; sauté for 1 minute until fragrant. Deglaze with broth, scraping up any delicious browned fond from the bottom.',
        targetVisual: 'Glossy red-tinged garlic butter bubbling gently.'
      },
      {
        step: 4,
        title: 'Simmer Cream, Spinach & Melt Parmesan',
        time: '4 mins',
        timerSeconds: 4 * 60,
        desc: 'Pour in the heavy cream and bring to a gentle simmer for 2 minutes. Stir in grated Parmesan until smooth and emulsified. Add baby spinach and cook until wilted (about 1 minute). Season with a pinch of salt, pepper, and lemon juice.',
        targetVisual: 'Velvety, creamy sauce clinging smoothly to the back of a wooden spoon.'
      },
      {
        step: 5,
        title: 'Reunite & Spoon Sauce',
        time: '2 mins',
        desc: 'Nestle the cooked salmon fillets back into the bubbling sauce (keep the crispy skin above the sauce to maintain crunch). Spoon sauce over the edges, sprinkle with fresh parsley, and serve immediately.',
        proTip: 'Serve with crusty rustic bread, buttered fettuccine, or garlic roasted asparagus.'
      }
    ],
    chefNotes: 'Do not boil the cream aggressively after adding cheese—keep heat at low-medium to avoid curdling or oil separation.'
  },
  {
    id: 'classic-spaghetti-carbonara',
    slug: 'classic-spaghetti-carbonara',
    title: 'Authentic Roman Spaghetti alla Carbonara',
    subtitle: 'The pure 5-ingredient classic: crispy guanciale, Pecorino Romano, fresh egg yolks, and coarse black pepper',
    cuisine: 'Italian',
    category: 'Pasta & Noodles',
    difficulty: 'Intermediate',
    method: 'Boiling / Pasta',
    prepTimeMins: 10,
    cookTimeMins: 15,
    totalTimeMins: 25,
    servings: 4,
    rating: 4.96,
    reviewsCount: 310,
    author: 'Chef Giancarlo Vanni',
    heroImage: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=1200&q=80',
    description: 'No cream, no peas, no garlic—just culinary perfection. The authentic Roman Carbonara relies on pasta water starch and egg yolk emulsion to create an impossibly creamy, glossy sauce with crispy cured guanciale.',
    dietary: ['High-Protein'],
    tags: ['Pasta', 'Roman Classics', 'Under 30 Mins', 'Authentic Italian', 'Guanciale'],
    equipmentNeeded: ['Large Pasta Stockpot', 'Tongs', 'Medium Glass or Stainless Bowl (for egg cream)', 'Wide Skillet'],
    flavorProfile: ['Sharp Pecorino', 'Cured Pork Crisp', 'Silky Yolk', 'Pungent Toasted Black Pepper'],
    winePairing: 'Frascati Superiore or a light Italian Chianti',
    isFeatured: true,
    nutrition: {
      calories: 620,
      proteinGrams: 28,
      carbsGrams: 64,
      fatGrams: 28,
      sodiumMg: 740,
    },
    ingredients: [
      { id: 'cb-1', name: 'Artisanal bronze-cut Spaghetti or Rigatoni', amountBase: 1, unit: 'lb', metricBase: 450, metricUnit: 'g', category: 'grains_pasta', note: 'Bronze-die cut leaves rough starch on surface' },
      { id: 'cb-2', name: 'Cured Italian Guanciale (pork jowl) or thick Pancetta', amountBase: 7, unit: 'oz (sliced into 1/4" lardons)', metricBase: 200, metricUnit: 'g', category: 'meat_seafood', note: 'Guanciale is traditional for authentic flavor' },
      { id: 'cb-3', name: 'Fresh large egg yolks + 1 whole egg', amountBase: 4, unit: 'yolks + 1 egg', metricBase: 5, metricUnit: 'eggs', category: 'dairy_eggs', note: 'At room temperature' },
      { id: 'cb-4', name: 'Pecorino Romano DOP, finely grated', amountBase: 1.25, unit: 'cups', metricBase: 120, metricUnit: 'g', category: 'dairy_eggs', note: 'Sharp, sheep milk cheese' },
      { id: 'cb-5', name: 'Whole black peppercorns, coarsely crushed in mortar', amountBase: 1.5, unit: 'tsp', metricBase: 6, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'cb-6', name: 'Starchy pasta cooking water', amountBase: 0.75, unit: 'cup', metricBase: 180, metricUnit: 'ml', category: 'pantry_spices', note: 'Reserved directly before draining' }
    ],
    steps: [
      {
        step: 1,
        title: 'Render the Guanciale to Golden Crisp',
        time: '8 mins',
        timerSeconds: 8 * 60,
        desc: 'Place sliced guanciale lardons in a cold skillet. Turn heat to medium-low. Slowly render the fat until the exterior is shatteringly crisp and the interior remains tender. Remove lardons and keep the warm rendered fat in the pan.',
        secret: 'Starting from a cold pan renders the fat slowly without burning the delicate cured pork.',
        targetVisual: 'Golden caramelized lardons with clear, rendered liquid fat.'
      },
      {
        step: 2,
        title: 'Whisk the Pecorino & Egg Paste (Carbocream)',
        time: '3 mins',
        desc: 'In a bowl, whisk 4 egg yolks, 1 whole egg, grated Pecorino Romano, and half of the crushed black pepper until it forms a thick, dense paste.',
        secret: 'The dense cheese-egg paste ensures smooth tempering without scrambling.'
      },
      {
        step: 3,
        title: 'Cook Pasta Al Dente in Lightly Salted Water',
        time: '9 mins',
        timerSeconds: 9 * 60,
        desc: 'Boil spaghetti in boiling water for 1-2 minutes LESS than package instructions (al dente). Crucial: use less salt in water than usual because Pecorino and guanciale are naturally salty.',
        targetVisual: 'Firm to the tooth pasta with a tiny white core.'
      },
      {
        step: 4,
        title: 'Toss Pasta in Rendered Fat & Toast Pepper',
        time: '2 mins',
        desc: 'Transfer steaming spaghetti directly with tongs into the skillet containing warm rendered pork fat. Add remaining crushed pepper and 1/3 cup hot starchy pasta water. Toss vigorously for 1 minute so the starch binds with pork oil.',
        targetVisual: 'Glistening pasta noodles coated in a thin starchy glaze.'
      },
      {
        step: 5,
        title: 'The Off-Heat Emulsion Magic',
        time: '2 mins',
        desc: 'CRUCIAL: REMOVE PAN COMPLETELY FROM HEAT (or transfer to a warm serving bowl). Let pan cool for 20 seconds. Pour the egg-cheese paste over the pasta while tossing and swirling continuously with tongs. Splash in 2-3 tbsp hot pasta water until a silky, creamy glaze coats every single strand.',
        warning: 'NEVER add eggs over active burner flame or you will make scrambled eggs instead of carbonara cream!',
        targetVisual: 'Glossy, velvety yellow carbonara sauce wrapping each strand of pasta.'
      },
      {
        step: 6,
        title: 'Garnish & Serve Immediately',
        time: '1 min',
        desc: 'Fold in 80% of the crispy guanciale. Plate into warm pasta bowls, topping with the remaining crunchy lardons, an extra dusting of Pecorino Romano, and freshly cracked black pepper.',
        proTip: 'Serve immediately—Carbonara waits for no one!'
      }
    ],
    chefNotes: 'If the sauce looks too thick, add a tablespoon of pasta water; if too thin, let it sit for 30 seconds as residual heat thickens the yolk emulsion.'
  },
  {
    id: 'thai-green-coconut-curry',
    slug: 'thai-green-coconut-curry',
    title: 'Authentic Thai Green Coconut Chicken Curry',
    subtitle: 'Fragrant lemongrass, kaffir lime, Thai basil, and tender chicken in rich coconut milk',
    cuisine: 'Thai',
    category: 'Mains',
    difficulty: 'Intermediate',
    method: 'Stovetop / Pan-Sear',
    prepTimeMins: 15,
    cookTimeMins: 20,
    totalTimeMins: 35,
    servings: 4,
    rating: 4.94,
    reviewsCount: 164,
    author: 'Chef Somchai Prasert',
    heroImage: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80',
    description: 'A masterclass in Southeast Asian balance: spicy, sweet, salty, and citrusy. Authentic Thai green curry starts by cracking coconut cream to fry the aromatics, creating incredible herbal depth and silky texture.',
    dietary: ['Gluten-Free', 'Dairy-Free', 'High-Protein'],
    tags: ['Thai', 'Coconut Curry', 'Spicy', 'Gluten Free', 'One Pot', 'Weeknight Luxury'],
    equipmentNeeded: ['Heavy Wok or Dutch Oven', 'Mortar and Pestle (optional)'],
    flavorProfile: ['Citrus Lemongrass', 'Spicy Green Chili', 'Sweet Coconut', 'Aromatic Thai Basil'],
    winePairing: 'Off-dry Riesling, Gewürztraminer, or cold Singha beer',
    isFeatured: false,
    nutrition: {
      calories: 480,
      proteinGrams: 34,
      carbsGrams: 12,
      fatGrams: 32,
      fiberGrams: 3,
      sodiumMg: 820,
    },
    ingredients: [
      { id: 'th-1', name: 'Boneless chicken thighs, cut into bite-sized pieces', amountBase: 1.25, unit: 'lbs', metricBase: 550, metricUnit: 'g', category: 'meat_seafood' },
      { id: 'th-2', name: 'Full-fat coconut milk (unsweetened, 2 cans)', amountBase: 2, unit: 'cans (14 oz)', metricBase: 800, metricUnit: 'ml', category: 'pantry_spices', note: 'Do not shake—skim the thick cream off top' },
      { id: 'th-3', name: 'Authentic Thai green curry paste', amountBase: 3.5, unit: 'tbsp', metricBase: 60, metricUnit: 'g', category: 'pantry_spices', note: 'Mae Ploy or Maesri brand recommended' },
      { id: 'th-4', name: 'Thai eggplants (quartered) or baby bamboo shoots', amountBase: 1.5, unit: 'cups', metricBase: 180, metricUnit: 'g', category: 'produce' },
      { id: 'th-5', name: 'Kaffir lime leaves, bruised and torn', amountBase: 6, unit: 'leaves', metricBase: 6, metricUnit: 'leaves', category: 'produce' },
      { id: 'th-6', name: 'Premium fish sauce (Nam Pla)', amountBase: 2, unit: 'tbsp', metricBase: 30, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'th-7', name: 'Palm sugar or brown sugar', amountBase: 1.5, unit: 'tbsp', metricBase: 20, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'th-8', name: 'Fresh Thai bird eye chilies, sliced', amountBase: 2, unit: 'chilies', metricBase: 10, metricUnit: 'g', category: 'produce', optional: true },
      { id: 'th-9', name: 'Fresh Thai sweet basil leaves (Horapha)', amountBase: 1.5, unit: 'cups (packed)', metricBase: 40, metricUnit: 'g', category: 'produce' },
      { id: 'th-10', name: 'Steamed Jasmine rice (for serving)', amountBase: 4, unit: 'bowls', metricBase: 400, metricUnit: 'g', category: 'grains_pasta' }
    ],
    steps: [
      {
        step: 1,
        title: 'Crack the Coconut Cream (Phad Kati)',
        time: '5 mins',
        desc: 'Spoon the top 1/2 cup of thick coconut cream into a hot wok over medium-high heat. Simmer for 3–4 minutes until the water evaporates and the clear coconut oil separates ("cracks") from the solids.',
        secret: 'Frying curry paste directly in cracked coconut oil releases oil-soluble essential oils from the spices for deep flavor.'
      },
      {
        step: 2,
        title: 'Fry the Green Curry Paste',
        time: '3 mins',
        desc: 'Add the green curry paste into the cracked coconut oil. Sauté vigorously for 2–3 minutes until intensely fragrant and small green oil beads surface.',
        targetVisual: 'Bright emerald aromatic oil glistening in the wok.'
      },
      {
        step: 3,
        title: 'Sear Chicken & Infuse Spices',
        time: '4 mins',
        desc: 'Add the chicken thigh pieces and toss until coated in the green curry oil and seared on all sides (about 3 minutes).',
        targetVisual: 'Chicken pieces lightly seared with green spice coating.'
      },
      {
        step: 4,
        title: 'Add Remaining Coconut Milk, Broth & Simmer',
        time: '8 mins',
        timerSeconds: 8 * 60,
        desc: 'Pour in the remaining coconut milk, 1/2 cup water, bruised kaffir lime leaves, and Thai eggplants. Bring to a gentle simmer for 7–8 minutes until chicken is cooked through and eggplant is tender.',
        temp: 'Medium Simmer'
      },
      {
        step: 5,
        title: 'Season with Fish Sauce, Palm Sugar & Fresh Basil',
        time: '2 mins',
        desc: 'Season with fish sauce and palm sugar. Taste: it should be balanced with savory richness, mild herbal sweetness, and chili heat. Turn off the heat and stir in the Thai sweet basil leaves until just wilted.',
        proTip: 'Always add Thai basil at the very end with heat turned off to preserve its anise aroma.'
      }
    ],
    chefNotes: 'Chicken thighs are far juicier and more flavorful in curries than chicken breasts. You can also substitute firm tofu or jumbo prawns.'
  },
  {
    id: 'french-beef-bourguignon',
    slug: 'french-beef-bourguignon',
    title: 'Classic French Beef Bourguignon',
    subtitle: 'Melt-in-your-mouth beef chuck braised in Pinot Noir wine with smoked bacon, pearl onions, and mushrooms',
    cuisine: 'French',
    category: 'Soups & Stews',
    difficulty: 'Advanced',
    method: 'Slow Simmer',
    prepTimeMins: 30,
    cookTimeMins: 150,
    totalTimeMins: 180,
    servings: 6,
    rating: 4.97,
    reviewsCount: 198,
    author: 'Chef Pierre Dubois',
    heroImage: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=1200&q=80',
    description: 'The crowning jewel of traditional French country cuisine. Tender cubes of marbled beef chuck are seared in lardons of smoked bacon, then slow-braised for hours in rich dry Burgundy wine and aromatics until gelatinous and fork-tender.',
    dietary: ['High-Protein', 'Dairy-Free'],
    tags: ['French', 'Beef Stew', 'Slow Braise', 'Comfort Food', 'Winter Warmer', 'Dinner Party'],
    equipmentNeeded: ['Heavy Enamel Dutch Oven (6-qt)', 'Slotted Spoon', 'Fine Mesh Sieve'],
    flavorProfile: ['Deep Red Wine Reduction', 'Smoky Bacon', 'Caramelized Onion', 'Earthy Thyme'],
    winePairing: 'French Burgundy (Pinot Noir) or Côte de Beaune',
    isFeatured: false,
    nutrition: {
      calories: 590,
      proteinGrams: 52,
      carbsGrams: 14,
      fatGrams: 32,
      fiberGrams: 3,
      sodiumMg: 710,
    },
    ingredients: [
      { id: 'bb-1', name: 'Boneless Beef Chuck Roast, cut into 2-inch cubes', amountBase: 3, unit: 'lbs', metricBase: 1400, metricUnit: 'g', category: 'meat_seafood', note: 'Well-marbled for tender collagen breakdown' },
      { id: 'bb-2', name: 'Thick smoked bacon or lardons, diced', amountBase: 6, unit: 'oz', metricBase: 170, metricUnit: 'g', category: 'meat_seafood' },
      { id: 'bb-3', name: 'Dry Burgundy French Red Wine (Pinot Noir)', amountBase: 1, unit: 'bottle (750ml)', metricBase: 750, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'bb-4', name: 'Rich beef bone stock or broth', amountBase: 2, unit: 'cups', metricBase: 480, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'bb-5', name: 'Tomato paste', amountBase: 2, unit: 'tbsp', metricBase: 35, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'bb-6', name: 'Garlic cloves, crushed', amountBase: 4, unit: 'cloves', metricBase: 16, metricUnit: 'g', category: 'produce' },
      { id: 'bb-7', name: 'Fresh carrots, cut into 1-inch diagonal chunks', amountBase: 3, unit: 'large carrots', metricBase: 300, metricUnit: 'g', category: 'produce' },
      { id: 'bb-8', name: 'Yellow onion, sliced', amountBase: 1, unit: 'medium onion', metricBase: 150, metricUnit: 'g', category: 'produce' },
      { id: 'bb-9', name: 'Fresh bouquet garni (thyme, rosemary, bay leaf, parsley)', amountBase: 1, unit: 'bundle', metricBase: 15, metricUnit: 'g', category: 'produce' },
      { id: 'bb-10', name: 'Small pearl onions, peeled', amountBase: 1, unit: 'cup', metricBase: 150, metricUnit: 'g', category: 'produce' },
      { id: 'bb-11', name: 'Cremini or button mushrooms, quartered & sautéed in butter', amountBase: 10, unit: 'oz', metricBase: 280, metricUnit: 'g', category: 'produce' }
    ],
    steps: [
      {
        step: 1,
        title: 'Crisp Bacon & Brown the Beef Cubes',
        time: '15 mins',
        desc: 'In a heavy Dutch oven, crisp diced bacon over medium heat. Remove bacon with a slotted spoon. Pat beef cubes bone-dry and season with salt and pepper. Brown beef in small batches in bacon fat over high heat until dark mahogany crust forms on all sides.',
        secret: 'Never crowd the pan—browning creates fond on the pot bottom which forms the soul of the sauce.'
      },
      {
        step: 2,
        title: 'Sauté Aromatics & Deglaze with Burgundy Wine',
        time: '8 mins',
        desc: 'In the remaining fat, sauté sliced onion and carrots for 4 minutes. Stir in tomato paste and crushed garlic. Pour in the full bottle of Burgundy red wine, scraping up all the caramelized fond from the bottom of the Dutch oven.',
        targetVisual: 'Vibrant purple wine simmering and loosening the rich brown pan drippings.'
      },
      {
        step: 3,
        title: 'The Slow Gentle Braise',
        time: '120 mins',
        timerSeconds: 120 * 60,
        desc: 'Return the beef and crisp bacon to the pot. Add beef bone broth and bouquet garni until meat is barely submerged. Cover with a tight-fitting lid and transfer to a 325°F (160°C) oven or simmer on lowest stovetop heat for 2 to 2.5 hours until meat is fork-tender.',
        temp: '325°F (160°C) Oven Braise',
        targetVisual: 'Tender beef yielding instantly under gentle fork pressure.'
      },
      {
        step: 4,
        title: 'Glaze Pearl Onions & Mushrooms',
        time: '12 mins',
        desc: 'In a separate skillet, braise pearl onions in butter and beef stock until glazed and tender. In another pan, sauté quartered cremini mushrooms in butter over high heat until browned and nutty.',
        targetVisual: 'Caramelized pearl onions and golden buttered mushrooms.'
      },
      {
        step: 5,
        title: 'Reduce Sauce & Combine',
        time: '10 mins',
        desc: 'Strain the braising liquid into a saucepan and simmer over medium-high heat for 6-8 minutes until reduced into a glossy, velvety glaze. Pour back over the beef, fold in the glazed onions and mushrooms, and serve over creamy mashed potatoes.',
        proTip: 'Like all great stews, Beef Bourguignon tastes even better the next day as the wine and collagen meld.'
      }
    ],
    chefNotes: 'Always use a dry red wine that you would gladly drink from a glass. Avoid cheap cooking wines with added sodium and preservatives.'
  },
  {
    id: 'artisan-neapolitan-margherita-pizza',
    slug: 'artisan-neapolitan-margherita-pizza',
    title: 'Artisanal Neapolitan Pizza Margherita',
    subtitle: '72-hour cold-fermented dough with San Marzano tomatoes, fresh Fior di Latte, and sweet basil',
    cuisine: 'Italian',
    category: 'Baking & Bread',
    difficulty: 'Intermediate',
    method: 'Oven / Roasting',
    prepTimeMins: 30,
    cookTimeMins: 8,
    totalTimeMins: 38,
    servings: 3,
    rating: 4.99,
    reviewsCount: 420,
    author: 'Pizzaiolo Marco Esposito',
    heroImage: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=80',
    description: 'Master the crown of Italian street food at home. Featuring a 65% hydration dough cold-fermented for 48–72 hours to achieve leopard-spotted charred crust (cornicione), sweet crushed DOP San Marzano tomatoes, and milky fresh mozzarella.',
    dietary: ['Vegetarian'],
    tags: ['Pizza', 'Neapolitan', 'Bread Baking', 'Italian', 'Fermented Dough', 'Vegetarian'],
    equipmentNeeded: ['Baking Steel or Heavy Pizza Stone', 'Pizza Peel (Wooden or Perforated Metal)', 'Oven at 500-550°F Max Heat'],
    flavorProfile: ['Toasted Fermented Crust', 'Sweet Tangy Tomato', 'Milky Mozzarella', 'Peppery Fresh Basil'],
    winePairing: 'Campanian Greco di Tufo or light Lambrusco',
    isFeatured: true,
    nutrition: {
      calories: 540,
      proteinGrams: 22,
      carbsGrams: 72,
      fatGrams: 18,
      fiberGrams: 4,
      sodiumMg: 780,
    },
    ingredients: [
      { id: 'pz-1', name: 'Italian Tipo 00 Flour (Caputo Blue or Red)', amountBase: 3.5, unit: 'cups', metricBase: 500, metricUnit: 'g', category: 'grains_pasta', note: 'High protein finely milled wheat' },
      { id: 'pz-2', name: 'Cold filtered water (65% hydration)', amountBase: 1.35, unit: 'cups', metricBase: 325, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'pz-3', name: 'Instant dry yeast', amountBase: 0.5, unit: 'tsp', metricBase: 2, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'pz-4', name: 'Fine sea salt', amountBase: 2, unit: 'tsp', metricBase: 12, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'pz-5', name: 'Canned Whole San Marzano Tomatoes DOP', amountBase: 1, unit: 'can (14 oz)', metricBase: 400, metricUnit: 'g', category: 'pantry_spices', note: 'Crushed gently by hand with 1/2 tsp salt' },
      { id: 'pz-6', name: 'Fresh Fior di Latte Mozzarella or Buffalo Mozzarella', amountBase: 8, unit: 'oz', metricBase: 225, metricUnit: 'g', category: 'dairy_eggs', note: 'Torn into strips & drained on paper towels' },
      { id: 'pz-7', name: 'Fresh sweet Italian basil leaves', amountBase: 12, unit: 'leaves', metricBase: 15, metricUnit: 'g', category: 'produce' },
      { id: 'pz-8', name: 'Extra virgin olive oil', amountBase: 2, unit: 'tbsp', metricBase: 30, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'pz-9', name: 'Semolina flour (for dusting pizza peel)', amountBase: 3, unit: 'tbsp', metricBase: 30, metricUnit: 'g', category: 'grains_pasta' }
    ],
    steps: [
      {
        step: 1,
        title: 'Hydrate & Knead the 65% Hydration Dough',
        time: '12 mins',
        desc: 'Dissolve yeast in cold water. Mix with Tipo 00 flour and salt until a shaggy dough forms. Knead for 8–10 minutes until smooth and elastic (passes the windowpane test). Divide into 3 round balls (270g each).',
        secret: 'Cold slow fermentation in the fridge for 48–72 hours develops complex aroma and easy digestibility.',
        targetVisual: 'Silky, supple dough surface that bounces back when pressed.'
      },
      {
        step: 2,
        title: 'Preheat Baking Steel to Maximum 550°F (290°C)',
        time: '60 mins (passive)',
        desc: 'Place your baking steel or pizza stone on the top rack of your oven. Preheat oven to maximum temperature (500°F–550°F / 260°C–290°C) for a full 60 minutes so the steel stores maximum thermal energy.',
        temp: '550°F (290°C) Maximum Oven'
      },
      {
        step: 3,
        title: 'Hand Stretch: Protect the Cornicione Rim',
        time: '4 mins',
        desc: 'Dust your workstation with semolina. Press out a dough ball from the center outward with your fingertips, pushing air bubbles toward the rim (cornicione). Gently lift and rotate over your knuckles until you have an 11-inch disc with a puffy border.',
        warning: 'NEVER use a rolling pin on pizza dough—it destroys all the delicate carbon dioxide fermentation bubbles!'
      },
      {
        step: 4,
        title: 'Top with Hand-Crushed San Marzano & Cheese',
        time: '2 mins',
        desc: 'Transfer stretched dough to a lightly dusted peel. Spread 3 tablespoons of hand-crushed San Marzano tomatoes evenly, leaving the 1-inch rim bare. Distribute torn mozzarella pieces and a drizzle of extra virgin olive oil.',
        targetVisual: 'Even distribution without overloading the center so the base remains crisp.'
      },
      {
        step: 5,
        title: 'High-Heat Steel Bake & Broil Finish',
        time: '6-8 mins',
        timerSeconds: 7 * 60,
        desc: 'Slide the pizza onto the preheated screaming-hot baking steel. Bake for 5 minutes, then turn on the top broiler for 2 minutes to blister and char the cornicione crust (leopard spots).',
        targetVisual: 'Puffy, blistered rim with deep charred spots and bubbling cheese.'
      },
      {
        step: 6,
        title: 'Garnish with Fresh Basil & Slice',
        time: '1 min',
        desc: 'Remove to a wooden cutting peel. Immediately lay fresh basil leaves across the molten cheese so the heat releases their essential oils. Drizzle with a thin stream of EVOO and slice.',
        secret: 'Adding basil right after taking the pizza out keeps it bright green and fragrant instead of shriveled and blackened.'
      }
    ],
    chefNotes: 'Always dry your fresh mozzarella on paper towels for 30 minutes before baking to prevent excess water pooling on the pizza surface.'
  },
  {
    id: 'mediterranean-quinoa-power-bowl',
    slug: 'mediterranean-quinoa-power-bowl',
    title: 'Mediterranean Lemon Herb Quinoa Crunch Bowl',
    subtitle: 'Fluffy herb-infused quinoa, crisp Persian cucumbers, kalamata olives, marinated feta, and lemon tahini drizzle',
    cuisine: 'Mediterranean',
    category: 'Bowls & Salads',
    difficulty: 'Easy',
    method: 'No-Cook / Fresh',
    prepTimeMins: 15,
    cookTimeMins: 15,
    totalTimeMins: 30,
    servings: 4,
    rating: 4.89,
    reviewsCount: 135,
    author: 'Chef Sofia Kostas',
    heroImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    description: 'A vibrant, nutrient-dense culinary bowl packed with Mediterranean colors: fluffy warm quinoa, roasted chickpeas with smoked paprika, crunchy Persian cucumbers, sun-ripened cherry tomatoes, creamy Greek feta, and a zesty lemon garlic tahini dressing.',
    dietary: ['Vegetarian', 'Gluten-Free', 'High-Protein'],
    tags: ['Healthy', 'Meal Prep', 'Plant Forward', 'Quick Lunch', 'Grain Bowl', 'Mediterranean'],
    equipmentNeeded: ['Medium Saucepan', 'Sheet Pan (for chickpeas)', 'Whisk & Mason Jar'],
    flavorProfile: ['Zesty Lemon', 'Nutty Tahini', 'Briny Feta & Olives', 'Fresh Mint & Dill'],
    winePairing: 'Crisp Greek Assyrtiko or Provence Rosé',
    isFeatured: false,
    nutrition: {
      calories: 440,
      proteinGrams: 16,
      carbsGrams: 52,
      fatGrams: 20,
      fiberGrams: 9,
      sodiumMg: 490,
    },
    ingredients: [
      { id: 'qb-1', name: 'Tri-color organic quinoa, thoroughly rinsed', amountBase: 1, unit: 'cup', metricBase: 180, metricUnit: 'g', category: 'grains_pasta' },
      { id: 'qb-2', name: 'Canned chickpeas, rinsed & roasted with cumin/paprika', amountBase: 1, unit: 'can (15 oz)', metricBase: 400, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'qb-3', name: 'Persian cucumbers, sliced into half-moons', amountBase: 3, unit: 'cucumbers', metricBase: 200, metricUnit: 'g', category: 'produce' },
      { id: 'qb-4', name: 'Cherry tomatoes, halved', amountBase: 1.5, unit: 'cups', metricBase: 250, metricUnit: 'g', category: 'produce' },
      { id: 'qb-5', name: 'Kalamata olives, pitted & sliced', amountBase: 0.5, unit: 'cup', metricBase: 75, metricUnit: 'g', category: 'produce' },
      { id: 'qb-6', name: 'Authentic Greek Sheep Feta block, crumbled', amountBase: 5, unit: 'oz', metricBase: 140, metricUnit: 'g', category: 'dairy_eggs' },
      { id: 'qb-7', name: 'Fresh herbs (flat parsley, dill, mint), chopped', amountBase: 0.75, unit: 'cup', metricBase: 30, metricUnit: 'g', category: 'produce' },
      { id: 'qb-8', name: 'Sesame Tahini paste', amountBase: 3, unit: 'tbsp', metricBase: 45, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'qb-9', name: 'Fresh lemon juice + 1 tsp lemon zest', amountBase: 3, unit: 'tbsp', metricBase: 45, metricUnit: 'ml', category: 'produce' },
      { id: 'qb-10', name: 'Extra virgin olive oil & minced garlic clove', amountBase: 2, unit: 'tbsp', metricBase: 30, metricUnit: 'ml', category: 'pantry_spices' }
    ],
    steps: [
      {
        step: 1,
        title: 'Toast & Simmer Fluffy Quinoa',
        time: '15 mins',
        timerSeconds: 15 * 60,
        desc: 'Rinse quinoa in a fine sieve to remove bitter saponin. In a saucepan, lightly toast quinoa dry for 1 minute, add 2 cups water and a pinch of salt. Bring to a boil, cover, and simmer on low for 15 minutes. Remove from heat and rest covered for 5 minutes, then fluff with a fork.',
        secret: 'Resting covered allows steam to redistribute, making the grains light and separate rather than mushy.'
      },
      {
        step: 2,
        title: 'Quick Spiced Chickpea Roast',
        time: '15 mins',
        timerSeconds: 15 * 60,
        desc: 'Toss dried chickpeas with 1 tbsp olive oil, 1/2 tsp cumin, smoked paprika, and salt. Roast at 400°F (200°C) for 15 minutes until crispy and crunchy.',
        temp: '400°F (200°C)'
      },
      {
        step: 3,
        title: 'Whisk the Velvety Lemon Tahini Dressing',
        time: '3 mins',
        desc: 'In a jar or bowl, whisk tahini, fresh lemon juice, minced garlic, olive oil, and 2-3 tablespoons of warm water until smooth, creamy, and pourable.',
        secret: 'Tahini will initially seize up when acid is added; continue whisking with warm water until it turns pale and glossy.'
      },
      {
        step: 4,
        title: 'Assemble the Power Bowls',
        time: '5 mins',
        desc: 'Divide warm quinoa into 4 wide bowls. Arrange mounds of sliced cucumbers, cherry tomatoes, spiced chickpeas, kalamata olives, and crumbled feta. Garnish heavily with fresh dill, mint, and parsley. Drizzle with lemon tahini dressing.',
        targetVisual: 'Brimming rainbow bowl with contrasting textures and vivid fresh greens.'
      }
    ],
    chefNotes: 'Great for weekly meal prep! Pack the quinoa and veggies in airtight containers and keep the tahini dressing on the side for up to 4 days.'
  },
  {
    id: 'classic-italian-tiramisu',
    slug: 'classic-italian-tiramisu',
    title: 'Authentic Venetian Espresso Tiramisù',
    subtitle: 'Espresso-soaked Savoiardi ladyfingers layered with velvety mascarpone zabaglione cream and Dutch cocoa',
    cuisine: 'Italian',
    category: 'Desserts',
    difficulty: 'Intermediate',
    method: 'No-Cook / Fresh',
    prepTimeMins: 25,
    cookTimeMins: 0,
    totalTimeMins: 25,
    servings: 8,
    rating: 4.98,
    reviewsCount: 380,
    author: 'Pastry Chef Giulia Bianchi',
    heroImage: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80',
    description: 'The definitive Italian dessert: crisp Savoiardi ladyfingers flash-dipped in rich brewed espresso with dark Marsala wine, layered with a cloud-like cream made of farm egg yolks, mascarpone, and whipped egg whites, dusted with bittersweet cocoa.',
    dietary: ['Vegetarian'],
    tags: ['Dessert', 'Tiramisu', 'Italian Classic', 'No Bake', 'Make Ahead', 'Coffee'],
    equipmentNeeded: ['Hand or Stand Mixer', '8x8 or 9x13 inch Glass Dish', 'Fine Sifter / Sieve'],
    flavorProfile: ['Dark Roast Espresso', 'Creamy Mascarpone', 'Aged Marsala Wine', 'Bittersweet Dutch Cocoa'],
    winePairing: 'Vin Santo, Moscato d’Asti, or a double espresso shot',
    isFeatured: true,
    nutrition: {
      calories: 380,
      proteinGrams: 7,
      carbsGrams: 34,
      fatGrams: 24,
      sodiumMg: 110,
    },
    ingredients: [
      { id: 'tm-1', name: 'Authentic Italian Savoiardi Ladyfingers', amountBase: 24, unit: 'cookies (1 package)', metricBase: 250, metricUnit: 'g', category: 'pantry_spices', note: 'Firm, dry ladyfingers (not soft sponge cake)' },
      { id: 'tm-2', name: 'Fresh Italian Mascarpone cheese (cold)', amountBase: 16, unit: 'oz (2 tubs)', metricBase: 475, metricUnit: 'g', category: 'dairy_eggs' },
      { id: 'tm-3', name: 'Pasteurized fresh large eggs, separated', amountBase: 4, unit: 'large eggs', metricBase: 4, metricUnit: 'eggs', category: 'dairy_eggs' },
      { id: 'tm-4', name: 'Granulated fine sugar', amountBase: 0.5, unit: 'cup', metricBase: 100, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'tm-5', name: 'Freshly brewed dark espresso or strong coffee', amountBase: 1.5, unit: 'cups', metricBase: 360, metricUnit: 'ml', category: 'pantry_spices', note: 'Cooled to room temperature' },
      { id: 'tm-6', name: 'Sweet Marsala wine, dark rum, or Kahlúa', amountBase: 2, unit: 'tbsp', metricBase: 30, metricUnit: 'ml', category: 'pantry_spices', optional: true },
      { id: 'tm-7', name: 'Dutch-processed high quality cocoa powder', amountBase: 3, unit: 'tbsp', metricBase: 25, metricUnit: 'g', category: 'pantry_spices', note: 'For final dusting' }
    ],
    steps: [
      {
        step: 1,
        title: 'Whip Egg Yolks & Sugar to Ribbon Stage',
        time: '6 mins',
        desc: 'In a bowl, beat 4 egg yolks and 1/2 cup sugar with an electric mixer for 5-6 minutes until pale yellow, thick, and falling in ribbons.',
        secret: 'Beating yolks until pale dissolves the sugar crystals completely and creates a light, silky texture.'
      },
      {
        step: 2,
        title: 'Fold in Cold Mascarpone & Whipped Whites',
        time: '5 mins',
        desc: 'Gently fold the mascarpone cheese into the yolk mixture in 3 batches until silky. In a clean bowl, whip egg whites to stiff peaks, then fold delicately into the mascarpone cream with a spatula to maintain airy volume.',
        targetVisual: 'Airy, luxurious, pale ivory mascarpone cream.'
      },
      {
        step: 3,
        title: 'The 1-Second Espresso Dip Technique',
        time: '4 mins',
        desc: 'Combine cooled espresso and Marsala wine in a shallow dish. Dip each Savoiardi ladyfinger quickly for exactly 1 second (do not soak!). Line the bottom of your baking dish in a single tight layer.',
        secret: 'A fast dip keeps the ladyfingers from turning soggy; they will gently absorb moisture from the cream as it chills.'
      },
      {
        step: 4,
        title: 'Layer & Chill for 6+ Hours',
        time: '5 mins',
        desc: 'Spread half of the mascarpone cream over the ladyfingers. Add a second layer of dipped ladyfingers perpendicular to the first. Top with remaining cream and smooth the surface. Cover with plastic wrap and chill for at least 6 hours (or overnight).',
        secret: 'Resting overnight allows flavors to marry and gives the structure a clean sliceable consistency.'
      },
      {
        step: 5,
        title: 'Dust with Cocoa & Serve',
        time: '2 mins',
        desc: 'Right before serving, dust the top heavily with Dutch-processed cocoa powder using a fine mesh sieve. Slice and enjoy with cold Prosecco or espresso.',
        targetVisual: 'Rich velvet matte cocoa dusting atop creamy layers.'
      }
    ],
    chefNotes: 'For a richer cream, you can replace the whipped egg whites with 1 cup of heavy whipping cream whipped to stiff peaks.'
  },
  {
    id: 'spanish-gambas-al-ajillo',
    slug: 'spanish-gambas-al-ajillo',
    title: 'Sizzling Spanish Garlic Shrimp (Gambas al Ajillo)',
    subtitle: 'Jumbo succulent prawns sizzling in fragrant olive oil, sliced garlic, sherry wine, and dried chili pepper',
    cuisine: 'Spanish',
    category: 'Appetizers',
    difficulty: 'Easy',
    method: 'Stovetop / Pan-Sear',
    prepTimeMins: 10,
    cookTimeMins: 6,
    totalTimeMins: 16,
    servings: 4,
    rating: 4.93,
    reviewsCount: 156,
    author: 'Chef Carlos Mendez',
    heroImage: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80',
    description: 'The pinnacle of Spanish tapas culture. Sweet, plump wild jumbo prawns poached and flash-sizzled in extra virgin olive oil infused with lots of thinly sliced garlic, smoky pimentón, dried guajillo/cayenne chilies, and dry Spanish Fino sherry.',
    dietary: ['Gluten-Free', 'Dairy-Free', 'Low-Carb', 'High-Protein', 'Pescatarian'],
    tags: ['Tapas', 'Spanish', 'Seafood', 'Under 20 Mins', 'Garlic Lovers', 'Appetizer'],
    equipmentNeeded: ['Traditional Clay Cazuela or Cast-Iron Skillet', 'Tongs', 'Crusty Baguette (for oil dipping)'],
    flavorProfile: ['Sweet Shrimp Crunch', 'Aromatic Toasted Garlic', 'Smoky Pimentón', 'Bright Lemon & Parsley'],
    winePairing: 'Chilled Spanish Albariño, Manzanilla Sherry, or Txakoli',
    isFeatured: false,
    nutrition: {
      calories: 310,
      proteinGrams: 26,
      carbsGrams: 4,
      fatGrams: 21,
      sodiumMg: 520,
    },
    ingredients: [
      { id: 'gm-1', name: 'Wild jumbo shrimp or prawns (16/20 count), peeled & deveined', amountBase: 1, unit: 'lb', metricBase: 450, metricUnit: 'g', category: 'meat_seafood', note: 'Tails on, thoroughly patted dry' },
      { id: 'gm-2', name: 'High-quality Spanish extra virgin olive oil', amountBase: 0.5, unit: 'cup', metricBase: 120, metricUnit: 'ml', category: 'pantry_spices', note: 'The oil is meant to be mopped up with bread' },
      { id: 'gm-3', name: 'Fresh garlic cloves, thinly sliced into chips', amountBase: 8, unit: 'cloves', metricBase: 30, metricUnit: 'g', category: 'produce' },
      { id: 'gm-4', name: 'Dried red chili pepper (guajillo, arbol, or red pepper flakes)', amountBase: 1, unit: 'tsp', metricBase: 3, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'gm-5', name: 'Smoky Spanish sweet paprika (Pimentón de la Vera)', amountBase: 0.5, unit: 'tsp', metricBase: 2, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'gm-6', name: 'Dry Spanish Fino Sherry or dry white wine', amountBase: 2, unit: 'tbsp', metricBase: 30, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'gm-7', name: 'Fresh flat-leaf parsley, finely chopped', amountBase: 0.25, unit: 'cup', metricBase: 15, metricUnit: 'g', category: 'produce' },
      { id: 'gm-8', name: 'Fresh lemon wedges & crusty sourdough bread', amountBase: 1, unit: 'serving', metricBase: 100, metricUnit: 'g', category: 'garnish' }
    ],
    steps: [
      {
        step: 1,
        title: 'Baking Soda Brine for Super-Plump Shrimp',
        time: '10 mins (passive)',
        desc: 'Toss dry peeled shrimp with 1/4 tsp baking soda and 1/2 tsp kosher salt. Let sit for 10 minutes in the fridge, then pat dry with paper towels.',
        secret: 'A quick pinch of baking soda raises pH, keeping shrimp incredibly plump, tender, and snapping with crunch when cooked.'
      },
      {
        step: 2,
        title: 'Gently Infuse Olive Oil with Garlic Chips',
        time: '3 mins',
        desc: 'In a cold cast iron skillet or clay cazuela, add olive oil and sliced garlic chips. Turn heat to medium-low. Cook slowly until garlic turns pale golden and aromatic (do not let it brown dark). Add dried chili and paprika.',
        warning: 'Dark brown garlic turns bitter; keep heat moderate and watch closely.'
      },
      {
        step: 3,
        title: 'High-Heat Sizzle & Sherry Deglaze',
        time: '3 mins',
        timerSeconds: 3 * 60,
        desc: 'Turn heat to high. Add shrimp in a single layer. Sear for 90 seconds, flip and cook 1 minute until pink and opaque. Splash in the dry Sherry wine; let it bubble and emulsify with the fragrant garlic oil.',
        temp: 'High Heat Sizzle'
      },
      {
        step: 4,
        title: 'Squeeze Lemon & Serve Sizzling',
        time: '1 min',
        desc: 'Remove from heat immediately. Stir in fresh chopped parsley and a squeeze of fresh lemon juice. Serve directly in the hot skillet alongside generous slices of warm crusty baguette to dip in the infused garlic oil.',
        targetVisual: 'Sizzling bubbling oil with coral-pink shrimp and bright green parsley.'
      }
    ],
    chefNotes: 'Never discard the oil! The garlicky infused oil is the best part of the dish and is traditionally sopped up with warm bread.'
  },
  {
    id: 'epic-egg-in-a-hole-crispy-sausage',
    slug: 'epic-egg-in-a-hole-crispy-sausage',
    title: 'Epic Egg in a Hole with Crispy Sausage and Oozy Cheese',
    subtitle: 'Sourdough cups filled with fennel sausage and a double-cheese melt, crowned with a golden runny yolk',
    cuisine: 'Italian',
    category: 'Mains',
    difficulty: 'Easy',
    method: 'Stovetop / Pan-Sear',
    prepTimeMins: 10,
    cookTimeMins: 15,
    totalTimeMins: 25,
    servings: 4,
    rating: 5,
    reviewsCount: 1,
    author: 'Chef Marco Bellini',
    heroImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
    description: 'This hearty breakfast-for-dinner dish transforms the humble egg-in-a-hole into something truly extraordinary. Thick slices of crusty sourdough form sturdy cups that soak up every flavor, while savory Italian fennel sausage browns to a crisp edge alongside silky, melted mozzarella and fontina. The crowning glory is the egg nestled in the center, cooked until the white is set but the yolk remains gloriously runny. Best served straight from the pan with a glass of bright Valpolicella.',
    dietary: [],
    tags: ['egg', 'sourdough', 'sausage', 'Italian', 'breakfast', 'brunch', 'cheese', 'comfort food', 'skillet', 'easy dinner', 'fennel sausage', 'pan-fried'],
    equipmentNeeded: ['Large cast-iron skillet', 'Chef knife', 'Cutting board', 'Rolling pin', 'Slotted spatula', 'Paper towels', 'Small bowl'],
    flavorProfile: ['Savory Fennel Sausage', 'Molten Double Cheese', 'Rich Runny Egg', 'Crisp Sourdough'],
    winePairing: 'A light-bodied Valpolicella Classico from the Veneto complements the rich cheese and sausage. For a non-alcoholic option, serve sparkling water with lemon and rosemary or fennel-seed-infused chai.',
    isFeatured: true,
    nutrition: {
      calories: 615,
      proteinGrams: 32,
      carbsGrams: 48,
      fatGrams: 30,
      fiberGrams: 2,
      sodiumMg: 980,
    },
    ingredients: [
      { id: 'eeh-1', name: 'Sourdough bread', amountBase: 4, unit: 'slices', metricBase: 4, metricUnit: 'slices', category: 'grains_pasta', note: 'Thick slices, about 1 inch each' },
      { id: 'eeh-2', name: 'Italian fennel sausage', amountBase: 10.6, unit: 'oz', metricBase: 300, metricUnit: 'g', category: 'meat_seafood', note: 'Removed from casings and crumbled' },
      { id: 'eeh-3', name: 'Mozzarella cheese', amountBase: 5.3, unit: 'oz', metricBase: 150, metricUnit: 'g', category: 'dairy_eggs', note: 'Shredded' },
      { id: 'eeh-4', name: 'Fontina cheese', amountBase: 3.5, unit: 'oz', metricBase: 100, metricUnit: 'g', category: 'dairy_eggs', note: 'Shredded' },
      { id: 'eeh-5', name: 'Large eggs', amountBase: 4, unit: 'whole', metricBase: 4, metricUnit: 'whole', category: 'dairy_eggs', note: 'Crack each into a small bowl first' },
      { id: 'eeh-6', name: 'Fresh parsley', amountBase: 2, unit: 'tbsp', metricBase: 8, metricUnit: 'g', category: 'produce', note: 'Freshly chopped' },
      { id: 'eeh-7', name: 'Olive oil', amountBase: 1, unit: 'tbsp', metricBase: 15, metricUnit: 'ml', category: 'pantry_spices' },
      { id: 'eeh-8', name: 'Butter', amountBase: 1, unit: 'tbsp', metricBase: 14, metricUnit: 'g', category: 'dairy_eggs' },
      { id: 'eeh-9', name: 'Salt', amountBase: 1, unit: 'tsp', metricBase: 5, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'eeh-10', name: 'Black pepper', amountBase: 0.5, unit: 'tsp', metricBase: 1, metricUnit: 'g', category: 'pantry_spices' },
      { id: 'eeh-11', name: 'Red pepper flakes', amountBase: 0.25, unit: 'tsp', metricBase: 0.5, metricUnit: 'g', category: 'pantry_spices' },
    ],
    steps: [
      { step: 1, title: 'Warm the skillet', time: '1 min', timerSeconds: 0, desc: 'Place a large cast-iron skillet over medium heat and allow it to warm for 60 seconds.', temp: 'Medium heat' },
      { step: 2, title: 'Prepare the sourdough', time: '4 mins', timerSeconds: 0, desc: 'Remove the crusts from the sourdough slices and cut a circular hole about 2 inches wide in the center of each slice, saving the cut-out rounds.' },
      { step: 3, title: 'Melt the cooking fat', time: '30 sec', timerSeconds: 0, desc: 'Add the olive oil and butter to the warm skillet. Let the butter melt and begin to foam.', targetVisual: 'The butter is foamy but not browned.' },
      { step: 4, title: 'Crisp the fennel sausage', time: '5 mins', timerSeconds: 300, desc: 'Add the crumbled Italian fennel sausage. Cook, breaking it into small pieces, until browned and crisp around the edges. Remove it with a slotted spatula and drain on paper towels, leaving about 1 tablespoon of rendered fat in the pan.', warning: 'Do not overcrowd the pan or the sausage will steam instead of crisping.' },
      { step: 5, title: 'Toast the bread', time: '2 mins', timerSeconds: 120, desc: 'Add the sourdough slices and their cut-out centers to the rendered fat. Season lightly with salt and pepper. Cook until the undersides are golden and crisp.', targetVisual: 'The bread underside is evenly golden and crisp.' },
      { step: 6, title: 'Add the double-cheese melt', time: '30 sec', timerSeconds: 30, desc: 'Flip the bread and immediately divide the shredded mozzarella and fontina evenly over each slice, allowing the cheese to begin melting from the residual heat.' },
      { step: 7, title: 'Nestle in the eggs', time: '1 min', timerSeconds: 0, desc: 'Make a small well in the center of each cheese-topped bread round and crack one egg into each well. Season with salt, black pepper, and red pepper flakes, taking care not to break the yolks.' },
      { step: 8, title: 'Set the whites', time: '3 mins', timerSeconds: 180, desc: 'Reduce the heat to medium-low, cover the skillet, and cook until the egg whites are fully set while the yolks remain runny. For a firmer yolk, cook 1 to 2 minutes longer.', temp: 'Medium-low heat', targetVisual: 'The whites are opaque and set; the yolks still jiggle.' },
      { step: 9, title: 'Garnish and serve', time: '1 min', timerSeconds: 0, desc: 'Slide the sourdough rounds onto warm plates. Top each with a spoonful of crispy fennel sausage and freshly chopped parsley. Serve immediately while the cheese is molten and the yolks are warm.', targetVisual: 'Molten cheese, crisp bread, and bright golden yolks.' },
    ],
    chefNotes: 'Choose sourdough that is at least one inch thick and day-old so the denser crumb holds up to the egg and cheese. If the sausage is very fatty, drain off some rendered fat before adding the bread. Fontina melts exceptionally well; Taleggio or young Gruyere are good substitutes. Remove the skillet from the heat as soon as the whites are set so residual heat finishes the yolk gently. This original creation is inspired by the Italian tradition of uova in cotoletta and the comfort-food sensibilities of a Neapolitan trattoria breakfast plate.',
  }
];
