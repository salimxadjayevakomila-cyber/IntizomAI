 'use client'

import React, { useMemo, useState, useEffect } from 'react'
import {
  Bookmark,
  ChefHat,
  Clock,
  Flame,
  Search,
  Users,
  X,
} from 'lucide-react'

export type RecipeCategory = 'Low Carb' | 'High Protein' | 'Uzbek Fit Meals' | 'Quick Snacks'

export interface Recipe {
  id: string
  name: string
  category: RecipeCategory
  calories: number
  protein: number
  carbs: number
  fat: number
  time: number
  servings: number
  emoji: string
  steps: string[]
}

export const RECIPES: Recipe[] = [
  {
    id: '1', name: 'Grilled Chicken Salad', category: 'Low Carb', calories: 340, protein: 38, carbs: 12, fat: 16, time: 20, servings: 1, emoji: '🥗',
    steps: ['Season chicken breast with salt, pepper, and olive oil.', 'Grill on medium heat for 6–7 minutes per side.', 'Chop romaine, cherry tomatoes, and cucumber.', 'Slice grilled chicken and toss with vegetables.', 'Drizzle with lemon vinaigrette and serve.'],
  },
  {
    id: '2', name: 'Beef Shashlik (Fit)', category: 'Uzbek Fit Meals', calories: 420, protein: 42, carbs: 8, fat: 24, time: 35, servings: 2, emoji: '🍢',
    steps: ['Cut lean beef into 2 cm cubes.', 'Marinate with onion, vinegar, salt, and black pepper for 2 hours.', 'Thread onto skewers alternating with onion rings.', 'Grill over charcoal 10–12 minutes, turning regularly.', 'Serve with achichuk salad — no bread.'],
  },
  {
    id: '3', name: 'Greek Yogurt Parfait', category: 'Quick Snacks', calories: 220, protein: 18, carbs: 24, fat: 6, time: 5, servings: 1, emoji: '🥣',
    steps: ['Add 200g Greek yogurt to a bowl.', 'Layer with mixed berries and a drizzle of honey.', 'Top with a tablespoon of crushed walnuts.', 'Serve immediately.'],
  },
  {
    id: '4', name: 'Salmon & Avocado Bowl', category: 'High Protein', calories: 480, protein: 36, carbs: 22, fat: 26, time: 25, servings: 1, emoji: '🍣',
    steps: ['Pan-sear salmon fillet 4 minutes skin-side down.', 'Flip and cook 3 more minutes; rest for 2 minutes.', 'Cook quinoa per package instructions.', 'Slice avocado and arrange over quinoa.', 'Flake salmon over the bowl and drizzle with soy-ginger sauce.'],
  },
  {
    id: '5', name: 'Mung Bean Soup (Mash)', category: 'Uzbek Fit Meals', calories: 310, protein: 18, carbs: 38, fat: 8, time: 40, servings: 3, emoji: '🍲',
    steps: ['Rinse 200g mung beans and soak for 30 minutes.', 'Sauté diced onion and carrot in olive oil.', 'Add beans, 1.5L water, and bring to a boil.', 'Simmer 25 minutes until beans are tender.', 'Season with cumin, coriander, and salt. Serve hot.'],
  },
  {
    id: '6', name: 'Protein Smoothie', category: 'Quick Snacks', calories: 280, protein: 30, carbs: 20, fat: 7, time: 5, servings: 1, emoji: '🥤',
    steps: ['Add 1 scoop whey protein to a blender.', 'Add 1 banana, 200ml almond milk, and a handful of spinach.', 'Blend until smooth.', 'Pour over ice and enjoy.'],
  },
  {
    id: '7', name: 'Turkey Lettuce Wraps', category: 'Low Carb', calories: 290, protein: 32, carbs: 6, fat: 15, time: 15, servings: 1, emoji: '🥬',
    steps: ['Brown ground turkey in a skillet with garlic and ginger.', 'Add a splash of soy sauce and sesame oil.', 'Spoon mixture into romaine lettuce leaves.', 'Top with shredded carrot and green onion.'],
  },
  {
    id: '8', name: 'Egg & Avocado Toast (Fit)', category: 'High Protein', calories: 360, protein: 22, carbs: 28, fat: 18, time: 10, servings: 1, emoji: '🍳',
    steps: ['Toast 1 slice of whole-grain bread.', 'Mash half an avocado on top.', 'Fry one egg sunny-side up and place on avocado.', 'Season with salt, pepper, and chili flakes.'],
  },
]

export const CATEGORIES = ['All', 'Low Carb', 'High Protein', 'Uzbek Fit Meals', 'Quick Snacks'] as const
export type CategoryFilter = (typeof CATEGORIES)[number]

interface RecipeCardProps {
  recipe: Recipe
  isFavorite: boolean
  onSelect: (recipe: Recipe) => void
  onToggleFav: (id: string, e: React.MouseEvent) => void
}

