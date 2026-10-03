 'use client'

import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import {
  ChevronDown,
  Clock,
  Flame,
  Heart,
  Search,
  Users,
  X,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export type RecipeCategory =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Vegan'
  | 'High Protein'
  | 'Low Fat'
  | 'Sugar Free'
  | 'Quickly Prepared'

export type Recipe = {
  id: string
  title: string
  description: string
  category: RecipeCategory
  calories: number
  protein: number
  carbs: number
  fat: number
  time: number
  servings: number
  image: string
  ingredients: string[]
  steps: string[]
}

/* =========================
   RECIPES DATA
========================= */

const RECIPES: Recipe[] = [
  // BREAKFAST
  {
    id: 'breakfast-1',
    title: 'Avocado Egg Toast',
    description:
      'Creamy avocado with a perfectly cooked egg on crispy whole grain toast.',
    category: 'Breakfast',
    calories: 340,
    protein: 15,
    carbs: 32,
    fat: 19,
    time: 10,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '2 slices whole grain bread',
      '1 avocado',
      '2 eggs',
      'Salt',
      'Black pepper',
      'Chili flakes',
    ],
    steps: [
      'Toast the bread until golden.',
      'Mash the avocado and season with salt and pepper.',
      'Cook the eggs to your preference.',
      'Spread avocado on toast and place the eggs on top.',
      'Finish with chili flakes.',
    ],
  },
  {
    id: 'breakfast-2',
    title: 'Berry Yogurt Bowl',
    description:
      'Fresh berries, creamy yogurt and crunchy granola for a simple morning meal.',
    category: 'Breakfast',
    calories: 290,
    protein: 16,
    carbs: 39,
    fat: 8,
    time: 5,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '200 g Greek yogurt',
      'Mixed berries',
      '30 g granola',
      '1 tsp honey',
    ],
    steps: [
      'Add yogurt to a bowl.',
      'Top with fresh berries.',
      'Add granola.',
      'Drizzle with honey and serve.',
    ],
  },
  {
    id: 'breakfast-3',
    title: 'Banana Oatmeal',
    description:
      'Warm creamy oatmeal topped with banana and cinnamon.',
    category: 'Breakfast',
    calories: 310,
    protein: 10,
    carbs: 52,
    fat: 7,
    time: 8,
    servings: 1,
    image:
      'https://www.chiquita.com/wp-content/uploads/2020/03/Banana-oatmeal-with-honey-walnuts-and-cinnamon-1.jpg',
    ingredients: [
      '50 g oats',
      '200 ml milk',
      '1 banana',
      'Cinnamon',
      '1 tsp honey',
    ],
    steps: [
      'Add oats and milk to a saucepan.',
      'Cook for 5–6 minutes while stirring.',
      'Slice the banana.',
      'Top oatmeal with banana and cinnamon.',
    ],
  },
  {
    id: 'breakfast-4',
    title: 'Vegetable Omelette',
    description:
      'Fluffy eggs packed with colorful vegetables and fresh herbs.',
    category: 'Breakfast',
    calories: 280,
    protein: 20,
    carbs: 10,
    fat: 18,
    time: 12,
    servings: 1,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNGT0QeiZoKNmbKnU_B1qLvAt_sqayY5eDQhdjDzC0ygDS1Ix-tvyfDo12&s=10',
    ingredients: [
      '3 eggs',
      'Bell pepper',
      'Tomato',
      'Spinach',
      'Salt',
      'Black pepper',
    ],
    steps: [
      'Whisk the eggs.',
      'Chop the vegetables.',
      'Cook vegetables in a pan.',
      'Pour in the eggs.',
      'Cook until set and fold.',
    ],
  },
  {
    id: 'breakfast-5',
    title: 'Peanut Butter Banana Toast',
    description:
      'Whole grain toast with peanut butter and fresh banana slices.',
    category: 'Breakfast',
    calories: 350,
    protein: 12,
    carbs: 43,
    fat: 16,
    time: 5,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '2 slices whole grain bread',
      '2 tbsp peanut butter',
      '1 banana',
      'Cinnamon',
    ],
    steps: [
      'Toast the bread.',
      'Spread peanut butter evenly.',
      'Slice the banana.',
      'Place banana slices on top.',
      'Add cinnamon.',
    ],
  },
  {
    id: 'breakfast-6',
    title: 'Breakfast Pancakes',
    description:
      'Soft homemade pancakes served with fresh fruit.',
    category: 'Breakfast',
    calories: 390,
    protein: 12,
    carbs: 55,
    fat: 13,
    time: 15,
    servings: 2,
    image:
      'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '1 cup flour',
      '1 egg',
      '200 ml milk',
      '1 tsp baking powder',
      'Fresh berries',
    ],
    steps: [
      'Mix flour and baking powder.',
      'Add egg and milk.',
      'Whisk until smooth.',
      'Cook small pancakes on a non-stick pan.',
      'Serve with fresh fruit.',
    ],
  },

  // LUNCH
  {
    id: 'lunch-1',
    title: 'Grilled Chicken Bowl',
    description:
      'Juicy grilled chicken with rice, vegetables and a fresh dressing.',
    category: 'Lunch',
    calories: 520,
    protein: 42,
    carbs: 55,
    fat: 14,
    time: 25,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '150 g chicken breast',
      '100 g cooked rice',
      'Cucumber',
      'Tomato',
      'Lettuce',
      'Olive oil',
    ],
    steps: [
      'Season and grill the chicken.',
      'Cook the rice.',
      'Chop the vegetables.',
      'Add everything to a bowl.',
      'Drizzle with olive oil.',
    ],
  },
  {
    id: 'lunch-2',
    title: 'Chicken Caesar Salad',
    description:
      'Crisp lettuce, grilled chicken and parmesan with a creamy dressing.',
    category: 'Lunch',
    calories: 460,
    protein: 38,
    carbs: 18,
    fat: 27,
    time: 20,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '150 g chicken breast',
      'Romaine lettuce',
      'Parmesan',
      'Croutons',
      'Caesar dressing',
    ],
    steps: [
      'Grill the chicken.',
      'Wash and chop lettuce.',
      'Slice the chicken.',
      'Combine lettuce, chicken, parmesan and croutons.',
      'Add dressing.',
    ],
  },
  {
    id: 'lunch-3',
    title: 'Salmon Rice Bowl',
    description:
      'Tender salmon with rice, cucumber and avocado.',
    category: 'Lunch',
    calories: 540,
    protein: 36,
    carbs: 48,
    fat: 22,
    time: 25,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '150 g salmon',
      '100 g cooked rice',
      'Half avocado',
      'Cucumber',
      'Soy sauce',
    ],
    steps: [
      'Season the salmon.',
      'Bake or pan-cook until fully cooked.',
      'Prepare the rice.',
      'Slice avocado and cucumber.',
      'Combine everything in a bowl.',
    ],
  },
  {
    id: 'lunch-4',
    title: 'Turkey Wrap',
    description:
      'Fresh turkey wrap with vegetables and a light yogurt sauce.',
    category: 'Lunch',
    calories: 410,
    protein: 31,
    carbs: 42,
    fat: 13,
    time: 10,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Whole wheat tortilla',
      '100 g turkey',
      'Lettuce',
      'Tomato',
      'Cucumber',
      'Yogurt sauce',
    ],
    steps: [
      'Place tortilla on a flat surface.',
      'Add turkey and vegetables.',
      'Add yogurt sauce.',
      'Roll tightly.',
      'Cut in half.',
    ],
  },
  {
    id: 'lunch-5',
    title: 'Quinoa Chicken Salad',
    description:
      'Protein-rich quinoa salad with chicken and colorful vegetables.',
    category: 'Lunch',
    calories: 480,
    protein: 37,
    carbs: 45,
    fat: 15,
    time: 20,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '100 g cooked quinoa',
      '120 g chicken',
      'Cucumber',
      'Tomato',
      'Spinach',
      'Lemon juice',
    ],
    steps: [
      'Cook quinoa.',
      'Grill the chicken.',
      'Chop vegetables.',
      'Combine ingredients.',
      'Add lemon juice.',
    ],
  },
  {
    id: 'lunch-6',
    title: 'Tuna Avocado Salad',
    description:
      'Light tuna salad with creamy avocado and crunchy vegetables.',
    category: 'Lunch',
    calories: 390,
    protein: 32,
    carbs: 14,
    fat: 23,
    time: 10,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '1 can tuna',
      'Half avocado',
      'Lettuce',
      'Cucumber',
      'Tomato',
      'Lemon juice',
    ],
    steps: [
      'Drain tuna.',
      'Chop vegetables and avocado.',
      'Combine all ingredients.',
      'Add lemon juice.',
      'Mix gently.',
    ],
  },

  // DINNER
  {
    id: 'dinner-1',
    title: 'Grilled Salmon',
    description:
      'Tender grilled salmon served with vegetables and lemon.',
    category: 'Dinner',
    calories: 510,
    protein: 40,
    carbs: 18,
    fat: 30,
    time: 25,
    servings: 1,
    image:
      'https://www.allrecipes.com/thmb/CfocX_0yH5_hFxtbFkzoWXrlycs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ALR-12720-grilled-salmon-i-VAT-4x3-888cac0fb8a34f6fbde7bf836850cd1c.jpg',
    ingredients: [
      '180 g salmon',
      'Broccoli',
      'Carrot',
      'Lemon',
      'Olive oil',
      'Salt',
    ],
    steps: [
      'Season the salmon.',
      'Grill for several minutes on each side.',
      'Steam the vegetables.',
      'Serve salmon with vegetables and lemon.',
    ],
  },
  {
    id: 'dinner-2',
    title: 'Chicken with Vegetables',
    description:
      'Tender chicken breast cooked with colorful seasonal vegetables.',
    category: 'Dinner',
    calories: 430,
    protein: 44,
    carbs: 24,
    fat: 17,
    time: 25,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '180 g chicken',
      'Bell pepper',
      'Broccoli',
      'Carrot',
      'Olive oil',
    ],
    steps: [
      'Cut chicken into pieces.',
      'Chop vegetables.',
      'Cook chicken in a pan.',
      'Add vegetables.',
      'Cook until tender.',
    ],
  },
  {
    id: 'dinner-3',
    title: 'Beef Steak Plate',
    description:
      'Juicy beef steak with roasted vegetables.',
    category: 'Dinner',
    calories: 560,
    protein: 46,
    carbs: 25,
    fat: 29,
    time: 30,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '180 g beef steak',
      'Potatoes',
      'Broccoli',
      'Salt',
      'Black pepper',
    ],
    steps: [
      'Season the steak.',
      'Cook steak to your preferred doneness.',
      'Roast potatoes and broccoli.',
      'Rest the steak briefly.',
      'Serve together.',
    ],
  },
  {
    id: 'dinner-4',
    title: 'Chicken Pasta',
    description:
      'Creamy-style chicken pasta with herbs and vegetables.',
    category: 'Dinner',
    calories: 590,
    protein: 38,
    carbs: 66,
    fat: 18,
    time: 25,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '100 g pasta',
      '130 g chicken',
      'Tomato',
      'Garlic',
      'Parmesan',
    ],
    steps: [
      'Cook pasta.',
      'Cook chicken in a pan.',
      'Add tomato and garlic.',
      'Add cooked pasta.',
      'Finish with parmesan.',
    ],
  },
  {
    id: 'dinner-5',
    title: 'Turkey Meatballs',
    description:
      'Tender turkey meatballs served with tomato sauce and vegetables.',
    category: 'Dinner',
    calories: 450,
    protein: 42,
    carbs: 28,
    fat: 18,
    time: 30,
    servings: 2,
    image:
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '300 g ground turkey',
      'Egg',
      'Breadcrumbs',
      'Tomato sauce',
      'Herbs',
    ],
    steps: [
      'Mix turkey with egg and breadcrumbs.',
      'Form small meatballs.',
      'Cook until browned and fully cooked.',
      'Add tomato sauce.',
      'Simmer for several minutes.',
    ],
  },
  {
    id: 'dinner-6',
    title: 'Vegetable Stir Fry',
    description:
      'Colorful vegetables quickly cooked with a light savory sauce.',
    category: 'Dinner',
    calories: 360,
    protein: 12,
    carbs: 42,
    fat: 15,
    time: 15,
    servings: 1,
    image:
      'https://i0.wp.com/lakesandlattes.com/wp-content/uploads/2020/04/simple-vegetable-stir-fry-noodles.jpg?fit=850%2C604&ssl=1',
    ingredients: [
      'Broccoli',
      'Bell pepper',
      'Carrot',
      'Mushrooms',
      'Soy sauce',
    ],
    steps: [
      'Chop all vegetables.',
      'Heat a pan.',
      'Stir fry vegetables.',
      'Add soy sauce.',
      'Cook until crisp-tender.',
    ],
  },

  // VEGAN
  {
    id: 'vegan-1',
    title: 'Vegan Buddha Bowl',
    description:
      'A colorful bowl with chickpeas, vegetables, grains and avocado.',
    category: 'Vegan',
    calories: 470,
    protein: 17,
    carbs: 61,
    fat: 19,
    time: 20,
    servings: 1,
    image:
      'https://eatwithclarity.com/wp-content/uploads/2020/03/vegan-buddha-bowl.jpg',
    ingredients: [
      'Chickpeas',
      'Quinoa',
      'Avocado',
      'Carrot',
      'Cucumber',
      'Spinach',
    ],
    steps: [
      'Cook quinoa.',
      'Prepare vegetables.',
      'Add chickpeas to a bowl.',
      'Add quinoa and vegetables.',
      'Top with avocado.',
    ],
  },
  {
    id: 'vegan-2',
    title: 'Avocado Chickpea Salad',
    description:
      'Fresh chickpeas and avocado with crunchy vegetables and lemon.',
    category: 'Vegan',
    calories: 390,
    protein: 14,
    carbs: 39,
    fat: 21,
    time: 10,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Chickpeas',
      'Avocado',
      'Tomato',
      'Cucumber',
      'Lemon juice',
    ],
    steps: [
      'Drain chickpeas.',
      'Chop vegetables.',
      'Combine all ingredients.',
      'Add lemon juice.',
      'Mix gently.',
    ],
  },
  {
    id: 'vegan-3',
    title: 'Vegan Buddha Rice',
    description:
      'Healthy rice bowl with roasted vegetables and creamy tahini.',
    category: 'Vegan',
    calories: 450,
    protein: 13,
    carbs: 67,
    fat: 15,
    time: 25,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Brown rice',
      'Broccoli',
      'Carrot',
      'Chickpeas',
      'Tahini',
    ],
    steps: [
      'Cook brown rice.',
      'Roast vegetables.',
      'Warm chickpeas.',
      'Add everything to a bowl.',
      'Drizzle with tahini.',
    ],
  },
  {
    id: 'vegan-4',
    title: 'Lentil Vegetable Soup',
    description:
      'Warm hearty lentil soup packed with vegetables.',
    category: 'Vegan',
    calories: 320,
    protein: 18,
    carbs: 48,
    fat: 6,
    time: 35,
    servings: 2,
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Lentils',
      'Carrot',
      'Onion',
      'Tomato',
      'Vegetable stock',
    ],
    steps: [
      'Chop the vegetables.',
      'Cook onion and carrot.',
      'Add lentils and stock.',
      'Add tomato.',
      'Simmer until lentils are tender.',
    ],
  },
  {
    id: 'vegan-5',
    title: 'Tofu Vegetable Bowl',
    description:
      'Crispy tofu with vegetables and a light soy dressing.',
    category: 'Vegan',
    calories: 410,
    protein: 25,
    carbs: 32,
    fat: 21,
    time: 20,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '150 g tofu',
      'Broccoli',
      'Carrot',
      'Bell pepper',
      'Soy sauce',
    ],
    steps: [
      'Cut tofu into cubes.',
      'Pan-fry tofu until golden.',
      'Cook vegetables.',
      'Combine tofu and vegetables.',
      'Add soy sauce.',
    ],
  },
  {
    id: 'vegan-6',
    title: 'Mediterranean Quinoa',
    description:
      'Quinoa with tomatoes, cucumber, herbs and olives.',
    category: 'Vegan',
    calories: 420,
    protein: 14,
    carbs: 56,
    fat: 16,
    time: 20,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Quinoa',
      'Tomato',
      'Cucumber',
      'Olives',
      'Parsley',
      'Lemon',
    ],
    steps: [
      'Cook quinoa.',
      'Chop vegetables.',
      'Mix all ingredients.',
      'Add lemon juice.',
      'Season and serve.',
    ],
  },

  // HIGH PROTEIN
  {
    id: 'protein-1',
    title: 'High Protein Chicken Bowl',
    description:
      'Lean chicken, rice and vegetables for a filling protein-rich meal.',
    category: 'High Protein',
    calories: 530,
    protein: 50,
    carbs: 51,
    fat: 13,
    time: 25,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '200 g chicken breast',
      '100 g rice',
      'Broccoli',
      'Carrot',
      'Greek yogurt',
    ],
    steps: [
      'Grill chicken.',
      'Cook rice.',
      'Steam vegetables.',
      'Add everything to a bowl.',
      'Serve with yogurt.',
    ],
  },
  {
    id: 'protein-2',
    title: 'Protein Egg Bowl',
    description:
      'Eggs, cottage cheese and vegetables for a protein-packed meal.',
    category: 'High Protein',
    calories: 390,
    protein: 35,
    carbs: 12,
    fat: 22,
    time: 12,
    servings: 1,
    image:
      'https://www.daisybeet.com/wp-content/uploads/2023/04/Cottage-Cheese-Breakfast-Bowls-8-728x910.jpg',
    ingredients: [
      '3 eggs',
      '100 g cottage cheese',
      'Spinach',
      'Tomato',
      'Black pepper',
    ],
    steps: [
      'Cook eggs.',
      'Add spinach and tomato.',
      'Add cottage cheese.',
      'Season with pepper.',
      'Serve warm.',
    ],
  },
  {
    id: 'protein-3',
    title: 'Greek Yogurt Protein Bowl',
    description:
      'Greek yogurt with berries, nuts and a touch of honey.',
    category: 'High Protein',
    calories: 360,
    protein: 28,
    carbs: 35,
    fat: 13,
    time: 5,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '250 g Greek yogurt',
      'Berries',
      'Almonds',
      '1 tsp honey',
    ],
    steps: [
      'Add yogurt to a bowl.',
      'Add berries.',
      'Add almonds.',
      'Drizzle with honey.',
      'Serve immediately.',
    ],
  },
  {
    id: 'protein-4',
    title: 'Tuna Protein Salad',
    description:
      'Tuna, eggs and fresh vegetables in a high-protein salad.',
    category: 'High Protein',
    calories: 410,
    protein: 43,
    carbs: 13,
    fat: 20,
    time: 10,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '1 can tuna',
      '2 boiled eggs',
      'Lettuce',
      'Cucumber',
      'Tomato',
    ],
    steps: [
      'Prepare the eggs.',
      'Drain tuna.',
      'Chop vegetables.',
      'Combine all ingredients.',
      'Season to taste.',
    ],
  },
  {
    id: 'protein-5',
    title: 'Chicken Protein Wrap',
    description:
      'Whole wheat wrap filled with chicken, vegetables and yogurt.',
    category: 'High Protein',
    calories: 440,
    protein: 42,
    carbs: 39,
    fat: 14,
    time: 12,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Whole wheat tortilla',
      '160 g chicken',
      'Lettuce',
      'Tomato',
      'Greek yogurt',
    ],
    steps: [
      'Cook chicken.',
      'Chop vegetables.',
      'Place everything on tortilla.',
      'Add yogurt.',
      'Roll tightly.',
    ],
  },
  {
    id: 'protein-6',
    title: 'Salmon Protein Plate',
    description:
      'Salmon with eggs and fresh vegetables for a nutrient-rich dinner.',
    category: 'High Protein',
    calories: 520,
    protein: 45,
    carbs: 14,
    fat: 31,
    time: 25,
    servings: 1,
    image:
      'https://res.cloudinary.com/hksqkdlah/image/upload/c_fill,dpr_2.0,f_auto,fl_lossy.progressive.strip_profile,g_faces:auto,q_auto:low/41765-sfs-grilled-salmon-10664',
    ingredients: [
      '150 g salmon',
      '2 eggs',
      'Broccoli',
      'Lemon',
    ],
    steps: [
      'Cook salmon.',
      'Boil or poach eggs.',
      'Steam broccoli.',
      'Serve together with lemon.',
    ],
  },

  // LOW FAT
  {
    id: 'lowfat-1',
    title: 'Lean Chicken Salad',
    description:
      'Fresh vegetables and lean chicken with a light lemon dressing.',
    category: 'Low Fat',
    calories: 300,
    protein: 36,
    carbs: 22,
    fat: 7,
    time: 15,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '150 g chicken breast',
      'Lettuce',
      'Cucumber',
      'Tomato',
      'Lemon juice',
    ],
    steps: [
      'Grill chicken.',
      'Chop vegetables.',
      'Slice chicken.',
      'Combine ingredients.',
      'Add lemon juice.',
    ],
  },
  {
    id: 'lowfat-2',
    title: 'Vegetable Soup',
    description:
      'Light vegetable soup made with fresh seasonal vegetables.',
    category: 'Low Fat',
    calories: 210,
    protein: 8,
    carbs: 35,
    fat: 4,
    time: 30,
    servings: 2,
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Carrot',
      'Celery',
      'Tomato',
      'Onion',
      'Vegetable stock',
    ],
    steps: [
      'Chop vegetables.',
      'Cook onion and carrot.',
      'Add remaining vegetables.',
      'Add stock.',
      'Simmer until vegetables are tender.',
    ],
  },
  {
    id: 'lowfat-3',
    title: 'Steamed Fish Plate',
    description:
      'Light white fish served with steamed vegetables and lemon.',
    category: 'Low Fat',
    calories: 280,
    protein: 35,
    carbs: 16,
    fat: 7,
    time: 20,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '180 g white fish',
      'Broccoli',
      'Carrot',
      'Lemon',
    ],
    steps: [
      'Season the fish.',
      'Steam until cooked.',
      'Steam vegetables.',
      'Serve with lemon.',
    ],
  },
  {
    id: 'lowfat-4',
    title: 'Chicken Vegetable Soup',
    description:
      'Warm chicken soup with plenty of vegetables and herbs.',
    category: 'Low Fat',
    calories: 270,
    protein: 31,
    carbs: 24,
    fat: 6,
    time: 30,
    servings: 2,
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Chicken breast',
      'Carrot',
      'Celery',
      'Onion',
      'Chicken stock',
    ],
    steps: [
      'Chop vegetables.',
      'Cook vegetables in stock.',
      'Add chicken.',
      'Simmer until chicken is fully cooked.',
      'Season and serve.',
    ],
  },
  {
    id: 'lowfat-5',
    title: 'Fresh Tuna Salad',
    description:
      'Light tuna salad with crisp vegetables and lemon.',
    category: 'Low Fat',
    calories: 260,
    protein: 30,
    carbs: 15,
    fat: 7,
    time: 10,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Tuna',
      'Lettuce',
      'Cucumber',
      'Tomato',
      'Lemon',
    ],
    steps: [
      'Drain tuna.',
      'Chop vegetables.',
      'Combine everything.',
      'Add lemon juice.',
      'Mix and serve.',
    ],
  },
  {
    id: 'lowfat-6',
    title: 'Grilled Chicken & Broccoli',
    description:
      'Simple lean chicken with steamed broccoli and herbs.',
    category: 'Low Fat',
    calories: 290,
    protein: 39,
    carbs: 15,
    fat: 7,
    time: 20,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '170 g chicken breast',
      'Broccoli',
      'Lemon',
      'Herbs',
    ],
    steps: [
      'Season chicken.',
      'Grill until fully cooked.',
      'Steam broccoli.',
      'Serve together with lemon.',
    ],
  },

  // SUGAR FREE
  {
    id: 'sugarfree-1',
    title: 'Egg & Avocado Plate',
    description:
      'Simple eggs and avocado with fresh vegetables and no added sugar.',
    category: 'Sugar Free',
    calories: 350,
    protein: 18,
    carbs: 14,
    fat: 27,
    time: 10,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '2 eggs',
      'Half avocado',
      'Tomato',
      'Cucumber',
      'Salt',
    ],
    steps: [
      'Cook the eggs.',
      'Slice avocado and vegetables.',
      'Arrange everything on a plate.',
      'Season lightly.',
    ],
  },
  {
    id: 'sugarfree-2',
    title: 'Chicken Avocado Salad',
    description:
      'Grilled chicken with avocado and vegetables without added sugar.',
    category: 'Sugar Free',
    calories: 430,
    protein: 39,
    carbs: 15,
    fat: 25,
    time: 15,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '150 g chicken',
      'Half avocado',
      'Lettuce',
      'Cucumber',
      'Lemon juice',
    ],
    steps: [
      'Grill chicken.',
      'Prepare vegetables.',
      'Slice chicken.',
      'Combine everything.',
      'Add lemon juice.',
    ],
  },
  {
    id: 'sugarfree-3',
    title: 'Salmon Vegetable Bowl',
    description:
      'Healthy salmon bowl with fresh vegetables and lemon.',
    category: 'Sugar Free',
    calories: 470,
    protein: 38,
    carbs: 16,
    fat: 28,
    time: 25,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '160 g salmon',
      'Broccoli',
      'Cucumber',
      'Avocado',
      'Lemon',
    ],
    steps: [
      'Cook salmon.',
      'Prepare vegetables.',
      'Slice avocado.',
      'Combine everything.',
      'Serve with lemon.',
    ],
  },
  {
    id: 'sugarfree-4',
    title: 'Turkey Lettuce Wraps',
    description:
      'Fresh lettuce wraps filled with turkey and crunchy vegetables.',
    category: 'Sugar Free',
    calories: 310,
    protein: 34,
    carbs: 13,
    fat: 13,
    time: 12,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '150 g turkey',
      'Lettuce leaves',
      'Cucumber',
      'Tomato',
      'Greek yogurt',
    ],
    steps: [
      'Cook turkey.',
      'Prepare lettuce leaves.',
      'Add vegetables and turkey.',
      'Add yogurt.',
      'Roll and serve.',
    ],
  },
  {
    id: 'sugarfree-5',
    title: 'Greek Salad',
    description:
      'Classic fresh salad with cucumber, tomato, olives and feta.',
    category: 'Sugar Free',
    calories: 330,
    protein: 11,
    carbs: 17,
    fat: 24,
    time: 10,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Tomato',
      'Cucumber',
      'Feta cheese',
      'Olives',
      'Lemon',
    ],
    steps: [
      'Chop vegetables.',
      'Add feta and olives.',
      'Add lemon juice.',
      'Mix gently.',
    ],
  },
  {
    id: 'sugarfree-6',
    title: 'Chicken Herb Plate',
    description:
      'Grilled chicken with herbs and fresh vegetables.',
    category: 'Sugar Free',
    calories: 320,
    protein: 40,
    carbs: 12,
    fat: 13,
    time: 20,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '170 g chicken',
      'Cucumber',
      'Tomato',
      'Fresh herbs',
      'Lemon',
    ],
    steps: [
      'Season chicken with herbs.',
      'Grill until cooked.',
      'Prepare vegetables.',
      'Serve with lemon.',
    ],
  },

  // QUICKLY PREPARED
  {
    id: 'quick-1',
    title: 'Quick Avocado Toast',
    description:
      'A delicious avocado toast ready in just a few minutes.',
    category: 'Quickly Prepared',
    calories: 320,
    protein: 10,
    carbs: 33,
    fat: 18,
    time: 5,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      '2 slices bread',
      '1 avocado',
      'Salt',
      'Pepper',
      'Chili flakes',
    ],
    steps: [
      'Toast bread.',
      'Mash avocado.',
      'Spread avocado on toast.',
      'Season and serve.',
    ],
  },
  {
    id: 'quick-2',
    title: 'Greek Yogurt Bowl',
    description:
      'Creamy yogurt with fruit and crunchy toppings.',
    category: 'Quickly Prepared',
    calories: 280,
    protein: 18,
    carbs: 35,
    fat: 8,
    time: 5,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Greek yogurt',
      'Berries',
      'Granola',
      'Honey',
    ],
    steps: [
      'Add yogurt to bowl.',
      'Add berries.',
      'Add granola.',
      'Drizzle with honey.',
    ],
  },
  {
    id: 'quick-3',
    title: 'Turkey Sandwich',
    description:
      'Fresh turkey sandwich with vegetables and whole grain bread.',
    category: 'Quickly Prepared',
    calories: 370,
    protein: 28,
    carbs: 41,
    fat: 11,
    time: 7,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Whole grain bread',
      'Turkey',
      'Lettuce',
      'Tomato',
      'Cucumber',
    ],
    steps: [
      'Prepare bread.',
      'Add turkey.',
      'Add vegetables.',
      'Close sandwich and serve.',
    ],
  },
  {
    id: 'quick-4',
    title: 'Tuna Toast',
    description:
      'Quick tuna toast with creamy avocado and fresh herbs.',
    category: 'Quickly Prepared',
    calories: 340,
    protein: 25,
    carbs: 28,
    fat: 15,
    time: 8,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Whole grain toast',
      'Tuna',
      'Avocado',
      'Lemon',
      'Herbs',
    ],
    steps: [
      'Toast bread.',
      'Mix tuna with lemon.',
      'Add avocado.',
      'Place tuna on toast.',
      'Finish with herbs.',
    ],
  },
  {
    id: 'quick-5',
    title: 'Fruit Smoothie Bowl',
    description:
      'Refreshing fruit smoothie bowl topped with berries and seeds.',
    category: 'Quickly Prepared',
    calories: 300,
    protein: 9,
    carbs: 48,
    fat: 8,
    time: 7,
    servings: 1,
    image:
      'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      'Banana',
      'Berries',
      'Greek yogurt',
      'Chia seeds',
    ],
    steps: [
      'Blend banana, berries and yogurt.',
      'Pour into a bowl.',
      'Top with chia seeds.',
      'Add fresh berries.',
    ],
  },
  {
    id: 'quick-6',
    title: 'Egg Breakfast Wrap',
    description:
      'Warm egg wrap with vegetables and cheese.',
    category: 'Quickly Prepared',
    calories: 390,
    protein: 22,
    carbs: 35,
    fat: 18,
    time: 10,
    servings: 1,
    image:
      'https://www.eatingwell.com/thmb/2CmeKYnsq9Xb_Omoy5ZTna-otWw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Make-Ahead-Freezer-Breakfast-Burrito-with-Eggs-Cheese-and-Spinach-v1-1x1-1-728845a38bf04b9190dfef98047dee1a.jpg',
    ingredients: [
      '1 tortilla',
      '2 eggs',
      'Tomato',
      'Spinach',
      'Cheese',
    ],
    steps: [
      'Cook the eggs.',
      'Warm tortilla.',
      'Add eggs and vegetables.',
      'Add cheese.',
      'Roll and serve.',
    ],
  },
]

