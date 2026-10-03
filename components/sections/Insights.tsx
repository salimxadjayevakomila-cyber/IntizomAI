 'use client'

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'
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

type TabKey =
  | 'weekly'
  | 'macros'
  | 'insights'

interface WeeklyDataItem {
  day: string
  date: string
  burned: number
  consumed: number
  steps: number
  protein: number
  carbs: number
  fat: number
}

interface MacroItem {
  name: string
  value: number
  grams: number
  color: string
}

type Insight = {
  id: string
  icon: React.ElementType
  tone: 'success' | 'warning' | 'info'
  title: string
  detail: string
  highlight: string
}

const defaultWeeklyData: WeeklyDataItem[] = [
  {
    day: 'Mon',
    date: '',
    burned: 0,
    consumed: 0,
    steps: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
  {
    day: 'Tue',
    date: '',
    burned: 0,
    consumed: 0,
    steps: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
  {
    day: 'Wed',
    date: '',
    burned: 0,
    consumed: 0,
    steps: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
  {
    day: 'Thu',
    date: '',
    burned: 0,
    consumed: 0,
    steps: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
  {
    day: 'Fri',
    date: '',
    burned: 0,
    consumed: 0,
    steps: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
  {
    day: 'Sat',
    date: '',
    burned: 0,
    consumed: 0,
    steps: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
  {
    day: 'Sun',
    date: '',
    burned: 0,
    consumed: 0,
    steps: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
]

const defaultMacroBreakdown: MacroItem[] = [
  {
    name: 'Protein',
    value: 0,
    grams: 0,
    color: '#34d399',
  },
  {
    name: 'Carbs',
    value: 0,
    grams: 0,
    color: '#5ac4a4',
  },
  {
    name: 'Fat',
    value: 0,
    grams: 0,
    color: '#f4bf77',
  },
]

const toneStyles: Record<
  Insight['tone'],
  {
    ring: string
    chip: string
    icon: string
  }
> = {
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

const translations = {
  uz: {
    aiSmartInsights: 'AI aqlli tahlillar',
    weeklyInsights: 'Haftalik tahlil',
    headerDescription:
      'Natijalaringizni kuzating, odatlarni aniqlang va AI tavsiyalarini oling.',
    weeklyProgress: 'Haftalik natijalar',
    macronutrients: 'Makronutrientlar',
    aiInsights: 'AI tahlillari',

    caloriesStepProgress: 'Kaloriya va qadamlar',
    caloriesStepDescription:
      'Sarflangan va iste’mol qilingan kaloriyalar hamda kunlik qadamlar',
    burned: 'Sarflangan',
    consumed: 'Iste’mol qilingan',
    steps: 'Qadamlar',
    peakBurnDay: 'Eng ko‘p sarflangan kun',
    peakStepDay: 'Eng ko‘p qadam kuni',

    stepTrend: 'Qadamlar dinamikasi',
    stepTrendDescription:
      'Hafta davomida kunlik qadamlar',

    macroDistribution:
      'Makronutrientlar taqsimoti',
    macroDescription:
      'Protein · Uglevodlar · Yog‘lar',
    total: 'Jami',
    dailyMacroBreakdown:
      'Kunlik makro taqsimoti',
    macroBreakdownDescription:
      'Hafta davomida makronutrientlar bo‘yicha ma’lumot',
    proteinRatio:
      'Protein ulushi yuqori — yaxshi ovqatlanish odatini saqlab qoling.',

    strongHabit: 'Yaxshi odat',
    improve: 'Yaxshilash',
    pattern: 'Namuna',
    aiInsight: 'AI tahlili',

    avgCaloriesBurned:
      'O‘rtacha sarflangan kaloriya',
    avgCaloriesConsumed:
      'O‘rtacha iste’mol qilingan kaloriya',
    totalStepsWeek:
      'Haftadagi jami qadamlar',
    hydrationScore:
      'Suv ichish ko‘rsatkichi',

    upVsLastWeek:
      'o‘tgan haftaga nisbatan yuqori',
    withinTargetRange:
      'belgilangan oraliqda',
    slightlyBelowGoal:
      'maqsaddan biroz past',

    kcalDay: 'kkal/kun',
    stepsUnit: 'qadam',

    monday: 'Dushanba',
    tuesday: 'Seshanba',
    wednesday: 'Chorshanba',
    thursday: 'Payshanba',
    friday: 'Juma',
    saturday: 'Shanba',
    sunday: 'Yakshanba',

    proteinInsightTitle:
      'Protein ko‘rsatkichi yaxshi',
    proteinInsightDetail:
      'Bugungi va haftalik ovqatlanish ma’lumotlaringiz asosida protein miqdorini kuzatib boring va kunlik maqsadingizga yaqinlashishga harakat qiling.',
    proteinHighlight:
      'Protein nazorat qilinmoqda',

    stepsInsightTitle:
      'Qadamlar faolligi',
    stepsInsightDetail:
      'Haftalik qadamlaringizni muntazam kuzatib boring. Kun davomida qisqa yurishlar ham umumiy faollikni oshirishga yordam beradi.',
    stepsHighlight:
      'Haftalik qadamlar',

    hydrationInsightTitle:
      'Suv ichishni unutmang',
    hydrationInsightDetail:
      'Kun davomida muntazam suv ichish odatini saqlash kundalik tartibni yaxshilashga yordam beradi.',
    hydrationHighlight:
      'Suv ko‘rsatkichi',

    eveningInsightTitle:
      'Ovqatlanish jadvalini kuzating',
    eveningInsightDetail:
      'Ovqatlanish vaqtlarini muntazam saqlash kundalik ovqatlanish tartibini yaxshiroq nazorat qilishga yordam beradi.',
    eveningHighlight:
      'Ovqatlanish tartibi',

    kcal: 'kkal',
    percent: '%',
    days: 'kun',
    dateRange:
      'Oxirgi 7 kun',
  },

  ru: {
    aiSmartInsights: 'Умный AI-анализ',
    weeklyInsights: 'Недельный анализ',
    headerDescription:
      'Отслеживайте прогресс, находите закономерности и получайте рекомендации AI.',
    weeklyProgress: 'Недельный прогресс',
    macronutrients: 'Макронутриенты',
    aiInsights: 'AI-анализ',

    caloriesStepProgress:
      'Калории и шаги',
    caloriesStepDescription:
      'Сожжённые и потреблённые калории вместе с ежедневными шагами',
    burned: 'Сожжено',
    consumed: 'Потреблено',
    steps: 'Шаги',
    peakBurnDay:
      'День с максимальным расходом',
    peakStepDay:
      'День с максимальным количеством шагов',

    stepTrend: 'Динамика шагов',
    stepTrendDescription:
      'Ежедневные шаги за неделю',

    macroDistribution:
      'Распределение макронутриентов',
    macroDescription:
      'Белки · Углеводы · Жиры',
    total: 'Всего',
    dailyMacroBreakdown:
      'Ежедневное распределение макроэлементов',
    macroBreakdownDescription:
      'Данные по макронутриентам за неделю',
    proteinRatio:
      'Доля белка высокая — продолжайте поддерживать стабильные пищевые привычки.',

    strongHabit: 'Хорошая привычка',
    improve: 'Улучшить',
    pattern: 'Тенденция',
    aiInsight: 'AI-анализ',

    avgCaloriesBurned:
      'Среднее количество сожжённых калорий',
    avgCaloriesConsumed:
      'Среднее количество потреблённых калорий',
    totalStepsWeek:
      'Всего шагов за неделю',
    hydrationScore:
      'Показатель гидратации',

    upVsLastWeek:
      'выше, чем на прошлой неделе',
    withinTargetRange:
      'в пределах диапазона',
    slightlyBelowGoal:
      'немного ниже цели',

    kcalDay: 'ккал/день',
    stepsUnit: 'шагов',

    monday: 'Пн',
    tuesday: 'Вт',
    wednesday: 'Ср',
    thursday: 'Чт',
    friday: 'Пт',
    saturday: 'Сб',
    sunday: 'Вс',

    proteinInsightTitle:
      'Показатель белка хороший',
    proteinInsightDetail:
      'Следите за количеством белка на основе ваших данных о питании и старайтесь приближаться к дневной цели.',
    proteinHighlight:
      'Белок отслеживается',

    stepsInsightTitle:
      'Активность по шагам',
    stepsInsightDetail:
      'Регулярно отслеживайте количество шагов за неделю. Даже короткие прогулки помогают увеличить общую активность.',
    stepsHighlight:
      'Шаги за неделю',

    hydrationInsightTitle:
      'Не забывайте пить воду',
    hydrationInsightDetail:
      'Регулярное употребление воды в течение дня помогает поддерживать полезную ежедневную привычку.',
    hydrationHighlight:
      'Показатель воды',

    eveningInsightTitle:
      'Следите за режимом питания',
    eveningInsightDetail:
      'Стабильный график питания помогает лучше контролировать ежедневный рацион.',
    eveningHighlight:
      'Режим питания',

    kcal: 'ккал',
    percent: '%',
    days: 'дней',
    dateRange:
      'Последние 7 дней',
  },

  en: {
    aiSmartInsights:
      'AI Smart Insights',
    weeklyInsights:
      'Weekly Insights',
    headerDescription:
      'Track your progress, spot patterns, and get AI-powered recommendations.',
    weeklyProgress:
      'Weekly progress',
    macronutrients:
      'Macronutrients',
    aiInsights:
      'AI insights',

    caloriesStepProgress:
      'Calories & step progress',
    caloriesStepDescription:
      'Burned vs consumed alongside daily steps',
    burned: 'Burned',
    consumed: 'Consumed',
    steps: 'Steps',
    peakBurnDay:
      'Peak burn day',
    peakStepDay:
      'Peak step day',

    stepTrend:
      'Step trend',
    stepTrendDescription:
      'Daily steps over the week',

    macroDistribution:
      'Macronutrient distribution',
    macroDescription:
      'Protein · Carbs · Fat breakdown',
    total: 'Total',
    dailyMacroBreakdown:
      'Daily macro breakdown',
    macroBreakdownDescription:
      'Macro information across the week',
    proteinRatio:
      'Your protein ratio is high — keep building consistent nutrition habits.',

    strongHabit:
      'Strong habit',
    improve:
      'Improve',
    pattern:
      'Pattern',
    aiInsight:
      'AI insight',

    avgCaloriesBurned:
      'Avg. calories burned',
    avgCaloriesConsumed:
      'Avg. calories consumed',
    totalStepsWeek:
      'Total steps this week',
    hydrationScore:
      'Water hydration score',

    upVsLastWeek:
      'up vs last week',
    withinTargetRange:
      'within target range',
    slightlyBelowGoal:
      'slightly below goal',

    kcalDay:
      'kcal/day',
    stepsUnit:
      'steps',

    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',

    proteinInsightTitle:
      'Protein intake is being tracked',
    proteinInsightDetail:
      'Keep tracking your protein intake based on your nutrition data and work toward your daily target.',
    proteinHighlight:
      'Protein tracking',

    stepsInsightTitle:
      'Step activity',
    stepsInsightDetail:
      'Keep monitoring your weekly step count. Short walks throughout the day can also improve your overall activity.',
    stepsHighlight:
      'Weekly steps',

    hydrationInsightTitle:
      'Remember to stay hydrated',
    hydrationInsightDetail:
      'Regular water breaks throughout the day can help you maintain a consistent hydration habit.',
    hydrationHighlight:
      'Water tracking',

    eveningInsightTitle:
      'Keep an eye on your meal schedule',
    eveningInsightDetail:
      'Maintaining a consistent meal schedule can help you better manage your daily nutrition routine.',
    eveningHighlight:
      'Meal schedule',

    kcal: 'kcal',
    percent: '%',
    days: 'days',
    dateRange:
      'Last 7 days',
  },
} as const

function getDayLabel(
  day: string,
  language: string,
) {
  const t =
    language === 'uz'
      ? translations.uz
      : language === 'ru'
        ? translations.ru
        : translations.en

  const days: Record<
    string,
    string
  > = {
    Mon: t.monday,
    Tue: t.tuesday,
    Wed: t.wednesday,
    Thu: t.thursday,
    Fri: t.friday,
    Sat: t.saturday,
    Sun: t.sunday,
  }

  return days[day] ?? day
}

function getMacroLabel(
  name: string,
  language: string,
) {
  if (language === 'uz') {
    if (name === 'Protein')
      return 'Protein'

    if (name === 'Carbs')
      return 'Uglevodlar'

    if (name === 'Fat')
      return 'Yog‘lar'
  }

  if (language === 'ru') {
    if (name === 'Protein')
      return 'Белок'

    if (name === 'Carbs')
      return 'Углеводы'

    if (name === 'Fat')
      return 'Жиры'
  }

  return name
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    color?: string
  }>
  label?: string
  unit: string
}

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: ChartTooltipProps) {
  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-semibold text-slate-200">
        {label}
      </p>

      {payload.map(
        (entry, index) => (
          <p
            key={
              entry.name || index
            }
            className="flex items-center gap-1.5 text-slate-300"
          >
            <span
              className="size-2 rounded-full"
              style={{
                background:
                  entry.color,
              }}
            />

            <span className="capitalize">
              {entry.name}
            </span>

            <span className="ml-auto font-semibold text-white">
              {entry.value?.toLocaleString()}{' '}
              {unit}
            </span>
          </p>
        ),
      )}
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
        <div
          className={`flex size-10 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon className="size-5" />
        </div>

        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            trendDirection === 'up'
              ? 'bg-emerald-400/15 text-emerald-300'
              : 'bg-rose-400/15 text-rose-300'
          }`}
        >
          {trendDirection ===
          'up' ? (
            <ArrowUpRight className="size-3" />
          ) : (
            <ArrowDownRight className="size-3" />
          )}

          {trend}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-3xl font-semibold tracking-[-0.04em] text-white">
        {value}

        {unit && (
          <span className="ml-1.5 text-sm font-normal text-slate-400">
            {unit}
          </span>
        )}
      </p>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />

        {trendLabel}
      </div>

      {children}
    </div>
  )
}

interface WeeklyChartProps {
  weeklyData: WeeklyDataItem[]
}

export function WeeklyChart({
  weeklyData,
}: WeeklyChartProps) {
  const { language } =
    useLanguage()

  const t =
    language === 'uz'
      ? translations.uz
      : language === 'ru'
        ? translations.ru
        : translations.en

  const maxSteps = Math.max(
    ...weeklyData.map(
      (d) => d.steps,
    ),
    0,
  )

  const peakDay =
    weeklyData.find(
      (d) =>
        d.steps === maxSteps,
    )?.day ?? ''

  const bestBurnDay =
    weeklyData.reduce(
      (best, d) =>
        d.burned > best.burned
          ? d
          : best,
      weeklyData[0] ||
        defaultWeeklyData[0],
    )

  return (
    <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t.caloriesStepProgress}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {t.caloriesStepDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="size-2.5 rounded-sm bg-emerald-400" />
              {t.burned}
            </span>

            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="size-2.5 rounded-sm bg-sky-400" />
              {t.consumed}
            </span>

            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="size-2.5 rounded-full border-2 border-amber-400" />
              {t.steps}
            </span>
          </div>
        </div>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={weeklyData}
              barGap={3}
              margin={{
                top: 8,
                right: 8,
                left: -18,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="burnedGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#34d399"
                    stopOpacity={0.95}
                  />

                  <stop
                    offset="100%"
                    stopColor="#34d399"
                    stopOpacity={0.45}
                  />
                </linearGradient>

                <linearGradient
                  id="consumedGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#38bdf8"
                    stopOpacity={0.9}
                  />

                  <stop
                    offset="100%"
                    stopColor="#38bdf8"
                    stopOpacity={0.4}
                  />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="day"
                tickFormatter={(
                  value,
                ) =>
                  getDayLabel(
                    value,
                    language,
                  )
                }
                tick={{
                  fill: '#64748b',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: '#64748b',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={
                  <ChartTooltip
                    unit={t.kcal}
                  />
                }
                cursor={{
                  fill: 'rgba(148,163,184,0.06)',
                }}
              />

              <Bar
                dataKey="burned"
                name={t.burned}
                fill="url(#burnedGrad)"
                radius={[
                  5,
                  5,
                  0,
                  0,
                ]}
                maxBarSize={26}
              />

              <Bar
                dataKey="consumed"
                name={t.consumed}
                fill="url(#consumedGrad)"
                radius={[
                  5,
                  5,
                  0,
                  0,
                ]}
                maxBarSize={26}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-800 pt-4">
          <div className="rounded-xl bg-slate-800/50 px-4 py-3">
            <p className="text-xs text-slate-500">
              {t.peakBurnDay}
            </p>

            <p className="mt-1 text-sm font-semibold text-emerald-300">
              {getDayLabel(
                bestBurnDay.day,
                language,
              )}{' '}
              · {bestBurnDay.burned}{' '}
              {t.kcal}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/50 px-4 py-3">
            <p className="text-xs text-slate-500">
              {t.peakStepDay}
            </p>

            <p className="mt-1 text-sm font-semibold text-amber-300">
              {getDayLabel(
                peakDay,
                language,
              )}{' '}
              · {maxSteps.toLocaleString()}{' '}
              {t.stepsUnit}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t.stepTrend}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {t.stepTrendDescription}
            </p>
          </div>

          <Footprints className="size-5 text-amber-400" />
        </div>

        <div className="mt-6 h-56 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={weeklyData}
              margin={{
                top: 8,
                right: 8,
                left: -18,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="stepGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#f4bf77"
                    stopOpacity={0.5}
                  />

                  <stop
                    offset="100%"
                    stopColor="#f4bf77"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="day"
                tickFormatter={(
                  value,
                ) =>
                  getDayLabel(
                    value,
                    language,
                  )
                }
                tick={{
                  fill: '#64748b',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: '#64748b',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={
                  <ChartTooltip
                    unit={t.stepsUnit}
                  />
                }
                cursor={{
                  stroke:
                    'rgba(244,191,119,0.25)',
                }}
              />

              <Area
                type="monotone"
                dataKey="steps"
                name={t.steps}
                stroke="#f4bf77"
                strokeWidth={2.5}
                fill="url(#stepGrad)"
                dot={{
                  r: 3,
                  fill: '#f4bf77',
                }}
                activeDot={{
                  r: 5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

interface MacroChartProps {
  macroBreakdown: MacroItem[]
}

export function MacroChart({
  macroBreakdown,
}: MacroChartProps) {
  const { language } =
    useLanguage()

  const t =
    language === 'uz'
      ? translations.uz
      : language === 'ru'
        ? translations.ru
        : translations.en

  const totalPercent =
    macroBreakdown.reduce(
      (sum, m) =>
        sum + m.value,
      0,
    )

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t.macroDistribution}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {t.macroDescription}
            </p>
          </div>
        </div>

        <div className="relative mt-4 h-56 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
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
                {macroBreakdown.map(
                  (entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        entry.color
                      }
                    />
                  ),
                )}
              </Pie>

              <Tooltip
                content={({
                  active,
                  payload,
                }) => {
                  if (
                    !active ||
                    !payload ||
                    payload.length === 0
                  ) {
                    return null
                  }

                  const item =
                    payload[0]

                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs shadow-xl">
                      <p className="font-semibold text-slate-200">
                        {getMacroLabel(
                          String(
                            item.name,
                          ),
                          language,
                        )}
                      </p>

                      <p className="text-slate-300">
                        {item.value}
                        {t.percent}
                      </p>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-slate-500">
              {t.total}
            </p>

            <p className="text-2xl font-semibold text-white">
              {totalPercent}
              {t.percent}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {macroBreakdown.map(
            (macro) => (
              <div
                key={macro.name}
                className="flex items-center gap-2.5 rounded-lg bg-slate-800/40 px-3 py-2"
              >
                <span
                  className="size-3 rounded-full"
                  style={{
                    background:
                      macro.color,
                  }}
                />

                <span className="text-sm font-medium text-slate-200">
                  {getMacroLabel(
                    macro.name,
                    language,
                  )}
                </span>

                <span className="ml-auto text-sm font-semibold text-white">
                  {macro.value}
                  {t.percent}
                  {macro.grams > 0 && (
                    <span className="ml-1 text-slate-500">
                      ({macro.grams}g)
                    </span>
                  )}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t.dailyMacroBreakdown}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {t.macroBreakdownDescription}
            </p>
          </div>
        </div>

        <div className="mt-6 h-56 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={macroBreakdown}
              margin={{
                top: 8,
                right: 8,
                left: -20,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="name"
                tickFormatter={(
                  value,
                ) =>
                  getMacroLabel(
                    value,
                    language,
                  )
                }
                tick={{
                  fill: '#64748b',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: '#64748b',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={
                  <ChartTooltip
                    unit={t.percent}
                  />
                }
                cursor={{
                  fill:
                    'rgba(148,163,184,0.06)',
                }}
              />

              <Bar
                dataKey="value"
                name={t.percent}
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
                maxBarSize={60}
              >
                {macroBreakdown.map(
                  (entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        entry.color
                      }
                    />
                  ),
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-400/[0.07] px-4 py-3 text-xs text-emerald-200 ring-1 ring-emerald-400/20">
          <Check className="size-4 shrink-0 text-emerald-400" />

          {t.proteinRatio}
        </div>
      </div>
    </div>
  )
}

export function AIInsights() {
  const { language } =
    useLanguage()

  const t =
    language === 'uz'
      ? translations.uz
      : language === 'ru'
        ? translations.ru
        : translations.en

  const translatedInsights = [
    {
      id: 'protein',
      icon: Award,
      tone: 'success' as const,
      title:
        t.proteinInsightTitle,
      detail:
        t.proteinInsightDetail,
      highlight:
        t.proteinHighlight,
    },
    {
      id: 'steps',
      icon: TrendingUp,
      tone: 'info' as const,
      title:
        t.stepsInsightTitle,
      detail:
        t.stepsInsightDetail,
      highlight:
        t.stepsHighlight,
    },
    {
      id: 'hydration',
      icon: Droplets,
      tone: 'warning' as const,
      title:
        t.hydrationInsightTitle,
      detail:
        t.hydrationInsightDetail,
      highlight:
        t.hydrationHighlight,
    },
    {
      id: 'evening',
      icon: Clock,
      tone: 'info' as const,
      title:
        t.eveningInsightTitle,
      detail:
        t.eveningInsightDetail,
      highlight:
        t.eveningHighlight,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {translatedInsights.map(
        (insight) => {
          const Icon =
            insight.icon

          const tone =
            toneStyles[
              insight.tone
            ]

          return (
            <article
              key={insight.id}
              className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.05)] ring-1 ${tone.ring} transition hover:border-emerald-700/50 sm:p-6`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}
                >
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${tone.chip}`}
                    >
                      {insight.tone ===
                      'success'
                        ? t.strongHabit
                        : insight.tone ===
                            'warning'
                          ? t.improve
                          : t.pattern}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <Lightbulb className="size-3 text-emerald-400" />

                      {t.aiInsight}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-base font-semibold leading-snug text-white">
                    {insight.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {insight.detail}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-200">
                    <Sparkles className="size-3.5 text-emerald-400" />

                    {insight.highlight}
                  </div>
                </div>
              </div>
            </article>
          )
        },
      )}
    </div>
  )
}

export default function Insights() {
  const { language } =
    useLanguage()

  const t =
    language === 'uz'
      ? translations.uz
      : language === 'ru'
        ? translations.ru
        : translations.en

  const [activeTab, setActiveTab] =
    useState<TabKey>('weekly')

  const [weeklyData, setWeeklyData] =
    useState<WeeklyDataItem[]>(
      defaultWeeklyData,
    )

  const [
    macroBreakdown,
    setMacroBreakdown,
  ] = useState<MacroItem[]>(
    defaultMacroBreakdown,
  )

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    const loadInsights =
      async () => {
        try {
          setLoading(true)
          setError('')

          const API_URL =
            process.env
              .NEXT_PUBLIC_API_URL ||
            'http://localhost:5001'

          const token =
            localStorage.getItem(
              'token',
            )

          if (!token) {
            throw new Error(
              'Avval akkauntga kiring.',
            )
          }

          const response =
            await fetch(
              `${API_URL}/api/insights`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )

          const data =
            await response.json()

          if (
            !response.ok ||
            data?.success === false
          ) {
            throw new Error(
              data?.message ||
                'Insights yuklanmadi',
            )
          }

          setWeeklyData(
            data?.data
              ?.weeklyData ||
              defaultWeeklyData,
          )

          setMacroBreakdown(
            data?.data
              ?.macroBreakdown ||
              defaultMacroBreakdown,
          )
        } catch (err) {
          console.error(
            'Insights error:',
            err,
          )

          setError(
            err instanceof Error
              ? err.message
              : 'Insights yuklanmadi',
          )
        } finally {
          setLoading(false)
        }
      }

    loadInsights()
  }, [])

  const weeklyAverages =
    useMemo(() => {
      const totals =
        weeklyData.reduce(
          (acc, d) => ({
            burned:
              acc.burned +
              d.burned,

            consumed:
              acc.consumed +
              d.consumed,

            steps:
              acc.steps +
              d.steps,
          }),
          {
            burned: 0,
            consumed: 0,
            steps: 0,
          },
        )

      const days =
        weeklyData.length || 1

      return {
        avgBurned:
          Math.round(
            totals.burned /
              days,
          ),

        avgConsumed:
          Math.round(
            totals.consumed /
              days,
          ),

        totalSteps:
          totals.steps,
      }
    }, [weeklyData])

  /*
   * Water consumption is not connected
   * to backend yet.
   *
   * We keep the existing UI value until
   * daily water tracking is implemented.
   */
  const hydrationScore = 82

  const tabs: {
    key: TabKey
    label: string
  }[] = [
    {
      key: 'weekly',
      label:
        t.weeklyProgress,
    },
    {
      key: 'macros',
      label:
        t.macronutrients,
    },
    {
      key: 'insights',
      label: t.aiInsights,
    },
  ]

  if (loading) {
    return (
      <div className="mx-auto max-w-[1100px]">
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15]">
          <div className="text-center">
            <div className="mx-auto size-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />

            <p className="mt-4 text-sm text-slate-400">
              Loading insights...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1100px]">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
          <p className="text-sm text-rose-300">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1100px]">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            <Sparkles className="size-3.5" />

            {t.aiSmartInsights}
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">
            {t.weeklyInsights}
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {t.headerDescription}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
          <Clock className="size-4 text-emerald-400" />

          {t.dateRange}
        </div>
      </div>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Flame}
          label={
            t.avgCaloriesBurned
          }
          value={weeklyAverages.avgBurned.toLocaleString()}
          unit={t.kcalDay}
          trend="—"
          trendLabel={
            t.withinTargetRange
          }
          trendDirection="up"
          accent="bg-emerald-400/15 text-emerald-300"
        />

        <StatCard
          icon={Zap}
          label={
            t.avgCaloriesConsumed
          }
          value={weeklyAverages.avgConsumed.toLocaleString()}
          unit={t.kcalDay}
          trend="—"
          trendLabel={
            t.withinTargetRange
          }
          trendDirection="up"
          accent="bg-sky-400/15 text-sky-300"
        />

        <StatCard
          icon={Footprints}
          label={
            t.totalStepsWeek
          }
          value={weeklyAverages.totalSteps.toLocaleString()}
          unit={t.stepsUnit}
          trend="—"
          trendLabel={
            t.upVsLastWeek
          }
          trendDirection="up"
          accent="bg-violet-400/15 text-violet-300"
        />

        <StatCard
          icon={Droplets}
          label={
            t.hydrationScore
          }
          value={`${hydrationScore}%`}
          unit=""
          trend="—"
          trendLabel={
            t.slightlyBelowGoal
          }
          trendDirection="down"
          accent="bg-cyan-400/15 text-cyan-300"
        >
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              style={{
                width: `${hydrationScore}%`,
              }}
            />
          </div>
        </StatCard>
      </section>

      {/* Tabs */}
      <div className="mt-7 flex gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 p-1">
        {tabs.map(
          (tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(
                  tab.key,
                )
              }
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                activeTab ===
                tab.key
                  ? 'bg-emerald-400/15 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.12)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ),
        )}
      </div>

      {/* Panels */}
      <div className="mt-5">
        {activeTab ===
          'weekly' && (
          <WeeklyChart
            weeklyData={
              weeklyData
            }
          />
        )}

        {activeTab ===
          'macros' && (
          <MacroChart
            macroBreakdown={
              macroBreakdown
            }
          />
        )}

        {activeTab ===
          'insights' && (
          <AIInsights />
        )}
      </div>
    </div>
  )
}