export function RecipeCard({ recipe, isFavorite, onSelect, onToggleFav }: RecipeCardProps) {
  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] shadow-[0_0_30px_rgba(16,185,129,0.08)] transition hover:-translate-y-0.5 hover:border-emerald-700/60"
      onClick={() => onSelect(recipe)}
    >
      <div className="relative flex h-36 items-center justify-center bg-slate-800/40 text-6xl">
        {recipe.emoji}
        <button
          onClick={(e) => onToggleFav(recipe.id, e)}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 transition hover:text-emerald-300"
          aria-label="Toggle favorite"
        >
          <Bookmark className={`size-4 ${isFavorite ? 'fill-emerald-400 text-emerald-400' : ''}`} />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
          {recipe.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white">{recipe.name}</h3>
        <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1"><Clock className="size-3" /> {recipe.time} min</span>
          <span className="flex items-center gap-1"><Flame className="size-3" /> {recipe.calories} kcal</span>
          <span className="flex items-center gap-1"><Users className="size-3" /> {recipe.servings}</span>
        </div>
        <div className="mt-3 flex gap-2 border-t border-slate-800 pt-3 text-[10px] font-medium">
          <span className="text-emerald-300">P {recipe.protein}g</span>
          <span className="text-sky-300">C {recipe.carbs}g</span>
          <span className="text-amber-300">F {recipe.fat}g</span>
        </div>
      </div>
    </article>
  )
}

interface RecipeModalProps {
  recipe: Recipe
  isFavorite: boolean
  onClose: () => void
  onToggleFav: (id: string) => void
}

export function RecipeModal({ recipe, isFavorite, onClose, onToggleFav }: RecipeModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] shadow-2xl">
        <div className="relative flex h-32 items-center justify-center bg-slate-800/40 text-6xl">
          {recipe.emoji}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 transition hover:text-white"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6">
          <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            {recipe.category}
          </span>
          <h2 className="mt-3 text-xl font-semibold text-white">{recipe.name}</h2>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <div className="rounded-lg bg-slate-800/50 p-3">
              <p className="text-lg font-semibold text-white">{recipe.calories}</p>
              <p className="text-[10px] text-slate-500">kcal</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-3">
              <p className="text-lg font-semibold text-emerald-300">{recipe.protein}g</p>
              <p className="text-[10px] text-slate-500">protein</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-3">
              <p className="text-lg font-semibold text-sky-300">{recipe.carbs}g</p>
              <p className="text-[10px] text-slate-500">carbs</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-3">
              <p className="text-lg font-semibold text-amber-300">{recipe.fat}g</p>
              <p className="text-[10px] text-slate-500">fat</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock className="size-3.5 text-emerald-400" /> {recipe.time} minutes</span>
            <span className="flex items-center gap-1"><Users className="size-3.5 text-emerald-400" /> {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
          </div>
          <div className="mt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Instructions</p>
            <ol className="flex flex-col gap-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-bold text-emerald-300">
                    {i + 1}
                  </span>
                  <span className="leading-6">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <button
            onClick={() => onToggleFav(recipe.id)}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isFavorite
                ? 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30'
                : 'bg-emerald-400 text-slate-950 shadow-[0_0_16px_rgba(52,211,153,0.2)] hover:bg-emerald-300'
            }`}
          >
            <Bookmark className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Saved to favorites' : 'Add to favorites'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Recipes() {
  const [active, setActive] = useState<CategoryFilter>('All')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['2']))
  const [selected, setSelected] = useState<Recipe | null>(null)

  const filtered = useMemo(() => {
    return RECIPES.filter(
      (r) =>
        (active === 'All' || r.category === active) &&
        r.name.toLowerCase().includes(query.toLowerCase()),
    )
  }, [active, query])

  const toggleFav = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-[1080px]">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            <ChefHat className="size-3.5" /> Healthy recipes
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">Recipes</h1>
          <p className="mt-2 text-sm text-slate-400">Find nutritious meals with full macro breakdowns and instructions.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-300">
          <Bookmark className="size-4 fill-emerald-400 text-emerald-400" />
          {favorites.size} favorites
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>

      {/* Category tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 p-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              active === cat ? 'bg-emerald-400/15 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.1)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={favorites.has(recipe.id)}
            onSelect={(r) => setSelected(r)}
            onToggleFav={(id, e) => toggleFav(id, e)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
          No recipes found. Try a different search or category.
        </div>
      )}

      {/* Recipe detail modal */}
      {selected && (
        <RecipeModal
          recipe={selected}
          isFavorite={favorites.has(selected.id)}
          onClose={() => setSelected(null)}
          onToggleFav={(id) => toggleFav(id)}
        />
      )}
    </div>
  )
}