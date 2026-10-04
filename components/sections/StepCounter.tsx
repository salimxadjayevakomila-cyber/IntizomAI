 'use client'

import React, { useEffect, useState } from 'react'
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
import { useLanguage } from '@/contexts/language-context'

 const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://intizom-ai-backend.onrender.com'

const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...(options.body
          ? {
              'Content-Type': 'application/json',
            }
          : {}),
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      },
    }
  )

  const text = await response.text()

  let data: any = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(
      'Backend JSON response qaytarmadi.'
    )
  }

  if (
    !response.ok ||
    data?.success === false
  ) {
    throw new Error(
      data?.message ||
        data?.error ||
        'Serverda xatolik yuz berdi'
    )
  }

  return data
}

export interface ActivityLogItem {
  id?: string
  time: string
  label: string
  steps: number
  duration: string
  icon: LucideIcon
}

type Language = 'uz' | 'ru' | 'en'

const translations: Record<
  Language,
  {
    badge: string
    title: string
    subtitle: string
    ofSteps: string
    kmWalked: string
    activeKcal: string
    activeMin: string
    dailyGoal: string
    stepsToGo: string
    hourlyBreakdown: string
    stepsByTime: string
    peakHour: string
    steps: string
    activityLog: string
    recordedMovements: string
    logActivity: string
    morningWalk: string
    lunchErrand: string
    eveningJog: string
    manualWalk: string
    minutes: string
  }
> = {
  en: {
    badge: 'Pedometer',
    title: 'Step Counter',
    subtitle:
      'Track your daily movement and stay active.',
    ofSteps: 'of',
    kmWalked: 'km walked',
    activeKcal: 'active kcal',
    activeMin: 'active min',
    dailyGoal: 'of your daily goal',
    stepsToGo: 'steps to go',
    hourlyBreakdown: 'Hourly breakdown',
    stepsByTime: 'Steps by time of day',
    peakHour: 'Peak hour',
    steps: 'steps',
    activityLog: "Today's activity log",
    recordedMovements:
      'Recorded movements throughout the day',
    logActivity: 'Log activity (+500)',
    morningWalk: 'Morning walk',
    lunchErrand: 'Lunch errand',
    eveningJog: 'Evening jog',
    manualWalk: 'Manual walk step',
    minutes: 'min',
  },

  uz: {
    badge: 'Qadam hisoblagich',
    title: 'Qadamlar hisoblagichi',
    subtitle:
      'Kunlik harakatingizni kuzating va faol bo‘ling.',
    ofSteps: 'dan',
    kmWalked: 'yurilgan km',
    activeKcal: 'faol kkal',
    activeMin: 'faol daqiqa',
    dailyGoal: 'kunlik maqsadingizning',
    stepsToGo: 'qadam qoldi',
    hourlyBreakdown: 'Soatlik statistika',
    stepsByTime: 'Kun davomida vaqt bo‘yicha qadamlar',
    peakHour: 'Eng faol vaqt',
    steps: 'qadam',
    activityLog: 'Bugungi faoliyat',
    recordedMovements:
      'Kun davomida qayd etilgan harakatlar',
    logActivity: 'Faoliyat qo‘shish (+500)',
    morningWalk: 'Ertalabki yurish',
    lunchErrand: 'Tushlik paytidagi yurish',
    eveningJog: 'Kechki yugurish',
    manualWalk: 'Qo‘lda qo‘shilgan qadam',
    minutes: 'daq',
  },

  ru: {
    badge: 'Шагомер',
    title: 'Счётчик шагов',
    subtitle:
      'Отслеживайте ежедневную активность и больше двигайтесь.',
    ofSteps: 'из',
    kmWalked: 'пройдено км',
    activeKcal: 'активных ккал',
    activeMin: 'активных мин',
    dailyGoal: 'от вашей дневной цели',
    stepsToGo: 'шагов осталось',
    hourlyBreakdown: 'Почасовая статистика',
    stepsByTime: 'Шаги по времени суток',
    peakHour: 'Самый активный час',
    steps: 'шагов',
    activityLog: 'Активность за сегодня',
    recordedMovements:
      'Движения, записанные в течение дня',
    logActivity: 'Добавить активность (+500)',
    morningWalk: 'Утренняя прогулка',
    lunchErrand: 'Прогулка во время обеда',
    eveningJog: 'Вечерняя пробежка',
    manualWalk: 'Шаги добавлены вручную',
    minutes: 'мин',
  },
}

export interface CircularProgressProps {
  value: number
  max: number
  size?: number
}

