 'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  Flame,
  Footprints,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Utensils,
  X,
  Zap,
} from 'lucide-react'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const COMPLIANCE_DATA = [
  { day: 'Mon', score: 92, logged: true },
  { day: 'Tue', score: 88, logged: true },
  { day: 'Wed', score: 95, logged: true },
  { day: 'Thu', score: 0, logged: false },
  { day: 'Fri', score: 84, logged: true },
  { day: 'Sat', score: 76, logged: true },
  { day: 'Sun', score: 90, logged: true },
]

const WARNINGS = [
  {
    id: 'missed-thu',
    icon: AlertTriangle,
    title: 'No logs on Thursday',
    detail: 'You missed logging all meals on Thursday. This breaks your calorie streak and makes weekly trends less accurate.',
    severity: 'high' as const,
    tip: 'Set a daily reminder at 8 PM to log any meals you missed during the day.',
  },
  {
    id: 'over-carbs',
    icon: AlertTriangle,
    title: 'Carbs exceeded on Saturday',
    detail: 'You went 18% over your carb target on Saturday (259g vs 220g goal), mostly from a late dinner.',
    severity: 'medium' as const,
    tip: 'Try swapping rice for extra vegetables in evening meals to reduce carb load.',
  },
  {
    id: 'low-steps',
    icon: TrendingUp,
    title: 'Steps declining 3 days in a row',
    detail: 'Your step count dropped from 11,200 to 6,800 over the last 3 days. Below your 10,000 goal.',
    severity: 'low' as const,
    tip: 'A 15-minute afternoon walk adds ~1,800 steps and helps with digestion.',
  },
]

const HABITS = [
  { label: 'Logged meals daily', done: true, icon: Utensils },
  { label: 'Hit protein target 5/7 days', done: true, icon: Check },
  { label: 'Stayed within calorie range', done: false, icon: Target },
  { label: 'Completed 10k steps 4/7 days', done: false, icon: Footprints },
  { label: 'Drank 2.5L water daily', done: true, icon: Sparkles },
]

function severityStyle(severity: 'high' | 'medium' | 'low') {
  if (severity === 'high') return { border: 'border-rose-400/30', bg: 'bg-rose-400/[0.07]', chip: 'bg-rose-400/15 text-rose-300', dot: 'bg-rose-400' }
  if (severity === 'medium') return { border: 'border-amber-400/30', bg: 'bg-amber-400/[0.07]', chip: 'bg-amber-400/15 text-amber-300', dot: 'bg-amber-400' }
  return { border: 'border-sky-400/30', bg: 'bg-sky-400/[0.07]', chip: 'bg-sky-400/15 text-sky-300', dot: 'bg-sky-400' }
}

