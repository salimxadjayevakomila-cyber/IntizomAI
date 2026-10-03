 'use client'

import { useEffect, useState } from 'react'
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
import { useLanguage } from '@/contexts/language-context'

function severityStyle(severity: 'high' | 'medium' | 'low') {
  if (severity === 'high')
    return {
      border: 'border-rose-400/30',
      bg: 'bg-rose-400/[0.07]',
      chip: 'bg-rose-400/15 text-rose-300',
      dot: 'bg-rose-400',
    }

  if (severity === 'medium')
    return {
      border: 'border-amber-400/30',
      bg: 'bg-amber-400/[0.07]',
      chip: 'bg-amber-400/15 text-amber-300',
      dot: 'bg-amber-400',
    }

  return {
    border: 'border-sky-400/30',
    bg: 'bg-sky-400/[0.07]',
    chip: 'bg-sky-400/15 text-sky-300',
    dot: 'bg-sky-400',
  }
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5001'

const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
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
              'Content-Type':
                'application/json',
            }
          : {}),

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    },
  )

  const text = await response.text()

  let data: any = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(
      'Backend JSON response qaytarmadi.',
    )
  }

  if (
    !response.ok ||
    data?.success === false
  ) {
    throw new Error(
      data?.message ||
        data?.error ||
        'Serverda xatolik yuz berdi',
    )
  }

  return data
}