/* =========================
   CATEGORY TRANSLATIONS
========================= */

const CATEGORY_LABELS = {
  uz: {
    Breakfast: 'Nonushta',
    Lunch: 'Tushlik',
    Dinner: 'Kechki ovqat',
    Vegan: 'Vegan',
    'High Protein': 'Yuqori protein',
    'Low Fat': 'Kam yog‘li',
    'Sugar Free': 'Shakarsiz',
    'Quickly Prepared': 'Tez tayyorlanadi',
  },
  ru: {
    Breakfast: 'Завтрак',
    Lunch: 'Обед',
    Dinner: 'Ужин',
    Vegan: 'Веган',
    'High Protein': 'Высокий белок',
    'Low Fat': 'Мало жира',
    'Sugar Free': 'Без сахара',
    'Quickly Prepared': 'Быстро готовится',
  },
  en: {
    Breakfast: 'Breakfast',
    Lunch: 'Lunch',
    Dinner: 'Dinner',
    Vegan: 'Vegan',
    'High Protein': 'High Protein',
    'Low Fat': 'Low Fat',
    'Sugar Free': 'Sugar Free',
    'Quickly Prepared': 'Quickly Prepared',
  },
} as const

/* =========================
   UI TRANSLATIONS
========================= */

const RECIPE_TRANSLATIONS = {
  uz: {
    title: 'Retseptlar',
    subtitle: 'Siz uchun foydali va mazali retseptlar',
    discover: 'Kashf qilish',
    favorites: 'Sevimlilarim',
    search: 'Retsept qidirish...',
    all: 'Barchasi',
    allCalories: 'Barcha kaloriyalar',
    under300: '300 kcal gacha',
    medium: '300–500 kcal',
    over500: '500 kcal dan yuqori',
    kcal: 'kcal',
    min: 'daq',
    servings: 'porsiya',
    ingredients: 'Masalliqlar',
    preparation: 'Tayyorlash',
    noResults: 'Retsept topilmadi',
    noFavorites: 'Hali sevimli retseptlar yo‘q',
    addFavorites:
      'Sevimlilarga qo‘shish uchun yurak belgisini bosing.',
    close: 'Yopish',
    protein: 'Protein',
    carbs: 'Uglevod',
    fat: 'Yog‘',
  },

  ru: {
    title: 'Рецепты',
    subtitle: 'Полезные и вкусные рецепты для вас',
    discover: 'Открыть',
    favorites: 'Избранное',
    search: 'Поиск рецепта...',
    all: 'Все',
    allCalories: 'Все калории',
    under300: 'До 300 kcal',
    medium: '300–500 kcal',
    over500: 'Более 500 kcal',
    kcal: 'kcal',
    min: 'мин',
    servings: 'порции',
    ingredients: 'Ингредиенты',
    preparation: 'Приготовление',
    noResults: 'Рецепты не найдены',
    noFavorites: 'Избранных рецептов пока нет',
    addFavorites:
      'Нажмите на сердце, чтобы добавить рецепт в избранное.',
    close: 'Закрыть',
    protein: 'Белок',
    carbs: 'Углеводы',
    fat: 'Жиры',
  },

  en: {
    title: 'Recipes',
    subtitle: 'Healthy and delicious recipes for you',
    discover: 'Discover',
    favorites: 'My Favorites',
    search: 'Search recipes...',
    all: 'All',
    allCalories: 'All calories',
    under300: 'Up to 300 kcal',
    medium: '300–500 kcal',
    over500: 'Over 500 kcal',
    kcal: 'kcal',
    min: 'min',
    servings: 'servings',
    ingredients: 'Ingredients',
    preparation: 'Preparation',
    noResults: 'No recipes found',
    noFavorites: 'No favorite recipes yet',
    addFavorites:
      'Tap the heart to add recipes to your favorites.',
    close: 'Close',
    protein: 'Protein',
    carbs: 'Carbs',
    fat: 'Fat',
  },
} as const

