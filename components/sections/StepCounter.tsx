 'use client'

import React, { useState } from 'react'
import {
  Activity,
  Flame,
  Footprints,
  MapPin,
  Plus,
  TrendingUp,
  Zap,
  LucideIcon,
} from 'lucide-react'

export interface ActivityLogItem {
  id?: string
  time: string
  label: string
  steps: number
  duration: string
  icon: LucideIcon
}

export const HOURLY_STEPS: number[] = [120, 340, 880, 520, 210, 450, 1200, 980, 320, 670, 540, 410]

export const ACTIVITY_LOG: ActivityLogItem[] = [
  { time: '8:15 AM', label: 'Morning walk', steps: 1240, duration: '12 min', icon: Footprints },
  { time: '12:30 PM', label: 'Lunch errand', steps: 880, duration: '9 min', icon: MapPin },
  { time: '5:45 PM', label: 'Evening jog', steps: 3200, duration: '28 min', icon: Activity },
]

export interface CircularProgressProps {
  value: number
  max: number
  size?: number
}

export function CircularProgress({ value, max, size = 180 }: CircularProgressProps) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min((value / max) * 100, 100)
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth="12" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#34d399"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: 'drop-shadow(0 0 8px rgba(52,211,153,0.4))', transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-bold text-white">{value.toLocaleString()}</p>
        <p className="mt-1 text-xs text-slate-400">of {max.toLocaleString()} steps</p>
      </div>
    </div>
  )
}

export default function StepCounter() {
  const [steps, setSteps] = useState<number>(7840)
  const [activities, setActivities] = useState<ActivityLogItem[]>(ACTIVITY_LOG)
  const goal = 10000
  const strideLength = 0.75
  const distance = ((steps * strideLength) / 1000).toFixed(2)
  const calories = Math.round(steps * 0.04)
  const activeMin = Math.round(steps * 0.01)
  const pct = Math.round((steps / goal) * 100)
  const peakHour = HOURLY_STEPS.indexOf(Math.max(...HOURLY_STEPS))

  const handleAddQuickSteps = () => {
    const additionalSteps = 500
    setSteps((prev) => prev + additionalSteps)
    
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    const newEntry: ActivityLogItem = {
      id: Date.now().toString(),
      time: timeStr,
      label: 'Manual walk step',
      steps: additionalSteps,
      duration: '5 min',
      icon: Footprints,
    }
    
    setActivities((prev) => [newEntry, ...prev])
  }

  return (
    <div className="mx-auto max-w-[1080px]">
      <div className="mb-7">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
          <Footprints className="size-3.5" /> Pedometer
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">Step Counter</h1>
        <p className="mt-2 text-sm text-slate-400">Track your daily movement and stay active.</p>
      </div>

      {/* Main grid */}
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        {/* Circular progress + stats */}
        <div className="flex flex-col items-center rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-8">
          <CircularProgress value={steps} max={goal} />
          <div className="mt-6 grid w-full grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-800/50 p-4 text-center">
              <MapPin className="mx-auto size-5 text-sky-400" />
              <p className="mt-2 text-xl font-semibold text-white">{distance}</p>
              <p className="text-[11px] text-slate-500">km walked</p>
            </div>
            <div className="rounded-xl bg-slate-800/50 p-4 text-center">
              <Flame className="mx-auto size-5 text-amber-400" />
              <p className="mt-2 text-xl font-semibold text-white">{calories}</p>
              <p className="text-[11px] text-slate-500">active kcal</p>
            </div>
            <div className="rounded-xl bg-slate-800/50 p-4 text-center">
              <Activity className="mx-auto size-5 text-violet-400" />
              <p className="mt-2 text-xl font-semibold text-white">{activeMin}</p>
              <p className="text-[11px] text-slate-500">active min</p>
            </div>
          </div>
          <div className="mt-4 flex w-full items-center gap-2 rounded-xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-400/20">
            <TrendingUp className="size-4 shrink-0 text-emerald-400" />
            {pct}% of your daily goal — {Math.max(goal - steps, 0).toLocaleString()} steps to go
          </div>
        </div>

        {/* Hourly bar chart */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Hourly breakdown</h2>
              <p className="mt-1 text-sm text-slate-400">Steps by time of day</p>
            </div>
            <Zap className="size-5 text-emerald-400" />
          </div>
          <div className="mt-6 flex h-44 items-end gap-1.5">
            {HOURLY_STEPS.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded-t-md transition-all ${i === peakHour ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]' : 'bg-emerald-400/30'}`}
                  style={{ height: `${(h / Math.max(...HOURLY_STEPS)) * 100}%` }}
                />
                <span className="text-[9px] text-slate-600">{(i + 7) % 12 || 12}{i + 7 < 12 || i + 7 >= 24 ? 'a' : 'p'}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-slate-800/40 px-3 py-2 text-xs text-slate-400">
            Peak hour: <span className="font-semibold text-emerald-300">{(peakHour + 7) % 12 || 12}:00</span> with {Math.max(...HOURLY_STEPS).toLocaleString()} steps
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="mt-5 rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Today's activity log</h2>
            <p className="mt-1 text-sm text-slate-400">Recorded movements throughout the day</p>
          </div>
          <button
            onClick={handleAddQuickSteps}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
          >
            <Plus className="size-3.5" /> Log activity (+500)
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          {activities.map((entry, i) => {
            const Icon = entry.icon
            return (
              <div key={entry.id || i} className="flex items-center gap-4 rounded-xl bg-slate-800/40 p-4 transition hover:bg-slate-800/60">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{entry.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{entry.time} · {entry.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-emerald-300">{entry.steps.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500">steps</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}