export default function AITrainer() {
  const { t, language } = useLanguage()

  const [dismissed, setDismissed] =
    useState<Set<string>>(new Set())

  const [trainerPlan, setTrainerPlan] =
    useState('')

  const [trainerLoading, setTrainerLoading] =
    useState(true)

  const [trainerError, setTrainerError] =
    useState('')

  const [userData, setUserData] =
    useState<any>(null)

  /*
   * USER + GOALS MA'LUMOTLARINI OLISH
   */
  useEffect(() => {
    const loadTrainer = async () => {
      try {
        setTrainerLoading(true)
        setTrainerError('')

        let storedUser: any = null

        try {
          const saved =
            localStorage.getItem('user')

          if (saved) {
            storedUser = JSON.parse(saved)
          }
        } catch {
          storedUser = null
        }

        /*
         * Goals backenddan olinadi.
         * Bu currentWeight va goalWeight
         * kabi ma'lumotlarni beradi.
         */
        let goals: any = null

        try {
          const goalsResponse =
            await apiFetch('/api/goals')

          goals = goalsResponse?.data || null
        } catch {
          goals = null
        }

        const profile = {
          ...storedUser,
          ...(goals || {}),
        }

        setUserData(profile)

        /*
         * Backenddagi getTrainerPlan
         * quyidagi body ni qabul qiladi:
         *
         * goal
         * weight
         * height
         * age
         * gender
         * fitnessLevel
         */

        const requestBody = {
          goal:
            profile.goal ||
            profile.goalType ||
            'healthy lifestyle',

          weight:
            Number(
              profile.currentWeight ||
                profile.weight,
            ) || 60,

          height:
            Number(profile.height) || 165,

          age:
            Number(profile.age) || 18,

          gender:
            profile.gender || 'female',

          fitnessLevel:
            profile.activity ||
            profile.fitnessLevel ||
            'beginner',
        }

        const response =
          await apiFetch('/api/ai/trainer', {
            method: 'POST',
            body: JSON.stringify(
              requestBody,
            ),
          })

        setTrainerPlan(
          response?.plan || '',
        )
      } catch (error: any) {
        console.error(
          'AI Trainer error:',
          error,
        )

        setTrainerError(
          error?.message ||
            'AI Trainer ma’lumotlarini olishda xatolik yuz berdi.',
        )
      } finally {
        setTrainerLoading(false)
      }
    }

    loadTrainer()
  }, [])

  /*
   * HAFTA KUNLARI
   */
  const WEEK_DAYS = [
    t('aiTrainer.days.mon'),
    t('aiTrainer.days.tue'),
    t('aiTrainer.days.wed'),
    t('aiTrainer.days.thu'),
    t('aiTrainer.days.fri'),
    t('aiTrainer.days.sat'),
    t('aiTrainer.days.sun'),
  ]

  /*
   * HOZIRCHA STEP/MEAL BACKENDLARI BILAN
   * KEYINGI BOSQICHDA BOG'LANADI.
   */
  const COMPLIANCE_DATA = [
    {
      day: WEEK_DAYS[0],
      score: 92,
      logged: true,
    },
    {
      day: WEEK_DAYS[1],
      score: 88,
      logged: true,
    },
    {
      day: WEEK_DAYS[2],
      score: 95,
      logged: true,
    },
    {
      day: WEEK_DAYS[3],
      score: 0,
      logged: false,
    },
    {
      day: WEEK_DAYS[4],
      score: 84,
      logged: true,
    },
    {
      day: WEEK_DAYS[5],
      score: 76,
      logged: true,
    },
    {
      day: WEEK_DAYS[6],
      score: 90,
      logged: true,
    },
  ]

  const WARNINGS = [
    {
      id: 'missed-thu',
      icon: AlertTriangle,
      title: t(
        'aiTrainer.warnings.missedThu.title',
      ),
      detail: t(
        'aiTrainer.warnings.missedThu.detail',
      ),
      severity: 'high' as const,
      tip: t(
        'aiTrainer.warnings.missedThu.tip',
      ),
    },

    {
      id: 'over-carbs',
      icon: AlertTriangle,
      title: t(
        'aiTrainer.warnings.overCarbs.title',
      ),
      detail: t(
        'aiTrainer.warnings.overCarbs.detail',
      ),
      severity: 'medium' as const,
      tip: t(
        'aiTrainer.warnings.overCarbs.tip',
      ),
    },

    {
      id: 'low-steps',
      icon: TrendingUp,
      title: t(
        'aiTrainer.warnings.lowSteps.title',
      ),
      detail: t(
        'aiTrainer.warnings.lowSteps.detail',
      ),
      severity: 'low' as const,
      tip: t(
        'aiTrainer.warnings.lowSteps.tip',
      ),
    },
  ]

  const HABITS = [
    {
      label: t(
        'aiTrainer.habits.loggedMeals',
      ),
      done: true,
      icon: Utensils,
    },

    {
      label: t(
        'aiTrainer.habits.hitProtein',
      ),
      done: true,
      icon: Check,
    },

    {
      label: t(
        'aiTrainer.habits.calorieRange',
      ),
      done: false,
      icon: Target,
    },

    {
      label: t(
        'aiTrainer.habits.completedSteps',
      ),
      done: false,
      icon: Footprints,
    },

    {
      label: t(
        'aiTrainer.habits.drankWater',
      ),
      done: true,
      icon: Sparkles,
    },
  ]

  const loggedDays =
    COMPLIANCE_DATA.filter(
      (d) => d.logged,
    )

  const avgScore =
    loggedDays.length > 0
      ? Math.round(
          loggedDays.reduce(
            (sum, d) =>
              sum + d.score,
            0,
          ) / loggedDays.length,
        )
      : 0

  const streak =
    COMPLIANCE_DATA.filter(
      (d) => d.logged,
    ).length

  const activeWarnings =
    WARNINGS.filter(
      (w) => !dismissed.has(w.id),
    )

  const dismiss = (id: string) => {
    setDismissed(
      (prev) =>
        new Set(prev).add(id),
    )
  }

  /*
   * AI PLANNI YANGILASH
   */
  const regenerateTrainerPlan =
    async () => {
      try {
        setTrainerLoading(true)
        setTrainerError('')

        const profile =
          userData || {}

        const requestBody = {
          goal:
            profile.goal ||
            profile.goalType ||
            'healthy lifestyle',

          weight:
            Number(
              profile.currentWeight ||
                profile.weight,
            ) || 60,

          height:
            Number(profile.height) || 165,

          age:
            Number(profile.age) || 18,

          gender:
            profile.gender || 'female',

          fitnessLevel:
            profile.activity ||
            profile.fitnessLevel ||
            'beginner',
        }

        const response =
          await apiFetch(
            '/api/ai/trainer',
            {
              method: 'POST',
              body: JSON.stringify(
                requestBody,
              ),
            },
          )

        setTrainerPlan(
          response?.plan || '',
        )
      } catch (error: any) {
        console.error(
          'Regenerate trainer error:',
          error,
        )

        setTrainerError(
          error?.message ||
            'AI Trainer xatoligi',
        )
      } finally {
        setTrainerLoading(false)
      }
    }

  return (
    <div className="mx-auto max-w-[1080px]">
      {/* Header */}
      <div className="mb-7">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
          <ShieldCheck className="size-3.5" />

          {t('aiTrainer.badge')}
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">
          {t('aiTrainer.title')}
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {t('aiTrainer.subtitle')}
        </p>
      </div>

      {/* Top stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        {/* Weekly score */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
              <Target className="size-5" />
            </div>

            <span className="text-3xl font-bold text-emerald-300">
              {avgScore}%
            </span>
          </div>

          <p className="mt-4 text-sm font-medium text-slate-400">
            {t(
              'aiTrainer.stats.weeklyScore',
            )}
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
              style={{
                width: `${avgScore}%`,
                boxShadow:
                  '0 0 10px rgba(52,211,153,0.3)',
              }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
              <Flame className="size-5" />
            </div>

            <span className="text-3xl font-bold text-amber-300">
              {streak}
            </span>
          </div>

          <p className="mt-4 text-sm font-medium text-slate-400">
            {t(
              'aiTrainer.stats.loggingStreak',
            )}
          </p>

          <div className="mt-3 flex gap-1">
            {COMPLIANCE_DATA.map(
              (d, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    d.logged
                      ? 'bg-amber-400/80'
                      : 'bg-rose-400/40'
                  }`}
                />
              ),
            )}
          </div>
        </div>

        {/* Warnings */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-400/15 text-rose-300">
              <AlertTriangle className="size-5" />
            </div>

            <span className="text-3xl font-bold text-rose-300">
              {activeWarnings.length}
            </span>
          </div>

          <p className="mt-4 text-sm font-medium text-slate-400">
            {t(
              'aiTrainer.stats.activeWarnings',
            )}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {dismissed.size > 0
              ? `${dismissed.size} ${t(
                  'aiTrainer.stats.dismissed',
                )}`
              : t(
                  'aiTrainer.stats.noDismissed',
                )}
          </p>
        </div>
      </section>

      {/* Weekly compliance */}
      <section className="mt-5 rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t(
                'aiTrainer.chart.title',
              )}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {t(
                'aiTrainer.chart.subtitle',
              )}
            </p>
          </div>

          <Zap className="size-5 text-emerald-400" />
        </div>

        <div className="mt-6 flex h-44 items-end gap-3">
          {COMPLIANCE_DATA.map(
            (d, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="relative w-full">
                  {!d.logged && (
                    <div className="absolute -top-1 left-1/2 z-10 flex size-5 -translate-x-1/2 items-center justify-center rounded-full bg-rose-400/20 ring-1 ring-rose-400/40">
                      <X className="size-3 text-rose-300" />
                    </div>
                  )}

                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      d.logged
                        ? 'bg-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                        : 'bg-rose-400/20'
                    }`}
                    style={{
                      height: d.logged
                        ? `${d.score * 1.4}px`
                        : '8px',
                    }}
                  />
                </div>

                <span
                  className={`text-xs ${
                    d.logged
                      ? 'text-slate-500'
                      : 'text-rose-400/60'
                  }`}
                >
                  {d.day}
                </span>

                {d.logged && (
                  <span className="text-[10px] font-semibold text-emerald-300">
                    {d.score}%
                  </span>
                )}
              </div>
            ),
          )}
        </div>
      </section>

      {/* Warnings + Habits */}
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* Warnings */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {t(
                  'aiTrainer.warningsSection.title',
                )}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {t(
                  'aiTrainer.warningsSection.subtitle',
                )}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {activeWarnings.map(
              (w) => {
                const Icon = w.icon
                const style =
                  severityStyle(
                    w.severity,
                  )

                return (
                  <div
                    key={w.id}
                    className={`rounded-xl border ${style.border} ${style.bg} p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${style.chip}`}
                      >
                        <Icon className="size-4.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">
                            {w.title}
                          </h3>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${style.chip}`}
                          >
                            {t(
                              `aiTrainer.severity.${w.severity}`,
                            )}
                          </span>
                        </div>

                        <p className="mt-1.5 text-xs leading-5 text-slate-400">
                          {w.detail}
                        </p>

                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-900/40 p-3">
                          <Sparkles className="size-3.5 shrink-0 text-emerald-400" />

                          <p className="text-xs leading-5 text-slate-300">
                            <span className="font-semibold text-emerald-300">
                              {t(
                                'aiTrainer.habitCorrection',
                              )}{' '}
                            </span>

                            {w.tip}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          dismiss(w.id)
                        }
                        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                        aria-label={t(
                          'aiTrainer.dismiss',
                        )}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                )
              },
            )}

            {activeWarnings.length ===
              0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="size-6" />
                </div>

                <p className="text-sm font-semibold text-white">
                  {t(
                    'aiTrainer.allClear.title',
                  )}
                </p>

                <p className="text-xs text-slate-500">
                  {t(
                    'aiTrainer.allClear.subtitle',
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Habits */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {t(
                  'aiTrainer.habitsSection.title',
                )}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {t(
                  'aiTrainer.habitsSection.subtitle',
                )}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            {HABITS.map(
              (habit, i) => {
                const Icon =
                  habit.icon

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl p-3.5 transition ${
                      habit.done
                        ? 'bg-emerald-400/[0.07]'
                        : 'bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                        habit.done
                          ? 'bg-emerald-400/15 text-emerald-300'
                          : 'bg-slate-700/50 text-slate-500'
                      }`}
                    >
                      <Icon className="size-4.5" />
                    </div>

                    <span
                      className={`flex-1 text-sm ${
                        habit.done
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {habit.label}
                    </span>

                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        habit.done
                          ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                          : 'border-slate-700 text-transparent'
                      }`}
                    >
                      <Check className="size-3.5" />
                    </span>
                  </div>
                )
              },
            )}
          </div>

          {/* REAL AI TRAINER RESPONSE */}
          <div className="mt-5 rounded-xl bg-slate-800/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                {t(
                  'aiTrainer.recommendation.title',
                )}
              </p>

              <button
                type="button"
                onClick={
                  regenerateTrainerPlan
                }
                disabled={trainerLoading}
                className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {trainerLoading
                  ? '...'
                  : language === 'uz'
                    ? 'Yangilash'
                    : language ===
                        'ru'
                      ? 'Обновить'
                      : 'Refresh'}
              </button>
            </div>

            {trainerLoading ? (
              <div className="mt-4 flex items-center gap-3">
                <div className="size-5 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />

                <p className="text-sm text-slate-400">
                  {language ===
                  'uz'
                    ? 'AI siz uchun reja tayyorlamoqda...'
                    : language ===
                        'ru'
                      ? 'AI готовит план для вас...'
                      : 'AI is preparing your plan...'}
                </p>
              </div>
            ) : trainerError ? (
              <div className="mt-3 rounded-lg border border-rose-400/20 bg-rose-400/5 p-3">
                <p className="text-xs text-rose-300">
                  {trainerError}
                </p>
              </div>
            ) : trainerPlan ? (
              <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {trainerPlan}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                {language ===
                'uz'
                  ? 'AI Trainer hozircha tavsiya bermadi.'
                  : language ===
                      'ru'
                    ? 'AI пока не дал рекомендацию.'
                    : 'AI has not provided a recommendation yet.'}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}