export default function AITrainer() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const avgScore = Math.round(
    COMPLIANCE_DATA.filter((d) => d.logged).reduce((sum, d) => sum + d.score, 0) /
      COMPLIANCE_DATA.filter((d) => d.logged).length,
  )
  const streak = COMPLIANCE_DATA.filter((d) => d.logged).length
  const activeWarnings = WARNINGS.filter((w) => !dismissed.has(w.id))

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id))
  }

  return (
    <div className="mx-auto max-w-[1080px]">
      <div className="mb-7">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
          <ShieldCheck className="size-3.5" /> AI Trainer
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">AI Trainer Oversight</h1>
        <p className="mt-2 text-sm text-slate-400">Compliance monitoring, streak tracking, and habit corrections.</p>
      </div>

      {/* Top stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
              <Target className="size-5" />
            </div>
            <span className="text-3xl font-bold text-emerald-300">{avgScore}%</span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-400">Weekly compliance score</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" style={{ width: `${avgScore}%`, boxShadow: '0 0 10px rgba(52,211,153,0.3)' }} />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
              <Flame className="size-5" />
            </div>
            <span className="text-3xl font-bold text-amber-300">{streak}</span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-400">Day logging streak</p>
          <div className="mt-3 flex gap-1">
            {COMPLIANCE_DATA.map((d, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${d.logged ? 'bg-amber-400/80' : 'bg-rose-400/40'}`} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-400/15 text-rose-300">
              <AlertTriangle className="size-5" />
            </div>
            <span className="text-3xl font-bold text-rose-300">{activeWarnings.length}</span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-400">Active warnings</p>
          <p className="mt-2 text-xs text-slate-500">{dismissed.size > 0 ? `${dismissed.size} dismissed` : 'No items dismissed'}</p>
        </div>
      </section>

      {/* Weekly compliance bar chart */}
      <section className="mt-5 rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Weekly compliance</h2>
            <p className="mt-1 text-sm text-slate-400">Daily adherence to your nutrition and activity plan</p>
          </div>
          <Zap className="size-5 text-emerald-400" />
        </div>
        <div className="mt-6 flex h-44 items-end gap-3">
          {COMPLIANCE_DATA.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative w-full">
                {!d.logged && (
                  <div className="absolute -top-1 left-1/2 z-10 flex size-5 -translate-x-1/2 items-center justify-center rounded-full bg-rose-400/20 ring-1 ring-rose-400/40">
                    <X className="size-3 text-rose-300" />
                  </div>
                )}
                <div
                  className={`w-full rounded-t-lg transition-all ${d.logged ? 'bg-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.2)]' : 'bg-rose-400/20'}`}
                  style={{ height: d.logged ? `${d.score * 1.4}px` : '8px' }}
                />
              </div>
              <span className={`text-xs ${d.logged ? 'text-slate-500' : 'text-rose-400/60'}`}>{d.day}</span>
              {d.logged && <span className="text-[10px] font-semibold text-emerald-300">{d.score}%</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Warnings + Habits */}
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* Warnings */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Warning alerts</h2>
              <p className="mt-1 text-sm text-slate-400">Missed logs and diet plan deviations</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {activeWarnings.map((w) => {
              const Icon = w.icon
              const style = severityStyle(w.severity)
              return (
                <div key={w.id} className={`rounded-xl border ${style.border} ${style.bg} p-4`}>
                  <div className="flex items-start gap-3">
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${style.chip}`}>
                      <Icon className="size-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{w.title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${style.chip}`}>
                          {w.severity}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-slate-400">{w.detail}</p>
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-900/40 p-3">
                        <Sparkles className="size-3.5 shrink-0 text-emerald-400" />
                        <p className="text-xs leading-5 text-slate-300"><span className="font-semibold text-emerald-300">Habit correction: </span>{w.tip}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => dismiss(w.id)}
                      className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                      aria-label="Dismiss warning"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              )
            })}
            {activeWarnings.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="size-6" />
                </div>
                <p className="text-sm font-semibold text-white">All clear!</p>
                <p className="text-xs text-slate-500">No active warnings. Keep up the great work.</p>
              </div>
            )}
          </div>
        </div>

        {/* Habit checklist */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Habit checklist</h2>
              <p className="mt-1 text-sm text-slate-400">This week's key behaviors</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2.5">
            {HABITS.map((habit, i) => {
              const Icon = habit.icon
              return (
                <div key={i} className={`flex items-center gap-3 rounded-xl p-3.5 transition ${habit.done ? 'bg-emerald-400/[0.07]' : 'bg-slate-800/40'}`}>
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${habit.done ? 'bg-emerald-400/15 text-emerald-300' : 'bg-slate-700/50 text-slate-500'}`}>
                    <Icon className="size-4.5" />
                  </div>
                  <span className={`flex-1 text-sm ${habit.done ? 'text-slate-200' : 'text-slate-500'}`}>{habit.label}</span>
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${habit.done ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-slate-700 text-transparent'}`}>
                    <Check className="size-3.5" />
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-5 rounded-xl bg-slate-800/40 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">AI recommendation</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Focus on <span className="font-semibold text-emerald-300">hitting your step goal</span> next week.
              Your nutrition logs are consistent, but lower activity days tend to coincide with higher calorie intake.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}