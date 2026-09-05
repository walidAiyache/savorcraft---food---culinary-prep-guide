import { PrepTechnique } from '../types';

export const CULINARY_TECHNIQUES: PrepTechnique[] = [
  {
    id: 'knife-skills-dice-julienne',
    title: 'Essential Knife Skills: The Classic Dice & Julienne',
    category: 'Knife Skills',
    difficulty: 'Easy',
    timeNeeded: '15 mins practice',
    summary: 'Master the Chef’s claw grip, rocking motion, and standard culinary cuts (Mirepoix Dice, Brunoise, and Julienne matchsticks) to ensure uniform cooking and professional presentation.',
    iconName: 'Scissors',
    sciencePrinciple: 'Uniform knife cuts ensure every vegetable piece cooks at the exact same thermal rate, preventing small pieces from overcooking while larger ones remain raw and crunchy.',
    mistakesToAvoid: [
      'Using a dull blade (causes slipping and bruised vegetable cells)',
      'Lifting the knife tip off the board (use a continuous forward rocking motion)',
      'Flat fingers on food (always tuck fingertips into a protective claw grip)'
    ],
    equipment: ['8-inch Chef Knife (Wüsthof or Japanese Gyuto)', 'End-Grain Heavy Wood Cutting Board', 'Damp cloth beneath board (for stability)'],
    steps: [
      {
        number: 1,
        title: 'The Pinch Grip & Protective Claw',
        description: 'Pinch the heel of the blade between thumb and forefinger for ultimate control. Form your other hand into a "claw" with curled fingertips tucked inward, resting the side of the blade against your flat knuckles.'
      },
      {
        number: 2,
        title: 'Create a Flat Base',
        description: 'Trim a thin slice off one side of round vegetables (like onions or carrots) so the food rests completely flat and immobile on the board.'
      },
      {
        number: 3,
        title: 'Batonnet & Julienne Cuts',
        description: 'Slice the squared vegetable lengthwise into uniform 1/4-inch planks (Batonnet) or 1/8-inch planks (Julienne matchsticks). Stack 2 planks and slice lengthwise.'
      },
      {
        number: 4,
        title: 'The Fine Brunoise & Medium Dice',
        description: 'Bundle the julienne matchsticks together and slice crosswise at 1/8-inch intervals for fine brunoise (perfect for sauces) or 1/4-inch for classic mirepoix.'
      }
    ],
    proTip: 'Hone your knife on a ceramic or steel rod at a 15–20° angle before every prep session to realign the microscopic blade teeth.'
  },
  {
    id: 'maillard-reaction-pan-searing',
    title: 'The Maillard Reaction & Cast-Iron Pan Searing',
    category: 'Heat & Searing',
    difficulty: 'Intermediate',
    timeNeeded: '10 mins',
    summary: 'Learn the chemistry behind golden-brown crusts on steaks, poultry, and fish, and how to create rich pan sauces by deglazing the fond.',
    iconName: 'Flame',
    sciencePrinciple: 'Between 280°F–330°F (140°C–165°C), amino acids and reducing sugars chemically react to produce hundreds of complex savory flavor compounds (the Maillard reaction). Excess surface moisture caps pan temperature at 212°F (steam point), sabotaging the crust.',
    mistakesToAvoid: [
      'Putting wet or cold meat directly into a lukewarm pan',
      'Moving or poking the meat before it releases naturally from the pan',
      'Overcrowding the skillet which drops thermal mass and boils meat in its own juices'
    ],
    equipment: ['Heavy Cast-Iron Skillet (10-12")', 'Infrared Surface Thermometer', 'Fish Spatula or Locking Tongs', 'Paper Towels'],
    steps: [
      {
        number: 1,
        title: 'Dry-Brining & Dehydration',
        description: 'Salt the protein 45 minutes prior and pat aggressively dry with paper towels until the surface is completely matte.'
      },
      {
        number: 2,
        title: 'Preheating Skillet to Shimmer Point',
        description: 'Preheat skillet over high heat for 4–5 minutes until oil wisps light smoke (450°F+). Use high smoke point oils (avocado, grapeseed).'
      },
      {
        number: 3,
        title: 'Undisturbed Contact Sear',
        description: 'Place protein away from yourself. Press gently for full surface contact. Do not shake or flip until a deep amber crust forms and releases effortlessly from the metal.'
      },
      {
        number: 4,
        title: 'Deglaze the Browned Fond',
        description: 'After removing the seared meat, pour in wine, stock, or vinegar. Scrape the brown stuck bits (fond) with a wooden spoon to dissolve them into a glossy pan sauce.'
      }
    ],
    proTip: 'Mount your pan sauce with cold unsalted butter off the heat (monter au beurre) for a mirror-like shine and velvety texture.'
  },
  {
    id: 'emulsions-hollandaise-mayo',
    title: 'Culinary Emulsions: The Science of Velvety Sauces',
    category: 'Emulsions & Sauces',
    difficulty: 'Intermediate',
    timeNeeded: '8 mins',
    summary: 'Master stable water-in-oil and oil-in-water emulsions like classic vinaigrettes, aioli, and velvety warm hollandaise without breaking.',
    iconName: 'Droplet',
    sciencePrinciple: 'Emulsions force two immiscible liquids (oil and water) into a stable suspension using emulsifiers like lecithin (found in egg yolks and mustard). High shear force breaks oil into microscopic droplets surrounded by surfactant molecules.',
    mistakesToAvoid: [
      'Adding oil too fast in the beginning (must start drop by drop)',
      'Overheating egg yolks above 150°F (65°C) which scrambles the proteins',
      'Using butter that is boiling hot rather than warm (130°F)'
    ],
    equipment: ['Immersion Stick Blender or Balloon Whisk', 'Stainless Steel Bowl', 'Small Saucepan for double-boiler / bain-marie'],
    steps: [
      {
        number: 1,
        title: 'Form the Emulsifier Base',
        description: 'Whisk egg yolk with 1 tsp acid (lemon juice or vinegar) and a pinch of salt to hydrate the lecithin proteins.'
      },
      {
        number: 2,
        title: 'The Slow Drizzle Initiation',
        description: 'Whisking vigorously, add warm melted butter or oil literally drop-by-drop for the first 2 tablespoons until a creamy nucleus forms.'
      },
      {
        number: 3,
        title: 'Steady Stream Incorporation',
        description: 'Once the base is thick and stable, pour the remaining oil in a thin, continuous stream while maintaining rapid whisking.'
      },
      {
        number: 4,
        title: 'Rescue a Broken Sauce (The Lifesaver)',
        description: 'If your sauce splits or separates: whisk 1 tablespoon of warm water or a fresh egg yolk in a clean bowl, then slowly whisk the broken sauce into it.'
      }
    ],
    proTip: 'An immersion blender method takes only 60 seconds: place yolk, lemon, and salt in a tall jar, pour warm butter on top, insert blender to the bottom, and pull up slowly.'
  },
  {
    id: 'dough-hydration-windowpane',
    title: 'Bread Science: Hydration & The Gluten Windowpane Test',
    category: 'Dough & Baking',
    difficulty: 'Intermediate',
    timeNeeded: '20 mins',
    summary: 'Understand baker’s percentages, hydration levels (from 60% sandwich loaves to 80% open-crumb ciabatta), and how to verify complete gluten development.',
    iconName: 'Layers',
    sciencePrinciple: 'When flour proteins (gliadin and glutenin) hydrate and undergo mechanical shearing (kneading or stretch-and-fold), they link into an elastic 3D matrix that traps carbon dioxide gas from yeast fermentation.',
    mistakesToAvoid: [
      'Adding excessive flour on the bench when dough feels sticky (use wet hands instead)',
      'Under-fermenting dough in cold ambient rooms',
      'Rushing the rest period before shaping'
    ],
    equipment: ['Digital Gram Scale', 'Dough Scraper (bench knife)', 'Proofing Bowl & Shower Cap / Damp Cloth'],
    steps: [
      {
        number: 1,
        title: 'Baker’s Math & Autolyse',
        description: 'Mix flour and water without yeast or salt; rest 30–45 minutes (autolyse). Enzymes activate naturally, breaking down starches and softening protein chains.'
      },
      {
        number: 2,
        title: 'The Stretch & Fold Technique',
        description: 'Instead of aggressive counter kneading for wet doughs, wet your fingers, grab one edge of the dough, stretch it upwards, and fold over the center. Rotate bowl 90° and repeat 4 times.'
      },
      {
        number: 3,
        title: 'The Windowpane Test Verification',
        description: 'Pinch off a small golf-ball piece of dough. Using both hands, gently stretch and rotate it outward. If you can stretch it thin enough for light to pass through without tearing, gluten is fully formed.'
      }
    ],
    proTip: 'For sourdough and artisanal breads, always weigh ingredients in grams—a volume cup of flour can vary by up to 30% depending on how it was scooped.'
  },
  {
    id: 'air-fryer-convection-dynamics',
    title: 'Air Fryer Convection: Maximum Crunch Without Soggy Bottoms',
    category: 'Air Fryer & Convection',
    difficulty: 'Easy',
    timeNeeded: '5 mins',
    summary: 'Unlock the physics of superheated air velocity: the ideal oil spray dispersion, thermal rack spacing, and moisture venting.',
    iconName: 'Wind',
    sciencePrinciple: 'Air fryers are high-velocity compact convection ovens. The intense airflow rapidly strips away the cool boundary layer of humid air around food, accelerating evaporation and creating dry, blistered crispy surfaces.',
    mistakesToAvoid: [
      'Overcrowding the basket (creates steam and soggy edges)',
      'Forgetting oil mist (panko and flour need micro-droplets of oil to conduct heat)',
      'Placing wet battered foods directly on wire mesh (use breadcrumbs or starch instead)'
    ],
    equipment: ['Air Fryer with Non-Stick Basket', 'Pure EVOO / Avocado Oil Refillable Sprayer', 'Silicone Tipped Tongs'],
    steps: [
      {
        number: 1,
        title: 'Always Preheat for 3–5 Minutes',
        description: 'Starting in a preheated 400°F (200°C) basket immediately flash-sets breading and seals exterior starch before moisture can leach out.'
      },
      {
        number: 2,
        title: 'The Fine Mist Oil Barrier',
        description: 'Use a fine mist sprayer. Aerosol cans with propellants can degrade air fryer basket coatings over time. A light sheen is all that is needed for Maillard browning.'
      },
      {
        number: 3,
        title: 'The 60% Shake & Flip Rule',
        description: 'Always flip or gently shake foods at the 60% mark of total cooking time to expose the bottom surface to direct convective downflow.'
      }
    ],
    proTip: 'For reheating pizza, fried chicken, or pastries, 360°F for 3–4 minutes revives 100% of original bakery crunch without drying the interior.'
  },
  {
    id: 'meat-thermometry-resting',
    title: 'Precision Temperature Control & Carryover Resting',
    category: 'Heat & Searing',
    difficulty: 'Easy',
    timeNeeded: '5 mins',
    summary: 'Why touch tests fail and digital instant-read probes are the professional standard for steaks, chicken, salmon, and roasts.',
    iconName: 'Thermometer',
    sciencePrinciple: 'When meat cooks, muscle proteins contract and squeeze water inward toward the cooler core. During an 8–10 minute rest, internal temperatures equalize (carryover cooking rises 5°F–8°F) and proteins relax to reabsorb juices.',
    mistakesToAvoid: [
      'Cutting steak or roast immediately after removing from heat',
      'Relying on timer alone instead of internal core temperature',
      'Poking through the bone instead of the thickest center mass'
    ],
    equipment: ['Instant-Read Digital Thermometer (Thermopen or similar)', 'Wooden Carving Board with Juice Grooves'],
    steps: [
      {
        number: 1,
        title: 'Probe Placement',
        description: 'Insert the thermometer probe horizontally into the thickest part of the meat, avoiding bones and fat pockets.'
      },
      {
        number: 2,
        title: 'Pull 5°F Below Target',
        description: 'Pull steak at 125°F for 130°F medium-rare; pull chicken at 160°F for 165°F safe pasteurization; pull salmon at 120°F for tender medium-rare.'
      },
      {
        number: 3,
        title: 'Loose Foil Tent Rest',
        description: 'Rest on a warm board under a loose foil tent for 5–10 minutes depending on meat size.'
      }
    ],
    proTip: 'Carve meats perpendicular to the grain (the long parallel muscle fibers). This cuts fiber length in half, making every bite melt-in-the-mouth tender.'
  }
];
