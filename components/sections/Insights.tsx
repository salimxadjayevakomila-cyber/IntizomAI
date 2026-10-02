 'use client'

import React, { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Check,
  Clock,
  Droplets,
  Flame,
  Footprints,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'

import { useLanguage } from '@/contexts/language-context'

type TabKey = 'weekly' | 'macros' | 'insights'

interface WeeklyDataItem {
  day: string
  burned: number
  consumed: number
  steps: number
}

const weeklyData: WeeklyDataItem[] = [
  { day: 'Mon', burned: 480, consumed: 1850, steps: 7200 },
  { day: 'Tue', burned: 620, consumed: 1920, steps: 9100 },
  { day: 'Wed', burned: 540, consumed: 1780, steps: 8400 },
  { day: 'Thu', burned: 710, consumed: 2100, steps: 11200 },
  { day: 'Fri', burned: 590, consumed: 2010, steps: 9800 },
  { day: 'Sat', burned: 830, consumed: 2240, steps: 12400 },
  { day: 'Sun', burned: 660, consumed: 1960, steps: 10100 },
]

interface MacroItem {
  name: string
  value: number
  color: string
}

const macroBreakdown: MacroItem[] = [
  { name: 'Protein', value: 32, color: '#34d399' },
  { name: 'Carbs', value: 45, color: '#5ac4a4' },
  { name: 'Fat', value: 23, color: '#f4bf77' },
]

type Insight = {
  id: string
  icon: React.ElementType
  tone: 'success' | 'warning' | 'info'
  title: string
  detail: string
  highlight: string
}

const aiInsights: Insight[] = [
  {
    id: 'protein',
    icon: Award,
    tone: 'success',
    title: 'Protein target nailed on Wednesday',
    detail:
      'You hit 142g of protein — 101% of your daily goal. That mirrors your most consistent day last week. Keep breakfast protein-rich to repeat it.',
    highlight: '142g · 101% of goal',
  },
  {
    id: 'steps',
    icon: TrendingUp,
    tone: 'info',
    title: 'Step count trending up',
    detail:
      'You averaged 9,743 steps/day this week, up 12% from last week. Saturday was your peak at 12,400 steps. A short evening walk could push you over 10k daily.',
    highlight: '12% vs last week',
  },
  {
    id: 'hydration',
    icon: Droplets,
    tone: 'warning',
    title: 'Hydration dipped on Thursday',
    detail:
      'Water intake fell to 64% of your goal on Thursday — the same day you consumed the most calories. Pairing meals with a glass of water helps close that gap.',
    highlight: '64% — below target',
  },
  {
    id: 'evening',
    icon: Clock,
    tone: 'info',
    title: 'Late dinners spiking calorie totals',
    detail:
      'Three of your five highest-calorie days had dinners after 9 PM. Shifting your last meal earlier lines up with your 14:10 fasting window and flattens the spike.',
    highlight: '3 late dinners logged',
  },
]

const toneStyles: Record<Insight['tone'], { ring: string; chip: string; icon: string }> = {
  success: {
    ring: 'ring-emerald-400/30 bg-emerald-400/[0.07]',
    chip: 'bg-emerald-400/15 text-emerald-300',
    icon: 'bg-emerald-400/15 text-emerald-300',
  },
  warning: {
    ring: 'ring-amber-400/30 bg-amber-400/[0.07]',
    chip: 'bg-amber-400/15 text-amber-300',
    icon: 'bg-amber-400/15 text-amber-300',
  },
  info: {
    ring: 'ring-sky-400/30 bg-sky-400/[0.07]',
    chip: 'bg-sky-400/15 text-sky-300',
    icon: 'bg-sky-400/15 text-sky-300',
  },
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; color?: string }>
  label?: string
  unit: string
}