export function CircularProgress({
  value,
  max,
  size = 180,
}: CircularProgressProps) {
  const { language } = useLanguage()

  const lang: Language =
    language === 'uz' || language === 'ru'
      ? language
      : 'en'

  const copy = translations[lang]

  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius

  const pct =
    max > 0
      ? Math.min((value / max) * 100, 100)
      : 0

  const offset =
    circumference -
    (pct / 100) * circumference

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(30,41,59,0.8)"
          strokeWidth="12"
        />

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
          style={{
            filter:
              'drop-shadow(0 0 8px rgba(52,211,153,0.4))',
            transition:
              'stroke-dashoffset 0.8s ease',
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-bold text-white">
          {value.toLocaleString()}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {copy.ofSteps}{' '}
          {max.toLocaleString()}{' '}
          {copy.steps}
        </p>
      </div>
    </div>
  )
}

export default function StepCounter() {
  const { language } = useLanguage()

  const lang: Language =
    language === 'uz' || language === 'ru'
      ? language
      : 'en'

  const copy = translations[lang]

  const [steps, setSteps] =
    useState<number>(0)

  const [activities, setActivities] =
    useState<ActivityLogItem[]>([])

  const [hourlySteps, setHourlySteps] =
    useState<number[]>(
      Array(12).fill(0)
    )

  const [isLoading, setIsLoading] =
    useState(true)

  const [isAdding, setIsAdding] =
    useState(false)

  const goal = 10000

  const strideLength = 0.75

  const distance = (
    (steps * strideLength) /
    1000
  ).toFixed(2)

  const calories =
    Math.round(steps * 0.04)

  const activeMin =
    Math.round(steps * 0.01)

  const pct =
    goal > 0
      ? Math.min(
          Math.round(
            (steps / goal) * 100
          ),
          100
        )
      : 0

  const peakHour =
    hourlySteps.length > 0
      ? hourlySteps.indexOf(
          Math.max(...hourlySteps)
        )
      : 0

  const maxHourlySteps =
    Math.max(...hourlySteps, 1)

  const getLocalizedActivityLabel = (
    label: string
  ) => {
    if (label === 'Morning walk')
      return copy.morningWalk

    if (label === 'Lunch errand')
      return copy.lunchErrand

    if (label === 'Evening jog')
      return copy.eveningJog

    if (label === 'Manual walk step')
      return copy.manualWalk

    return label
  }

  /*
   * MongoDB'dan bugungi qadamlarni olish
   */
  useEffect(() => {
    const loadSteps = async () => {
      try {
        setIsLoading(true)

        const token =
          localStorage.getItem('token')

        if (!token) {
          setSteps(0)
          setActivities([])
          setHourlySteps(
            Array(12).fill(0)
          )
          return
        }

        const result =
          await apiFetch('/api/steps')

        const data = result?.data

        setSteps(
          Number(data?.steps) || 0
        )

        setHourlySteps(
          Array.isArray(
            data?.hourlySteps
          )
            ? data.hourlySteps.map(
                (value: any) =>
                  Number(value) || 0
              )
            : Array(12).fill(0)
        )

        const mappedActivities =
          Array.isArray(
            data?.activities
          )
            ? data.activities.map(
                (item: any) => ({
                  id: item._id,
                  time:
                    item.time || '',
                  label:
                    item.label ||
                    'Manual walk step',
                  steps:
                    Number(item.steps) ||
                    0,
                  duration:
                    item.duration ||
                    '5 min',
                  icon: Footprints,
                })
              )
            : []

        setActivities(
          mappedActivities
        )
      } catch (error) {
        console.error(
          'Load steps error:',
          error
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadSteps()
  }, [])

  /*
   * Backendga +500 qadam qo‘shish
   */
  const handleAddQuickSteps =
    async () => {
      try {
        setIsAdding(true)

        const additionalSteps = 500

        const result =
          await apiFetch('/api/steps', {
            method: 'POST',
            body: JSON.stringify({
              steps: additionalSteps,
              duration: '5 min',
              label:
                'Manual walk step',
            }),
          })

        const data = result?.data

        setSteps(
          Number(data?.steps) || 0
        )

        setHourlySteps(
          Array.isArray(
            data?.hourlySteps
          )
            ? data.hourlySteps.map(
                (value: any) =>
                  Number(value) || 0
              )
            : Array(12).fill(0)
        )

        const mappedActivities =
          Array.isArray(
            data?.activities
          )
            ? data.activities.map(
                (item: any) => ({
                  id: item._id,
                  time:
                    item.time || '',
                  label:
                    item.label ||
                    'Manual walk step',
                  steps:
                    Number(item.steps) ||
                    0,
                  duration:
                    item.duration ||
                    '5 min',
                  icon: Footprints,
                })
              )
            : []

        setActivities(
          mappedActivities
        )
      } catch (error) {
        console.error(
          'Add steps error:',
          error
        )

        alert(
          error instanceof Error
            ? error.message
            : 'Qadam qo‘shishda xatolik yuz berdi'
        )
      } finally {
        setIsAdding(false)
      }
    }

  return (
    <div className="mx-auto max-w-[1080px]">
      <div className="mb-7">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
          <Footprints className="size-3.5" />

          {copy.badge}
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">
          {copy.title}
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {copy.subtitle}
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-10 text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />

          <p className="mt-4 text-sm text-slate-400">
            Loading...
          </p>
        </div>
      ) : (
        <>
          {/* Main grid */}
          <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
            {/* Circular progress + stats */}
            <div className="flex flex-col items-center rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-8">
              <CircularProgress
                value={steps}
                max={goal}
              />

              <div className="mt-6 grid w-full grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-800/50 p-4 text-center">
                  <MapPin className="mx-auto size-5 text-sky-400" />

                  <p className="mt-2 text-xl font-semibold text-white">
                    {distance}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    {copy.kmWalked}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800/50 p-4 text-center">
                  <Flame className="mx-auto size-5 text-amber-400" />

                  <p className="mt-2 text-xl font-semibold text-white">
                    {calories}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    {copy.activeKcal}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800/50 p-4 text-center">
                  <Activity className="mx-auto size-5 text-violet-400" />

                  <p className="mt-2 text-xl font-semibold text-white">
                    {activeMin}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    {copy.activeMin}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex w-full items-center gap-2 rounded-xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-400/20">
                <TrendingUp className="size-4 shrink-0 text-emerald-400" />

                {pct}% {copy.dailyGoal} —{' '}
                {Math.max(
                  goal - steps,
                  0
                ).toLocaleString()}{' '}
                {copy.stepsToGo}
              </div>
            </div>

            {/* Hourly bar chart */}
            <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {copy.hourlyBreakdown}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {copy.stepsByTime}
                  </p>
                </div>

                <Zap className="size-5 text-emerald-400" />
              </div>

              <div className="mt-6 flex h-44 items-end gap-1.5">
                {hourlySteps.map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex flex-1 flex-col items-center gap-1.5"
                    >
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          i === peakHour &&
                          h > 0
                            ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                            : 'bg-emerald-400/30'
                        }`}
                        style={{
                          height: `${
                            h > 0
                              ? Math.max(
                                  (h /
                                    maxHourlySteps) *
                                    100,
                                  4
                                )
                              : 2
                          }%`,
                        }}
                      />

                      <span className="text-[9px] text-slate-600">
                        {(i + 7) %
                          12 || 12}
                        {i + 7 <
                          12 ||
                        i + 7 >=
                          24
                          ? 'a'
                          : 'p'}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="mt-4 rounded-lg bg-slate-800/40 px-3 py-2 text-xs text-slate-400">
                {copy.peakHour}:{' '}
                <span className="font-semibold text-emerald-300">
                  {(peakHour + 7) %
                    12 || 12}
                  :00
                </span>{' '}
                —{' '}
                {Math.max(
                  ...hourlySteps,
                  0
                ).toLocaleString()}{' '}
                {copy.steps}
              </div>
            </div>
          </div>

          {/* Activity log */}
          <div className="mt-5 rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {copy.activityLog}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {copy.recordedMovements}
                </p>
              </div>

              <button
                onClick={
                  handleAddQuickSteps
                }
                disabled={isAdding}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="size-3.5" />

                {isAdding
                  ? '...'
                  : copy.logActivity}
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {activities.length === 0 ? (
                <div className="rounded-xl bg-slate-800/40 p-6 text-center">
                  <Footprints className="mx-auto size-8 text-slate-600" />

                  <p className="mt-3 text-sm text-slate-500">
                    {copy.recordedMovements}
                  </p>
                </div>
              ) : (
                activities.map(
                  (entry, i) => {
                    const Icon =
                      entry.icon

                    return (
                      <div
                        key={
                          entry.id ||
                          i
                        }
                        className="flex items-center gap-4 rounded-xl bg-slate-800/40 p-4 transition hover:bg-slate-800/60"
                      >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                          <Icon className="size-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">
                            {getLocalizedActivityLabel(
                              entry.label
                            )}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {entry.time} ·{' '}
                            {entry.duration}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold text-emerald-300">
                            {entry.steps.toLocaleString()}
                          </p>

                          <p className="text-[11px] text-slate-500">
                            {copy.steps}
                          </p>
                        </div>
                      </div>
                    )
                  }
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}