/* =========================
   RECIPE TEXT TRANSLATIONS
========================= */

const RECIPE_TEXT_TRANSLATIONS = {
  uz: {
    'breakfast-1': {
      title: 'Avokadoli tuxumli tost',
      description:
        'Qarsildoq butun donli tost ustida yumshoq avokado va mukammal pishirilgan tuxum.',
    },
    'breakfast-2': {
      title: 'Rezavor mevali yogurt',
      description:
        'Yangi rezavor mevalar, qaymoqli yogurt va qarsildoq granola bilan oddiy nonushta.',
    },
    'breakfast-3': {
      title: 'Bananli suli bo‘tqasi',
      description:
        'Banan va dolchin bilan tayyorlangan iliq va qaymoqli suli bo‘tqasi.',
    },
    'breakfast-4': {
      title: 'Sabzavotli omlet',
      description:
        'Rang-barang sabzavotlar va yangi ko‘katlar bilan tayyorlangan yumshoq tuxumli omlet.',
    },
    'breakfast-5': {
      title: 'Yeryong‘oq yog‘li bananli tost',
      description:
        'Butun donli non, yeryong‘oq yog‘i va yangi banan bo‘laklari bilan tost.',
    },
    'breakfast-6': {
      title: 'Nonushta pankeyklari',
      description:
        'Yangi mevalar bilan tortiladigan yumshoq uy pankeyklari.',
    },

    'lunch-1': {
      title: 'Grilda pishirilgan tovuqli bowl',
      description:
        'Guruch, sabzavotlar va yangi sous bilan tayyorlangan shirali gril tovuq.',
    },
    'lunch-2': {
      title: 'Tovuqli Sezar salati',
      description:
        'Qarsildoq salat barglari, gril tovuq, parmesan va qaymoqli sous.',
    },
    'lunch-3': {
      title: 'Lososli guruch bowl',
      description:
        'Yumshoq losos, guruch, bodring va avokado bilan tayyorlangan bowl.',
    },
    'lunch-4': {
      title: 'Kurka go‘shtli wrap',
      description:
        'Sabzavotlar va yengil yogurt sousi bilan tayyorlangan yangi kurka wrap.',
    },
    'lunch-5': {
      title: 'Kinoa va tovuqli salat',
      description:
        'Tovuq va rang-barang sabzavotlar bilan oqsilga boy kinoa salati.',
    },
    'lunch-6': {
      title: 'Tuna va avokadoli salat',
      description:
        'Qaymoqli avokado va qarsildoq sabzavotlar bilan yengil tuna salati.',
    },

    'dinner-1': {
      title: 'Grilda pishirilgan losos',
      description:
        'Sabzavotlar va limon bilan tortiladigan yumshoq gril losos.',
    },
    'dinner-2': {
      title: 'Sabzavotli tovuq',
      description:
        'Rang-barang mavsumiy sabzavotlar bilan tayyorlangan yumshoq tovuq go‘shti.',
    },
    'dinner-3': {
      title: 'Steyk va sabzavotlar',
      description:
        'Qovurilgan sabzavotlar bilan tortiladigan shirali mol go‘shti steyki.',
    },
    'dinner-4': {
      title: 'Tovuqli pasta',
      description:
        'Ko‘katlar va sabzavotlar bilan tayyorlangan qaymoqli uslubdagi tovuqli pasta.',
    },
    'dinner-5': {
      title: 'Kurka go‘shtli frikadelkalar',
      description:
        'Pomidor sousi va sabzavotlar bilan tortiladigan yumshoq kurka frikadelkalari.',
    },
    'dinner-6': {
      title: 'Sabzavotli stir-fry',
      description:
        'Yengil mazali sous bilan tezda qovurilgan rang-barang sabzavotlar.',
    },

    'vegan-1': {
      title: 'Vegan Buddha bowl',
      description:
        'No‘xat, sabzavotlar, don mahsulotlari va avokadodan tayyorlangan rang-barang bowl.',
    },
    'vegan-2': {
      title: 'Avokado va no‘xatli salat',
      description:
        'Qarsildoq sabzavotlar va limon bilan yangi no‘xat-avokado salati.',
    },
    'vegan-3': {
      title: 'Vegan guruch bowl',
      description:
        'Qovurilgan sabzavotlar va qaymoqli tahini bilan sog‘lom guruch bowl.',
    },
    'vegan-4': {
      title: 'Yasmiqli sabzavotli sho‘rva',
      description:
        'Sabzavotlarga boy iliq va to‘yimli yasmiq sho‘rvasi.',
    },
    'vegan-5': {
      title: 'Tofu va sabzavotli bowl',
      description:
        'Yengil soya sousi bilan qarsildoq tofu va sabzavotlar.',
    },
    'vegan-6': {
      title: 'O‘rta yer dengizi kinoyasi',
      description:
        'Pomidor, bodring, ko‘katlar va zaytun bilan tayyorlangan kinoa.',
    },

    'protein-1': {
      title: 'Yuqori proteinli tovuqli bowl',
      description:
        'To‘yimli va oqsilga boy taom uchun yog‘siz tovuq, guruch va sabzavotlar.',
    },
    'protein-2': {
      title: 'Proteinli tuxum bowl',
      description:
        'Oqsilga boy taom uchun tuxum, tvorog va sabzavotlar.',
    },
    'protein-3': {
      title: 'Yunon yogurti protein bowl',
      description:
        'Rezavor mevalar, yong‘oq va ozgina asal bilan yunon yogurti.',
    },
    'protein-4': {
      title: 'Proteinli tuna salati',
      description:
        'Tuna, tuxum va yangi sabzavotlardan tayyorlangan yuqori proteinli salat.',
    },
    'protein-5': {
      title: 'Proteinli tovuqli wrap',
      description:
        'Tovuq, sabzavotlar va yogurt bilan to‘ldirilgan butun donli wrap.',
    },
    'protein-6': {
      title: 'Proteinli losos likopchasi',
      description:
        'Oqsil va foydali ozuqalarga boy losos, tuxum va yangi sabzavotlar.',
    },

    'lowfat-1': {
      title: 'Yog‘siz tovuqli salat',
      description:
        'Yangi sabzavotlar va limonli yengil sous bilan yog‘siz tovuq.',
    },
    'lowfat-2': {
      title: 'Sabzavotli sho‘rva',
      description:
        'Yangi mavsumiy sabzavotlardan tayyorlangan yengil sho‘rva.',
    },
    'lowfat-3': {
      title: 'Bug‘da pishirilgan baliq',
      description:
        'Bug‘da pishirilgan sabzavotlar va limon bilan yengil oq baliq.',
    },
    'lowfat-4': {
      title: 'Tovuqli sabzavotli sho‘rva',
      description:
        'Ko‘plab sabzavotlar va ko‘katlar bilan iliq tovuq sho‘rvasi.',
    },
    'lowfat-5': {
      title: 'Yangi tuna salati',
      description:
        'Qarsildoq sabzavotlar va limon bilan yengil tuna salati.',
    },
    'lowfat-6': {
      title: 'Gril tovuq va brokkoli',
      description:
        'Bug‘da pishirilgan brokkoli va ko‘katlar bilan oddiy yog‘siz tovuq.',
    },

    'sugarfree-1': {
      title: 'Tuxum va avokado likopchasi',
      description:
        'Yangi sabzavotlar bilan oddiy tuxum va avokado, qo‘shimcha shakarsiz.',
    },
    'sugarfree-2': {
      title: 'Tovuqli avokado salati',
      description:
        'Avokado va sabzavotlar bilan qo‘shimcha shakarsiz gril tovuq salati.',
    },
    'sugarfree-3': {
      title: 'Losos va sabzavotli bowl',
      description:
        'Yangi sabzavotlar va limon bilan sog‘lom losos bowl.',
    },
    'sugarfree-4': {
      title: 'Kurka go‘shtli salat wrap',
      description:
        'Kurka go‘shti va qarsildoq sabzavotlar bilan yangi salat bargli wrap.',
    },
    'sugarfree-5': {
      title: 'Yunon salati',
      description:
        'Bodring, pomidor, zaytun va fetadan tayyorlangan klassik yangi salat.',
    },
    'sugarfree-6': {
      title: 'Tovuqli ko‘katli likopcha',
      description:
        'Ko‘katlar va yangi sabzavotlar bilan grilda pishirilgan tovuq.',
    },

    'quick-1': {
      title: 'Tez avokadoli tost',
      description:
        'Bir necha daqiqada tayyor bo‘ladigan mazali avokadoli tost.',
    },
    'quick-2': {
      title: 'Yunon yogurti bowl',
      description:
        'Mevalar va qarsildoq qo‘shimchalar bilan qaymoqli yogurt.',
    },
    'quick-3': {
      title: 'Kurka go‘shtli sendvich',
      description:
        'Butun donli non, kurka go‘shti va sabzavotlardan tayyorlangan yangi sendvich.',
    },
    'quick-4': {
      title: 'Tuna tost',
      description:
        'Qaymoqli avokado va yangi ko‘katlar bilan tez tayyorlanadigan tuna tost.',
    },
    'quick-5': {
      title: 'Mevali smoothie bowl',
      description:
        'Rezavor mevalar va urug‘lar bilan bezatilgan tetiklashtiruvchi smoothie bowl.',
    },
    'quick-6': {
      title: 'Tuxumli nonushta wrap',
      description:
        'Sabzavotlar va pishloq bilan iliq tuxumli wrap.',
    },
  },

  ru: {
    'breakfast-1': {
      title: 'Тост с авокадо и яйцом',
      description:
        'Кремовое авокадо и идеально приготовленное яйцо на хрустящем цельнозерновом тосте.',
    },
    'breakfast-2': {
      title: 'Йогурт с ягодами',
      description:
        'Свежие ягоды, кремовый йогурт и хрустящая гранола для простого завтрака.',
    },
    'breakfast-3': {
      title: 'Овсянка с бананом',
      description:
        'Тёплая кремовая овсянка с бананом и корицей.',
    },
    'breakfast-4': {
      title: 'Овощной омлет',
      description:
        'Пышный омлет с разноцветными овощами и свежей зеленью.',
    },
    'breakfast-5': {
      title: 'Тост с арахисовой пастой и бананом',
      description:
        'Цельнозерновой тост с арахисовой пастой и свежими ломтиками банана.',
    },
    'breakfast-6': {
      title: 'Блины на завтрак',
      description:
        'Мягкие домашние блины со свежими фруктами.',
    },

    'lunch-1': {
      title: 'Боул с курицей на гриле',
      description:
        'Сочная курица на гриле с рисом, овощами и свежей заправкой.',
    },
    'lunch-2': {
      title: 'Салат Цезарь с курицей',
      description:
        'Хрустящий салат, курица на гриле и пармезан с кремовой заправкой.',
    },
    'lunch-3': {
      title: 'Боул с лососем и рисом',
      description:
        'Нежный лосось с рисом, огурцом и авокадо.',
    },
    'lunch-4': {
      title: 'Врап с индейкой',
      description:
        'Свежий врап с индейкой, овощами и лёгким йогуртовым соусом.',
    },
    'lunch-5': {
      title: 'Салат с киноа и курицей',
      description:
        'Белковый салат с киноа, курицей и разноцветными овощами.',
    },
    'lunch-6': {
      title: 'Салат с тунцом и авокадо',
      description:
        'Лёгкий салат с тунцом, кремовым авокадо и хрустящими овощами.',
    },

    'dinner-1': {
      title: 'Лосось на гриле',
      description:
        'Нежный лосось на гриле с овощами и лимоном.',
    },
    'dinner-2': {
      title: 'Курица с овощами',
      description:
        'Нежная куриная грудка с разноцветными сезонными овощами.',
    },
    'dinner-3': {
      title: 'Стейк с овощами',
      description:
        'Сочный стейк из говядины с запечёнными овощами.',
    },
    'dinner-4': {
      title: 'Паста с курицей',
      description:
        'Паста с курицей, травами и овощами в кремовом стиле.',
    },
    'dinner-5': {
      title: 'Фрикадельки из индейки',
      description:
        'Нежные фрикадельки из индейки с томатным соусом и овощами.',
    },
    'dinner-6': {
      title: 'Овощи стир-фрай',
      description:
        'Разноцветные овощи, быстро обжаренные с лёгким пикантным соусом.',
    },

    'vegan-1': {
      title: 'Веганский Buddha bowl',
      description:
        'Яркий боул с нутом, овощами, крупами и авокадо.',
    },
    'vegan-2': {
      title: 'Салат с авокадо и нутом',
      description:
        'Свежий нут и авокадо с хрустящими овощами и лимоном.',
    },
    'vegan-3': {
      title: 'Веганский боул с рисом',
      description:
        'Полезный рисовый боул с запечёнными овощами и кремовым тахини.',
    },
    'vegan-4': {
      title: 'Чечевичный овощной суп',
      description:
        'Тёплый сытный чечевичный суп с большим количеством овощей.',
    },
    'vegan-5': {
      title: 'Боул с тофу и овощами',
      description:
        'Хрустящий тофу с овощами и лёгкой соевой заправкой.',
    },
    'vegan-6': {
      title: 'Средиземноморская киноа',
      description:
        'Киноа с помидорами, огурцом, зеленью и оливками.',
    },

    'protein-1': {
      title: 'Белковый боул с курицей',
      description:
        'Нежирная курица, рис и овощи для сытного белкового блюда.',
    },
    'protein-2': {
      title: 'Белковый боул с яйцами',
      description:
        'Яйца, творог и овощи для богатого белком блюда.',
    },
    'protein-3': {
      title: 'Протеиновый боул с греческим йогуртом',
      description:
        'Греческий йогурт с ягодами, орехами и небольшим количеством мёда.',
    },
    'protein-4': {
      title: 'Белковый салат с тунцом',
      description:
        'Тунец, яйца и свежие овощи в белковом салате.',
    },
    'protein-5': {
      title: 'Белковый врап с курицей',
      description:
        'Цельнозерновой врап с курицей, овощами и йогуртом.',
    },
    'protein-6': {
      title: 'Белковая тарелка с лососем',
      description:
        'Лосось, яйца и свежие овощи для питательного ужина.',
    },

    'lowfat-1': {
      title: 'Салат с нежирной курицей',
      description:
        'Свежие овощи и нежирная курица с лёгкой лимонной заправкой.',
    },
    'lowfat-2': {
      title: 'Овощной суп',
      description:
        'Лёгкий овощной суп из свежих сезонных овощей.',
    },
    'lowfat-3': {
      title: 'Рыба на пару',
      description:
        'Нежная белая рыба с овощами на пару и лимоном.',
    },
    'lowfat-4': {
      title: 'Куриный овощной суп',
      description:
        'Тёплый куриный суп с большим количеством овощей и зелени.',
    },
    'lowfat-5': {
      title: 'Свежий салат с тунцом',
      description:
        'Лёгкий салат с тунцом, хрустящими овощами и лимоном.',
    },
    'lowfat-6': {
      title: 'Курица на гриле с брокколи',
      description:
        'Простая нежирная курица с брокколи на пару и зеленью.',
    },

    'sugarfree-1': {
      title: 'Тарелка с яйцами и авокадо',
      description:
        'Простые яйца и авокадо со свежими овощами без добавленного сахара.',
    },
    'sugarfree-2': {
      title: 'Салат с курицей и авокадо',
      description:
        'Курица на гриле с авокадо и овощами без добавленного сахара.',
    },
    'sugarfree-3': {
      title: 'Боул с лососем и овощами',
      description:
        'Полезный боул с лососем, свежими овощами и лимоном.',
    },
    'sugarfree-4': {
      title: 'Листовые врапы с индейкой',
      description:
        'Свежие листья салата с индейкой и хрустящими овощами.',
    },
    'sugarfree-5': {
      title: 'Греческий салат',
      description:
        'Классический свежий салат с огурцом, помидорами, оливками и фетой.',
    },
    'sugarfree-6': {
      title: 'Тарелка с курицей и зеленью',
      description:
        'Курица на гриле с зеленью и свежими овощами.',
    },

    'quick-1': {
      title: 'Быстрый тост с авокадо',
      description:
        'Вкусный тост с авокадо, который готовится всего за несколько минут.',
    },
    'quick-2': {
      title: 'Боул с греческим йогуртом',
      description:
        'Кремовый йогурт с фруктами и хрустящими добавками.',
    },
    'quick-3': {
      title: 'Сэндвич с индейкой',
      description:
        'Свежий сэндвич с индейкой, овощами и цельнозерновым хлебом.',
    },
    'quick-4': {
      title: 'Тост с тунцом',
      description:
        'Быстрый тост с тунцом, кремовым авокадо и свежей зеленью.',
    },
    'quick-5': {
      title: 'Фруктовый smoothie bowl',
      description:
        'Освежающий фруктовый боул с ягодами и семенами.',
    },
    'quick-6': {
      title: 'Яичный врап на завтрак',
      description:
        'Тёплый яичный врап с овощами и сыром.',
    },
  },
} as const