function ChartTooltip({ active, payload, label, unit }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-semibold text-slate-200">{label}</p>
      {payload.map((entry, index) => (
        <p key={entry.name || index} className="flex items-center gap-1.5 text-slate-300">
          <span className="size-2 rounded-full" style={{ background: entry.color }} />
          <span className="capitalize">{entry.name}</span>
          <span className="ml-auto font-semibold text-white">
            {entry.value?.toLocaleString()} {unit}
          </span>
        </p>
      ))}
    </div>
  )
}

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  unit: string
  trend: string
  trendLabel: string
  trendDirection: 'up' | 'down'
  accent: string
  children?: React.ReactNode
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  trendLabel,
  trendDirection,
  accent,
  children,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] transition hover:border-emerald-700/60 sm:p-6">
      <div className="flex items-start justify-between">
        <div className={`flex size-10 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="size-5" />
        </div>
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            trendDirection === 'up' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-rose-400/15 text-rose-300'
          }`}
        >
          {trendDirection === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {trend}
        </span>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-1.5 text-3xl font-semibold tracking-[-0.04em] text-white">
        {value}
        <span className="ml-1.5 text-sm font-normal text-slate-400">{unit}</span>
      </p>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        {trendLabel}
      </div>
      {children}
    </div>
  )
}

