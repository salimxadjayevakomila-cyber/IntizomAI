 'use client'

import { useState } from 'react'
import {
  Activity,
  Check,
  ChevronDown,
  Droplets,
  Flame,
  Footprints,
  Minus,
  Pencil,
  Plus,
  Save,
  Scale,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'

import { useLanguage } from '@/contexts/language-context'

type Goals = {
  currentWeight: number
  goalWeight: number
  startWeight: number
  calories: number
  protein: number
  carbs: number
  fat: number
  steps: number
  water: number
}

const defaultGoals: Goals = {
  currentWeight: 74.2,
  goalWeight: 68,
  startWeight: 82,
  calories: 2000,
  protein: 140,
  carbs: 220,
  fat: 65,
  steps: 10000,
  water: 2.5,
}

function MacroBar({
  label,
  value,
  unit,
  max,
  color,
  glow,
}: {
  label: string
  value: number
  unit: string
  max: number
  color: string
  glow: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm text-slate-400">
          <strong className="text-white">{value}</strong>
          <span className="ml-0.5 text-slate-500">{unit}</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%`, boxShadow: `0 0 12px ${glow}` }}
        />
      </div>
    </div>
  )
}

function Stepper({
  value,
  onChange,
  step,
  min,
  max,
  suffix,
}: {
  value: number
  onChange: (v: number) => void
  step: number
  min: number
  max: number
  suffix: string
}) {
  const clamp = (v: number) => {
    const clampedValue = Math.min(Math.max(v, min), max)
    return Number(clampedValue.toFixed(1))
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(clamp(value - step))}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-emerald-400/50 hover:text-emerald-300"
        aria-label="Decrease"
      >
        <Minus className="size-4" />
      </button>
      <div className="flex min-w-[90px] items-baseline justify-center gap-1 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2">
        <span className="text-lg font-semibold text-white">{value.toLocaleString()}</span>
        <span className="text-xs text-slate-500">{suffix}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(clamp(value + step))}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-emerald-400/50 hover:text-emerald-300"
        aria-label="Increase"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}

export default function GoalsSection() {
  const { t } = useLanguage()
  const [goals, setGoals] = useState<Goals>(defaultGoals)
  const [draft, setDraft] = useState<Goals>(defaultGoals)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const weightLost = draft.startWeight - draft.currentWeight
  const totalToLose = draft.startWeight - draft.goalWeight
  const weightPct = totalToLose > 0 ? Math.min((weightLost / totalToLose) * 100, 100) : 0
  const remaining = Math.max(draft.currentWeight - draft.goalWeight, 0)

  const update = <K extends keyof Goals>(key: K, value: Goals[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const save = () => {
    setGoals(draft)
    setEditing(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  const cancel = () => {
    setDraft(goals)
    setEditing(false)
  }

  const MACROS = [
    {
      key: 'protein' as const,
      label: t('goals.protein'),
      unit: 'g',
      max: 200,
      color: 'bg-emerald-400',
      glow: 'rgba(52,211,153,0.4)',
    },
    {
      key: 'carbs' as const,
      label: t('goals.carbs'),
      unit: 'g',
      max: 300,
      color: 'bg-sky-400',
      glow: 'rgba(56,189,248,0.4)',
    },
    {
      key: 'fat' as const,
      label: t('goals.fat'),
      unit: 'g',
      max: 100,
      color: 'bg-amber-400',
      glow: 'rgba(251,191,36,0.4)',
    },
  ]

  return (
    <div className="mx-auto max-w-[1080px]">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            <Target className="size-3.5" /> {t('goals.badge')}
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">
            {t('goals.title')}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {t('goals.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-300 transition">
              <Check className="size-3.5" /> {t('goals.saved')}
            </span>
          )}
          {editing ? (
            <>
              <button
                type="button"
                onClick={cancel}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                {t('goals.cancel')}
              </button>
              <button
                type="button"
                onClick={save}
                className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.25)] transition hover:bg-emerald-300"
              >
                <Save className="size-4" /> {t('goals.save')}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraft(goals)
                setEditing(true)
              }}
              className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
            >
              <Pencil className="size-4" /> {t('goals.edit')}
            </button>
          )}
        </div>
      </div>

      {/* Target Weight Tracker */}
      <section className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
              <Scale className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{t('goals.targetWeightTracker')}</h2>
              <p className="mt-0.5 text-sm text-slate-400">
                {t('goals.progressFrom')} {goals.startWeight} kg {t('goals.to')} {goals.goalWeight} kg
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-slate-500">{t('goals.current')}</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {goals.currentWeight}
                <span className="ml-1 text-sm text-slate-400">kg</span>
              </p>
            </div>
            <div className="border-l border-slate-700 pl-6">
              <p className="text-xs text-slate-500">{t('goals.goal')}</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-300">
                {goals.goalWeight}
                <span className="ml-1 text-sm text-emerald-400/70">kg</span>
              </p>
            </div>
            <div className="border-l border-slate-700 pl-6">
              <p className="text-xs text-slate-500">{t('goals.remaining')}</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {remaining.toFixed(1)}
                <span className="ml-1 text-sm text-slate-400">kg</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <TrendingUp className="size-3.5 text-emerald-400" />
              {weightLost > 0 ? `${weightLost.toFixed(1)} ${t('goals.kgLost')}` : t('goals.justStarted')}
            </span>
            <span className="font-semibold text-emerald-300">{Math.round(weightPct)}%</span>
          </div>
          <div className="relative h-4 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-700"
              style={{ width: `${weightPct}%`, boxShadow: '0 0 16px rgba(52,211,153,0.3)' }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-500">
            <span>{t('goals.start')} · {goals.startWeight} kg</span>
            <span>{t('goals.goal')} · {goals.goalWeight} kg</span>
          </div>
        </div>

        {/* Editable weight fields */}
        {editing && (
          <div className="mt-6 grid gap-4 border-t border-slate-800 pt-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t('goals.currentWeightLabel')}
              </label>
              <input
                type="number"
                step="0.1"
                value={draft.currentWeight}
                onChange={(e) => update('currentWeight', parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t('goals.goalWeightLabel')}
              </label>
              <input
                type="number"
                step="0.1"
                value={draft.goalWeight}
                onChange={(e) => update('goalWeight', parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>
          </div>
        )}
      </section>

      {/* Daily Macro Targets */}
      <section className="mt-5 rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300">
              <Flame className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{t('goals.dailyMacroTargets')}</h2>
              <p className="mt-0.5 text-sm text-slate-400">
                {t('goals.macroSubtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="hidden items-center gap-1 text-xs font-semibold text-slate-400 sm:flex"
          >
            {t('goals.daily')} <ChevronDown className="size-3" />
          </button>
        </div>

        {/* Calorie display / edit */}
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
              <Zap className="size-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{t('goals.dailyCalorieGoal')}</p>
              {editing ? (
                <input
                  type="number"
                  step="50"
                  value={draft.calories}
                  onChange={(e) => update('calories', parseInt(e.target.value) || 0)}
                  className="mt-1 w-32 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-lg font-semibold text-white outline-none focus:border-emerald-400"
                />
              ) : (
                <p className="mt-1 text-2xl font-semibold text-white">
                  {goals.calories.toLocaleString()}
                  <span className="ml-1.5 text-sm text-slate-400">{t('goals.kcal')}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="rounded-lg bg-slate-800/50 px-3 py-2 text-center">
              <p className="text-slate-500">{t('goals.protein')}</p>
              <p className="mt-0.5 font-semibold text-emerald-300">
                {Math.round(((goals.protein * 4) / goals.calories) * 100)}%
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 px-3 py-2 text-center">
              <p className="text-slate-500">{t('goals.carbs')}</p>
              <p className="mt-0.5 font-semibold text-sky-300">
                {Math.round(((goals.carbs * 4) / goals.calories) * 100)}%
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 px-3 py-2 text-center">
              <p className="text-slate-500">{t('goals.fat')}</p>
              <p className="mt-0.5 font-semibold text-amber-300">
                {Math.round(((goals.fat * 9) / goals.calories) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Macro bars / editors */}
        <div className="mt-5 grid gap-5">
          {MACROS.map((macro) => (
            <div key={macro.key}>
              {editing ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${macro.color}`} />
                    <span className="text-sm font-medium text-slate-300">{macro.label}</span>
                  </div>
                  <Stepper
                    value={draft[macro.key]}
                    onChange={(v) => update(macro.key, v)}
                    step={5}
                    min={0}
                    max={macro.max}
                    suffix={macro.unit}
                  />
                </div>
              ) : (
                <MacroBar
                  label={macro.label}
                  value={goals[macro.key]}
                  unit={macro.unit}
                  max={macro.max}
                  color={macro.color}
                  glow={macro.glow}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Daily Activity Goals */}
      <section className="mt-5 grid gap-5 sm:grid-cols-2">
        {/* Steps */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300">
                <Footprints className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{t('goals.dailySteps')}</h3>
                <p className="mt-0.5 text-xs text-slate-400">{t('goals.stepCountGoal')}</p>
              </div>
            </div>
            <Sparkles className="size-4 text-slate-600" />
          </div>
          <div className="mt-5">
            {editing ? (
              <Stepper
                value={draft.steps}
                onChange={(v) => update('steps', v)}
                step={500}
                min={1000}
                max={30000}
                suffix={t('goals.stepsSuffix')}
              />
            ) : (
              <>
                <p className="text-3xl font-semibold text-white">
                  {goals.steps.toLocaleString()}
                  <span className="ml-1.5 text-sm text-slate-400">{t('goals.stepsSuffix')}</span>
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-violet-400 transition-all"
                    style={{ width: '75%', boxShadow: '0 0 10px rgba(167,139,250,0.3)' }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  7,543 {t('goals.todaySteps')} {goals.steps.toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Water */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
                <Droplets className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{t('goals.waterIntake')}</h3>
                <p className="mt-0.5 text-xs text-slate-400">{t('goals.hydrationGoal')}</p>
              </div>
            </div>
            <Activity className="size-4 text-slate-600" />
          </div>
          <div className="mt-5">
            {editing ? (
              <Stepper
                value={draft.water}
                onChange={(v) => update('water', v)}
                step={0.1}
                min={0.5}
                max={5}
                suffix="L"
              />
            ) : (
              <>
                <p className="text-3xl font-semibold text-white">
                  {goals.water}
                  <span className="ml-1.5 text-sm text-slate-400">{t('goals.literPerDay')}</span>
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all"
                    style={{ width: '82%', boxShadow: '0 0 10px rgba(34,211,238,0.3)' }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  2.05 {t('goals.todayWater')} {goals.water} L
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Summary footer */}
      <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl border border-emerald-900/40 bg-emerald-400/[0.04] px-5 py-4 text-sm sm:flex-row">
        <p className="text-slate-400">
          <Sparkles className="mr-1.5 inline size-4 text-emerald-400" />
          {t('goals.footerNote')}
        </p>
        {editing && (
          <button
            type="button"
            onClick={save}
            className="flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.25)] transition hover:bg-emerald-300"
          >
            <Save className="size-4" /> {t('goals.saveChanges')}
          </button>
        )}
      </div>
    </div>
  )
}