type CalorieFilter =
  | 'all'
  | 'under300'
  | 'medium'
  | 'over500'

const CATEGORIES: RecipeCategory[] = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Vegan',
  'High Protein',
  'Low Fat',
  'Sugar Free',
  'Quickly Prepared',
]

type RecipeText = {
  title: string
  description: string
}

export default function Recipes() {
  const { language } = useLanguage()

  const lang =
    language === 'uz' || language === 'ru'
      ? language
      : 'en'

  const copy = RECIPE_TRANSLATIONS[lang]
  const categoryLabels = CATEGORY_LABELS[lang]

  const [activeCategory, setActiveCategory] =
    useState<RecipeCategory | 'All'>('All')

  const [activeTab, setActiveTab] = useState<
    'discover' | 'favorites'
  >('discover')

  const [search, setSearch] = useState('')

  const [calorieFilter, setCalorieFilter] =
    useState<CalorieFilter>('all')

  const [favorites, setFavorites] = useState<string[]>([])

  const [selectedRecipe, setSelectedRecipe] =
    useState<Recipe | null>(null)

  const getRecipeTitle = (recipe: Recipe) => {
    if (lang === 'uz') {
      const item = (
        RECIPE_TEXT_TRANSLATIONS.uz as Record<
          string,
          RecipeText
        >
      )[recipe.id]

      return item?.title ?? recipe.title
    }

    if (lang === 'ru') {
      const item = (
        RECIPE_TEXT_TRANSLATIONS.ru as Record<
          string,
          RecipeText
        >
      )[recipe.id]

      return item?.title ?? recipe.title
    }

    return recipe.title
  }

  const getRecipeDescription = (recipe: Recipe) => {
    if (lang === 'uz') {
      const item = (
        RECIPE_TEXT_TRANSLATIONS.uz as Record<
          string,
          RecipeText
        >
      )[recipe.id]

      return item?.description ?? recipe.description
    }

    if (lang === 'ru') {
      const item = (
        RECIPE_TEXT_TRANSLATIONS.ru as Record<
          string,
          RecipeText
        >
      )[recipe.id]

      return item?.description ?? recipe.description
    }

    return recipe.description
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        'intizom-ai-recipe-favorites',
      )

      if (saved) {
        const parsed = JSON.parse(saved)

        if (Array.isArray(parsed)) {
          setFavorites(parsed)
        }
      }
    } catch {
      setFavorites([])
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(
        'intizom-ai-recipe-favorites',
        JSON.stringify(favorites),
      )
    } catch {
      // localStorage unavailable
    }
  }, [favorites])

  const toggleFavorite = (
    id: string,
    event?: MouseEvent<HTMLButtonElement>,
  ) => {
    event?.stopPropagation()

    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const filteredRecipes = useMemo(() => {
    const query = search.trim().toLowerCase()

    return RECIPES.filter((recipe) => {
      const categoryMatch =
        activeCategory === 'All' ||
        recipe.category === activeCategory

      const favoriteMatch =
        activeTab === 'discover' ||
        favorites.includes(recipe.id)

      const title = getRecipeTitle(recipe)
      const description = getRecipeDescription(recipe)

      const searchMatch =
        !query ||
        title.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        recipe.category.toLowerCase().includes(query)

      let calorieMatch = true

      if (calorieFilter === 'under300') {
        calorieMatch = recipe.calories <= 300
      }

      if (calorieFilter === 'medium') {
        calorieMatch =
          recipe.calories > 300 &&
          recipe.calories <= 500
      }

      if (calorieFilter === 'over500') {
        calorieMatch = recipe.calories > 500
      }

      return (
        categoryMatch &&
        favoriteMatch &&
        searchMatch &&
        calorieMatch
      )
    })
  }, [
    activeCategory,
    activeTab,
    search,
    calorieFilter,
    favorites,
    lang,
  ])

  return (
    <main className="min-h-screen w-full bg-white text-slate-900 !m-0 !p-0">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {copy.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {copy.subtitle}
              </p>
            </div>

            {/* DISCOVER / FAVORITES */}
            <div className="flex w-full rounded-xl border border-slate-200 bg-slate-50 p-1 sm:w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('discover')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
                  activeTab === 'discover'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Search size={17} />
                {copy.discover}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
                  activeTab === 'favorites'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Heart
                  size={17}
                  fill={
                    activeTab === 'favorites'
                      ? 'currentColor'
                      : 'none'
                  }
                />
                {copy.favorites}
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH + CALORIE */}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={copy.search}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="relative lg:w-[220px]">
            <Flame
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={calorieFilter}
              onChange={(event) =>
                setCalorieFilter(
                  event.target.value as CalorieFilter,
                )
              }
              className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">
                {copy.allCalories}
              </option>

              <option value="under300">
                {copy.under300}
              </option>

              <option value="medium">
                {copy.medium}
              </option>

              <option value="over500">
                {copy.over500}
              </option>
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeCategory === 'All'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {copy.all}
            </button>

            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        {/* RECIPE GRID */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredRecipes.map((recipe) => {
              const isFavorite = favorites.includes(recipe.id)

              return (
                <article
                  key={recipe.id}
                  onClick={() =>
                    setSelectedRecipe(recipe)
                  }
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={recipe.image}
                      alt={getRecipeTitle(recipe)}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                      {categoryLabels[recipe.category]}
                    </div>

                    <button
                      type="button"
                      aria-label={
                        isFavorite
                          ? 'Remove from favorites'
                          : 'Add to favorites'
                      }
                      onClick={(event) =>
                        toggleFavorite(recipe.id, event)
                      }
                      className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 ${
                        isFavorite
                          ? 'text-red-500'
                          : 'text-slate-600'
                      }`}
                    >
                      <Heart
                        size={19}
                        fill={
                          isFavorite
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">
                      {getRecipeTitle(recipe)}
                    </h2>

                    <p className="mt-1.5 line-clamp-2 min-h-[42px] text-sm leading-5 text-slate-500">
                      {getRecipeDescription(recipe)}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock size={16} />

                        <span>
                          {recipe.time} {copy.min}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                        <Flame size={16} />

                        <span>
                          {recipe.calories} {copy.kcal}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Users size={16} />

                        <span>
                          {recipe.servings}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
              <Search
                size={23}
                className="text-slate-400"
              />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              {activeTab === 'favorites'
                ? copy.noFavorites
                : copy.noResults}
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              {activeTab === 'favorites'
                ? copy.addFavorites
                : lang === 'uz'
                  ? 'Qidiruv yoki filtrlarni o‘zgartirib ko‘ring.'
                  : lang === 'ru'
                    ? 'Попробуйте изменить поиск или фильтры.'
                    : 'Try changing your search or filters.'}
            </p>
          </div>
        )}
      </div>

      {/* RECIPE MODAL */}
      {selectedRecipe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL IMAGE */}
            <div className="relative aspect-[16/8] overflow-hidden">
              <img
                src={selectedRecipe.image}
                alt={getRecipeTitle(selectedRecipe)}
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                aria-label={copy.close}
                onClick={() =>
                  setSelectedRecipe(null)
                }
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition hover:bg-white"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow">
                {categoryLabels[
                  selectedRecipe.category
                ]}
              </div>
            </div>

            <div className="p-5 sm:p-7">
              {/* TITLE */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {getRecipeTitle(selectedRecipe)}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    {getRecipeDescription(selectedRecipe)}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={
                    favorites.includes(selectedRecipe.id)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                  onClick={() =>
                    toggleFavorite(
                      selectedRecipe.id,
                    )
                  }
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition ${
                    favorites.includes(
                      selectedRecipe.id,
                    )
                      ? 'border-red-100 bg-red-50 text-red-500'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-red-500'
                  }`}
                >
                  <Heart
                    size={20}
                    fill={
                      favorites.includes(
                        selectedRecipe.id,
                      )
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                </button>
              </div>

              {/* STATS */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">
                    {copy.kcal}
                  </div>

                  <div className="mt-1 font-semibold text-slate-900">
                    {selectedRecipe.calories}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">
                    {copy.protein}
                  </div>

                  <div className="mt-1 font-semibold text-slate-900">
                    {selectedRecipe.protein} g
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">
                    {copy.carbs}
                  </div>

                  <div className="mt-1 font-semibold text-slate-900">
                    {selectedRecipe.carbs} g
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">
                    {copy.fat}
                  </div>

                  <div className="mt-1 font-semibold text-slate-900">
                    {selectedRecipe.fat} g
                  </div>
                </div>
              </div>

              {/* INGREDIENTS + STEPS */}
              <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                <section>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {copy.ingredients}
                  </h3>

                  <ul className="mt-4 space-y-3">
                    {selectedRecipe.ingredients.map(
                      (ingredient, index) => (
                        <li
                          key={`${ingredient}-${index}`}
                          className="flex items-start gap-3 text-sm text-slate-600"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />

                          <span>{ingredient}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {copy.preparation}
                  </h3>

                  <ol className="mt-4 space-y-4">
                    {selectedRecipe.steps.map(
                      (step, index) => (
                        <li
                          key={`${step}-${index}`}
                          className="flex gap-3"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                            {index + 1}
                          </span>

                          <p className="pt-1 text-sm leading-6 text-slate-600">
                            {step}
                          </p>
                        </li>
                      ),
                    )}
                  </ol>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}