export function WeeklyChart() {
  const maxSteps = Math.max(...weeklyData.map((d) => d.steps))
  const peakDay = weeklyData.find((d) => d.steps === maxSteps)?.day ?? ''
  const bestBurnDay = weeklyData.reduce((best, d) => (d.burned > best.burned ? d : best), weeklyData[0])

  return (
    <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
      {/* Combined bar + line chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Calories & step progress</h2>
            <p className="mt-1 text-sm text-slate-400">Burned vs consumed alongside daily steps</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="size-2.5 rounded-sm bg-emerald-400" /> Burned
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="size-2.5 rounded-sm bg-sky-400" /> Consumed
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="size-2.5 rounded-full border-2 border-amber-400" /> Steps
            </span>
          </div>
        </div>
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barGap={3} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="burnedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.45} />
                </linearGradient>
                <linearGradient id="consumedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip unit="kcal" />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
              <Bar dataKey="burned" name="Burned" fill="url(#burnedGrad)" radius={[5, 5, 0, 0]} maxBarSize={26} />
              <Bar dataKey="consumed" name="Consumed" fill="url(#consumedGrad)" radius={[5, 5, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-800 pt-4">
          <div className="rounded-xl bg-slate-800/50 px-4 py-3">
            <p className="text-xs text-slate-500">Peak burn day</p>
            <p className="mt-1 text-sm font-semibold text-emerald-300">
              {bestBurnDay.day} · {bestBurnDay.burned} kcal
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/50 px-4 py-3">
            <p className="text-xs text-slate-500">Peak step day</p>
            <p className="mt-1 text-sm font-semibold text-amber-300">
              {peakDay} · {maxSteps.toLocaleString()} steps
            </p>
          </div>
        </div>
      </div>

      {/* Step area chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Step trend</h2>
            <p className="mt-1 text-sm text-slate-400">Daily steps over the week</p>
          </div>
          <Footprints className="size-5 text-amber-400" />
        </div>
        <div className="mt-6 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="stepGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f4bf77" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#f4bf77" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip unit="steps" />} cursor={{ stroke: 'rgba(244,191,119,0.25)' }} />
              <Area
                type="monotone"
                dataKey="steps"
                name="Steps"
                stroke="#f4bf77"
                strokeWidth={2.5}
                fill="url(#stepGrad)"
                dot={{ r: 3, fill: '#f4bf77' }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export function MacroChart() {
  const totalGrams = macroBreakdown.reduce((sum, m) => sum + m.value, 0)
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
      {/* Donut chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Macronutrient distribution</h2>
            <p className="mt-1 text-sm text-slate-400">Protein · Carbs · Fat breakdown</p>
          </div>
        </div>
        <div className="relative mt-4 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={macroBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                stroke="none"
              >
                {macroBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null
                  const item = payload[0]
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs shadow-xl">
                      <p className="font-semibold text-slate-200">{item.name}</p>
                      <p className="text-slate-300">{item.value}%</p>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-2xl font-semibold text-white">{totalGrams}%</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {macroBreakdown.map((macro) => (
            <div key={macro.name} className="flex items-center gap-2.5 rounded-lg bg-slate-800/40 px-3 py-2">
              <span className="size-3 rounded-full" style={{ background: macro.color }} />
              <span className="text-sm font-medium text-slate-200">{macro.name}</span>
              <span className="ml-auto text-sm font-semibold text-white">{macro.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar comparison */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Daily macro breakdown</h2>
            <p className="mt-1 text-sm text-slate-400">Grams per macro across the week</p>
          </div>
        </div>
        <div className="mt-6 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={macroBreakdown} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip unit="%" />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
              <Bar dataKey="value" name="Percentage" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {macroBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-400/[0.07] px-4 py-3 text-xs text-emerald-200 ring-1 ring-emerald-400/20">
          <Check className="size-4 shrink-0 text-emerald-400" />
          Your protein ratio is above the recommended 25% — great for muscle maintenance.
        </div>
      </div>
    </div>
  )
}

export function AIInsights() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {aiInsights.map((insight) => {
        const Icon = insight.icon
        const tone = toneStyles[insight.tone]
        return (
          <article
            key={insight.id}
            className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.05)] ring-1 ${tone.ring} transition hover:border-emerald-700/50 sm:p-6`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${tone.chip}`}>
                    {insight.tone === 'success' ? 'Strong habit' : insight.tone === 'warning' ? 'Improve' : 'Pattern'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <Lightbulb className="size-3 text-emerald-400" /> AI insight
                  </span>
                </div>
                <h3 className="mt-2.5 text-base font-semibold leading-snug text-white">{insight.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{insight.detail}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-200">
                  <Sparkles className="size-3.5 text-emerald-400" />
                  {insight.highlight}
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default function Insights() {
  const [activeTab, setActiveTab] = useState<TabKey>('weekly')

  const weeklyAverages = useMemo(() => {
    const totals = weeklyData.reduce(
      (acc, d) => ({ burned: acc.burned + d.burned, consumed: acc.consumed + d.consumed, steps: acc.steps + d.steps }),
      { burned: 0, consumed: 0, steps: 0 }
    )
    const days = weeklyData.length
    return {
      avgBurned: Math.round(totals.burned / days),
      avgConsumed: Math.round(totals.consumed / days),
      totalSteps: totals.steps,
    }
  }, [])

  const hydrationScore = 82
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'weekly', label: 'Weekly progress' },
    { key: 'macros', label: 'Macronutrients' },
    { key: 'insights', label: 'AI insights' },
  ]

  return (
    <div className="mx-auto max-w-[1100px]">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            <Sparkles className="size-3.5" /> AI Smart Insights
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">Weekly Insights</h1>
          <p className="mt-2 text-sm text-slate-400">Track your progress, spot patterns, and get AI-powered recommendations.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
          <Clock className="size-4 text-emerald-400" />
          Sep 24 – Sep 30, 2026
        </div>
      </div>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Flame}
          label="Avg. calories burned"
          value={weeklyAverages.avgBurned.toLocaleString()}
          unit="kcal/day"
          trend="11%"
          trendLabel="up vs last week"
          trendDirection="up"
          accent="bg-emerald-400/15 text-emerald-300"
        />
        <StatCard
          icon={Zap}
          label="Avg. calories consumed"
          value={weeklyAverages.avgConsumed.toLocaleString()}
          unit="kcal/day"
          trend="3%"
          trendLabel="within target range"
          trendDirection="down"
          accent="bg-sky-400/15 text-sky-300"
        />
        <StatCard
          icon={Footprints}
          label="Total steps this week"
          value={weeklyAverages.totalSteps.toLocaleString()}
          unit="steps"
          trend="12%"
          trendLabel="up vs last week"
          trendDirection="up"
          accent="bg-violet-400/15 text-violet-300"
        />
        <StatCard
          icon={Droplets}
          label="Water hydration score"
          value={`${hydrationScore}%`}
          unit=""
          trend="6%"
          trendLabel="slightly below goal"
          trendDirection="down"
          accent="bg-cyan-400/15 text-cyan-300"
        >
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              style={{ width: `${hydrationScore}%` }}
            />
          </div>
        </StatCard>
      </section>

      {/* Tabs */}
      <div className="mt-7 flex gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === tab.key ? 'bg-emerald-400/15 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.12)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="mt-5">
        {activeTab === 'weekly' && <WeeklyChart />}
        {activeTab === 'macros' && <MacroChart />}
        {activeTab === 'insights' && <AIInsights />}
      </div>
    </div>
  )
}