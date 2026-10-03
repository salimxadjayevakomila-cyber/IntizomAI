 'use client'

import { useEffect, useState } from 'react'
import {
    CalendarDays,
    Check,
    Dumbbell,
    HeartPulse,
    MessageCircle,
    RefreshCw,
    Send,
    ShieldCheck,
    Sparkles,
    Utensils,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001'

type TrainerPreferences = {
    fitnessLevel: string
    activityLevel: string
    preferredActivity: string
    availableDays: string
    focus: string
}

type ChatMessage = {
    role: 'user' | 'assistant'
    text: string
}

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
                'Content-Type': 'application/json',
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

    let data: any = {}

    try {
        data = text ? JSON.parse(text) : {}
    } catch {
        data = {}
    }

    if (!response.ok || data.success === false) {
        throw new Error(
            data.message ||
            'Serverda xatolik yuz berdi'
        )
    }

    return data
}

export default function AITrainer() {
    const { language } = useLanguage()

    const [preferences, setPreferences] =
        useState<TrainerPreferences>({
            fitnessLevel: 'beginner',
            activityLevel: 'normal',
            preferredActivity: 'general movement',
            availableDays: 'flexible',
            focus: 'healthy habits and general fitness',
        })

    const [plan, setPlan] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [chatMessages, setChatMessages] =
        useState<ChatMessage[]>([])

    const [chatInput, setChatInput] =
        useState('')

    const [chatLoading, setChatLoading] =
        useState(false)

    const [chatError, setChatError] =
        useState('')

    const copy = {
        uz: {
            title: 'AI Trainer',
            subtitle:
                'Sog‘lom odatlar va umumiy fitness uchun shaxsiy AI yordamchi.',
            regenerate: 'Qayta yaratish',

            trainer: 'AI Trainer',
            trainerDesc:
                'Sizning umumiy fitness preference’laringiz asosida reja yaratadi.',

            preferences: 'Preferences',

            fitnessLevel: 'Fitness darajasi',
            activityLevel: 'Faollik darajasi',
            preferredActivity: 'Yoqadigan faoliyat',
            availableDays: 'Mavjud kunlar',
            focus: 'Asosiy fokus',

            beginner: 'Boshlang‘ich',
            intermediate: 'O‘rta',
            advanced: 'Yuqori',

            low: 'Kam',
            normal: 'Normal',
            active: 'Faol',

            generalMovement: 'Umumiy harakat',
            walking: 'Yurish',
            running: 'Yugurish',
            gym: 'Gym',
            homeWorkout: 'Uy mashqlari',
            cycling: 'Velosiped',

            flexible: 'Moslashuvchan',
            threeDays: 'Haftasiga 3 kun',
            fourDays: 'Haftasiga 4 kun',
            fiveDays: 'Haftasiga 5 kun',

            healthyHabits:
                'Sog‘lom odatlar',
            generalFitness:
                'Umumiy fitness',
            strength:
                'Kuch va harakat',
            mobility:
                'Mobillik va harakatchanlik',

            generate:
                'AI reja yaratish',

            yourPlan:
                'Sizning AI rejangiz',

            loading:
                'AI reja tayyorlamoqda...',

            empty:
                'Hali AI reja yaratilmagan.',

            errorTitle:
                'AI Trainer ishlamadi',

            retry:
                'Qayta urinish',

            safeTitle:
                'Xavfsiz va umumiy yondashuv',

            safeText:
                'AI Trainer tana o‘lchovlaridan foydalanib kaloriya, suv yoki makro target hisoblamaydi.',

            today:
                'Bugun',

            weekly:
                'Haftalik reja',

            workout:
                'Workout',

            recovery:
                'Recovery',

            nutrition:
                'Ovqatlanish odatlari',

            motivation:
                'Motivatsiya',

            chatTitle:
                'AI Chat',

            chatSubtitle:
                'Ovqatlanish, fitness, mashqlar va sog‘lom odatlar haqida AI bilan suhbatlashing.',

            chatPlaceholder:
                'AI ga savol yozing...',

            send:
                'Yuborish',

            chatEmpty:
                'Salom! Men INTIZOM AI yordamchisiman. Ovqatlanish, fitness, mashqlar, uyqu va sog‘lom odatlar haqida savollaringizni berishingiz mumkin.',

            chatLoading:
                'AI javob tayyorlamoqda...',

            chatError:
                'AI Chat hozir ishlamadi. Birozdan keyin qayta urinib ko‘ring.',

            noTargets:
                'AI Trainer siz uchun shaxsiy kaloriya yoki suv targetini hisoblamaydi. Bu bo‘lim umumiy sog‘lom odatlar va fitnessga qaratilgan.',
        },

        ru: {
            title: 'AI Trainer',
            subtitle:
                'AI-помощник для здоровых привычек и общего фитнеса.',
            regenerate: 'Создать заново',

            trainer: 'AI Trainer',
            trainerDesc:
                'Создаёт план на основе ваших общих фитнес-предпочтений.',

            preferences: 'Предпочтения',

            fitnessLevel: 'Уровень фитнеса',
            activityLevel: 'Уровень активности',
            preferredActivity: 'Предпочитаемая активность',
            availableDays: 'Доступные дни',
            focus: 'Основной фокус',

            beginner: 'Начальный',
            intermediate: 'Средний',
            advanced: 'Продвинутый',

            low: 'Низкий',
            normal: 'Обычный',
            active: 'Активный',

            generalMovement: 'Общая активность',
            walking: 'Ходьба',
            running: 'Бег',
            gym: 'Зал',
            homeWorkout: 'Домашняя тренировка',
            cycling: 'Велосипед',

            flexible: 'Гибкий',
            threeDays: '3 дня в неделю',
            fourDays: '4 дня в неделю',
            fiveDays: '5 дней в неделю',

            healthyHabits:
                'Здоровые привычки',
            generalFitness:
                'Общий фитнес',
            strength:
                'Сила и движение',
            mobility:
                'Мобильность',

            generate:
                'Создать AI план',

            yourPlan:
                'Ваш AI план',

            loading:
                'AI создаёт план...',

            empty:
                'AI план ещё не создан.',

            errorTitle:
                'AI Trainer не работает',

            retry:
                'Повторить',

            safeTitle:
                'Безопасный общий подход',

            safeText:
                'AI Trainer не рассчитывает калории, воду или макроцели на основе параметров тела.',

            today:
                'Сегодня',

            weekly:
                'План на неделю',

            workout:
                'Тренировка',

            recovery:
                'Восстановление',

            nutrition:
                'Питание',

            motivation:
                'Мотивация',

            chatTitle:
                'AI Chat',

            chatSubtitle:
                'Общайтесь с AI о питании, фитнесе, тренировках и здоровых привычках.',

            chatPlaceholder:
                'Напишите вопрос AI...',

            send:
                'Отправить',

            chatEmpty:
                'Привет! Я помощник INTIZOM AI. Вы можете спрашивать меня о питании, фитнесе, тренировках, сне и здоровых привычках.',

            chatLoading:
                'AI готовит ответ...',

            chatError:
                'AI Chat сейчас не работает. Попробуйте позже.',

            noTargets:
                'AI Trainer не рассчитывает персональные цели по калориям или воде. Этот раздел посвящён общему здоровью и фитнесу.',
        },

        en: {
            title: 'AI Trainer',
            subtitle:
                'An AI assistant for healthy habits and general fitness.',
            regenerate: 'Regenerate',

            trainer: 'AI Trainer',
            trainerDesc:
                'Creates a plan based on your general fitness preferences.',

            preferences: 'Preferences',

            fitnessLevel: 'Fitness level',
            activityLevel: 'Activity level',
            preferredActivity: 'Preferred activity',
            availableDays: 'Available days',
            focus: 'Main focus',

            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced',

            low: 'Low',
            normal: 'Normal',
            active: 'Active',

            generalMovement: 'General movement',
            walking: 'Walking',
            running: 'Running',
            gym: 'Gym',
            homeWorkout: 'Home workout',
            cycling: 'Cycling',

            flexible: 'Flexible',
            threeDays: '3 days per week',
            fourDays: '4 days per week',
            fiveDays: '5 days per week',

            healthyHabits:
                'Healthy habits',
            generalFitness:
                'General fitness',
            strength:
                'Strength and movement',
            mobility:
                'Mobility',

            generate:
                'Generate AI plan',

            yourPlan:
                'Your AI plan',

            loading:
                'AI is creating your plan...',

            empty:
                'No AI plan has been created yet.',

            errorTitle:
                'AI Trainer failed',

            retry:
                'Try again',

            safeTitle:
                'Safe general approach',

            safeText:
                'AI Trainer does not calculate calorie, water or macro targets from body measurements.',

            today:
                'Today',

            weekly:
                'Weekly plan',

            workout:
                'Workout',

            recovery:
                'Recovery',

            nutrition:
                'Nutrition habits',

            motivation:
                'Motivation',

            chatTitle:
                'AI Chat',

            chatSubtitle:
                'Chat with AI about nutrition, fitness, workouts and healthy habits.',

            chatPlaceholder:
                'Ask AI a question...',

            send:
                'Send',

            chatEmpty:
                'Hi! I am the INTIZOM AI assistant. You can ask me about nutrition, fitness, workouts, sleep and healthy habits.',

            chatLoading:
                'AI is preparing an answer...',

            chatError:
                'AI Chat is temporarily unavailable. Please try again later.',

            noTargets:
                'AI Trainer does not calculate personal calorie or water targets. This section focuses on general wellness and fitness.',
        },
    }

    const t =
        copy[
            language === 'ru'
                ? 'ru'
                : language === 'en'
                    ? 'en'
                    : 'uz'
        ]

    // ============================================================
    // AI TRAINER
    // ============================================================

    const generateTrainerPlan =
        async () => {
            try {
                setLoading(true)
                setError('')

                const data =
                    await apiFetch(
                        '/api/ai/trainer',
                        {
                            method: 'POST',
                            body: JSON.stringify(
                                preferences
                            ),
                        }
                    )

                setPlan(
                    data.plan ||
                    data.data?.plan ||
                    ''
                )
            } catch (err: any) {
                console.error(
                    'AI Trainer error:',
                    err
                )

                setError(
                    err?.message ||
                    t.errorTitle
                )
            } finally {
                setLoading(false)
            }
        }

    useEffect(() => {
        generateTrainerPlan()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updatePreference = (
        key: keyof TrainerPreferences,
        value: string
    ) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const getPlanSections = () => {
        if (!plan) return []

        const normalized =
            plan.replace(/\r/g, '').trim()

        const headings = [
            {
                key: 'today',
                labels: [
                    '1. TODAY',
                    'TODAY',
                    '1. BUGUN',
                    'BUGUN',
                    '1. СЕГОДНЯ',
                    'СЕГОДНЯ',
                ],
                icon: CalendarDays,
                title: t.today,
            },
            {
                key: 'weekly',
                labels: [
                    '2. WEEKLY PLAN',
                    'WEEKLY PLAN',
                    '2. HAFTALIK REJA',
                    'HAFTALIK REJA',
                    '2. ПЛАН НА НЕДЕЛЮ',
                    'ПЛАН НА НЕДЕЛЮ',
                ],
                icon: CalendarDays,
                title: t.weekly,
            },
            {
                key: 'workout',
                labels: [
                    '3. WORKOUT',
                    'WORKOUT',
                    '3. MASHQ',
                    'MASHQ',
                    '3. ТРЕНИРОВКА',
                    'ТРЕНИРОВКА',
                ],
                icon: Dumbbell,
                title: t.workout,
            },
            {
                key: 'recovery',
                labels: [
                    '4. REST & RECOVERY',
                    'REST & RECOVERY',
                    '4. DAM OLISH',
                    'DAM OLISH',
                    '4. ВОССТАНОВЛЕНИЕ',
                    'ВОССТАНОВЛЕНИЕ',
                ],
                icon: HeartPulse,
                title: t.recovery,
            },
            {
                key: 'nutrition',
                labels: [
                    '5. NUTRITION HABITS',
                    'NUTRITION HABITS',
                    '5. OVQATLANISH ODATLARI',
                    'OVQATLANISH ODATLARI',
                    '5. ПИТАНИЕ',
                    'ПИТАНИЕ',
                ],
                icon: Utensils,
                title: t.nutrition,
            },
            {
                key: 'motivation',
                labels: [
                    '7. MOTIVATION',
                    'MOTIVATION',
                    '7. MOTIVATSIYA',
                    'MOTIVATSIYA',
                    '7. МОТИВАЦИЯ',
                    'МОТИВАЦИЯ',
                ],
                icon: Sparkles,
                title: t.motivation,
            },
        ]

        const lines =
            normalized.split('\n')

        const sections: {
            key: string
            title: string
            content: string
            icon: any
        }[] = []

        let current:
            | {
                key: string
                title: string
                content: string
                icon: any
            }
            | null = null

        for (const line of lines) {
            const clean =
                line
                    .replace(/\*\*/g, '')
                    .replace(/^#+\s*/, '')
                    .trim()

            const heading =
                headings.find((item) =>
                    item.labels.some(
                        (label) =>
                            clean.toUpperCase() ===
                            label.toUpperCase()
                    )
                )

            if (heading) {
                if (current) {
                    sections.push(current)
                }

                current = {
                    key: heading.key,
                    title: heading.title,
                    content: '',
                    icon: heading.icon,
                }

                continue
            }

            if (current) {
                current.content +=
                    `${line}\n`
            }
        }

        if (current) {
            sections.push(current)
        }

        if (!sections.length) {
            return [
                {
                    key: 'plan',
                    title: t.yourPlan,
                    content: normalized,
                    icon: Sparkles,
                },
            ]
        }

        return sections.map((section) => ({
            ...section,
            content:
                section.content.trim(),
        }))
    }

    const planSections =
        getPlanSections()

    // ============================================================
    // AI CHAT
    // ============================================================

    const sendChatMessage =
        async () => {
            const message =
                chatInput.trim()

            if (
                !message ||
                chatLoading
            ) {
                return
            }

            setChatError('')

            setChatMessages((prev) => [
                ...prev,
                {
                    role: 'user',
                    text: message,
                },
            ])

            setChatInput('')
            setChatLoading(true)

            try {
                const data =
                    await apiFetch(
                        '/api/ai/chat',
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                message,
                            }),
                        }
                    )

                const reply =
                    data.reply ||
                    data.data?.reply ||
                    ''

                if (!reply) {
                    throw new Error(
                        'AI bo‘sh javob qaytardi'
                    )
                }

                setChatMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        text: reply,
                    },
                ])
            } catch (err: any) {
                console.error(
                    'AI Chat error:',
                    err
                )

                setChatError(
                    err?.message ||
                    t.chatError
                )
            } finally {
                setChatLoading(false)
            }
        }

    const handleChatKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            event.key === 'Enter' &&
            !event.shiftKey
        ) {
            event.preventDefault()
            sendChatMessage()
        }
    }

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="w-full space-y-6 text-white">
            {/* HEADER */}

            <section className="rounded-3xl border border-white/10 bg-[#111a1d] p-5 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#70d5b7]/15">
                                <Sparkles
                                    size={20}
                                    className="text-[#70d5b7]"
                                />
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight">
                                {t.title}
                            </h1>
                        </div>

                        <p className="max-w-2xl text-sm leading-6 text-white/55">
                            {t.subtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={generateTrainerPlan}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#70d5b7] px-4 py-2.5 text-sm font-medium text-[#07110f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                loading
                                    ? 'animate-spin'
                                    : ''
                            }
                        />

                        {t.regenerate}
                    </button>
                </div>
            </section>

            {/* SAFE NOTICE */}

            <section className="rounded-2xl border border-[#70d5b7]/20 bg-[#70d5b7]/5 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <ShieldCheck
                        size={20}
                        className="mt-0.5 shrink-0 text-[#70d5b7]"
                    />

                    <div>
                        <h3 className="font-medium text-white">
                            {t.safeTitle}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-white/55">
                            {t.safeText}
                        </p>
                    </div>
                </div>
            </section>

            {/* PREFERENCES */}

            <section className="rounded-3xl border border-white/10 bg-[#111a1d] p-5 sm:p-7">
                <div className="mb-5">
                    <h2 className="text-lg font-semibold">
                        {t.preferences}
                    </h2>

                    <p className="mt-1 text-sm text-white/45">
                        {t.trainerDesc}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <PreferenceSelect
                        label={t.fitnessLevel}
                        value={
                            preferences.fitnessLevel
                        }
                        onChange={(value) =>
                            updatePreference(
                                'fitnessLevel',
                                value
                            )
                        }
                        options={[
                            [
                                'beginner',
                                t.beginner,
                            ],
                            [
                                'intermediate',
                                t.intermediate,
                            ],
                            [
                                'advanced',
                                t.advanced,
                            ],
                        ]}
                    />

                    <PreferenceSelect
                        label={t.activityLevel}
                        value={
                            preferences.activityLevel
                        }
                        onChange={(value) =>
                            updatePreference(
                                'activityLevel',
                                value
                            )
                        }
                        options={[
                            ['low', t.low],
                            [
                                'normal',
                                t.normal,
                            ],
                            [
                                'active',
                                t.active,
                            ],
                        ]}
                    />

                    <PreferenceSelect
                        label={
                            t.preferredActivity
                        }
                        value={
                            preferences.preferredActivity
                        }
                        onChange={(value) =>
                            updatePreference(
                                'preferredActivity',
                                value
                            )
                        }
                        options={[
                            [
                                'general movement',
                                t.generalMovement,
                            ],
                            [
                                'walking',
                                t.walking,
                            ],
                            [
                                'running',
                                t.running,
                            ],
                            ['gym', t.gym],
                            [
                                'home workout',
                                t.homeWorkout,
                            ],
                            [
                                'cycling',
                                t.cycling,
                            ],
                        ]}
                    />

                    <PreferenceSelect
                        label={t.availableDays}
                        value={
                            preferences.availableDays
                        }
                        onChange={(value) =>
                            updatePreference(
                                'availableDays',
                                value
                            )
                        }
                        options={[
                            [
                                'flexible',
                                t.flexible,
                            ],
                            [
                                '3 days',
                                t.threeDays,
                            ],
                            [
                                '4 days',
                                t.fourDays,
                            ],
                            [
                                '5 days',
                                t.fiveDays,
                            ],
                        ]}
                    />

                    <div className="sm:col-span-2">
                        <PreferenceSelect
                            label={t.focus}
                            value={
                                preferences.focus
                            }
                            onChange={(value) =>
                                updatePreference(
                                    'focus',
                                    value
                                )
                            }
                            options={[
                                [
                                    'healthy habits',
                                    t.healthyHabits,
                                ],
                                [
                                    'general fitness',
                                    t.generalFitness,
                                ],
                                [
                                    'strength',
                                    t.strength,
                                ],
                                [
                                    'mobility',
                                    t.mobility,
                                ],
                            ]}
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={
                        generateTrainerPlan
                    }
                    disabled={loading}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#70d5b7] px-5 py-3 text-sm font-semibold text-[#07110f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                    <Sparkles size={17} />
                    {t.generate}
                </button>
            </section>

            {/* AI PLAN */}

            <section className="rounded-3xl border border-white/10 bg-[#111a1d] p-5 sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#70d5b7]/10">
                        <Dumbbell
                            size={20}
                            className="text-[#70d5b7]"
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">
                            {t.yourPlan}
                        </h2>

                        <p className="text-sm text-white/45">
                            {t.trainer}
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
                        <div className="flex items-center gap-3 text-white/60">
                            <RefreshCw
                                size={18}
                                className="animate-spin text-[#70d5b7]"
                            />

                            <span className="text-sm">
                                {t.loading}
                            </span>
                        </div>
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
                        <p className="text-sm text-red-300">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={
                                generateTrainerPlan
                            }
                            className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/5"
                        >
                            {t.retry}
                        </button>
                    </div>
                )}

                {!loading &&
                    !error &&
                    !plan && (
                        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                            <Sparkles
                                size={28}
                                className="mx-auto mb-3 text-white/25"
                            />

                            <p className="text-sm text-white/45">
                                {t.empty}
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    plan && (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {planSections.map(
                                (section) => {
                                    const Icon =
                                        section.icon

                                    return (
                                        <div
                                            key={
                                                section.key
                                            }
                                            className="rounded-2xl border border-white/10 bg-[#0b1215] p-5"
                                        >
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#70d5b7]/10">
                                                    <Icon
                                                        size={
                                                            18
                                                        }
                                                        className="text-[#70d5b7]"
                                                    />
                                                </div>

                                                <h3 className="font-medium">
                                                    {
                                                        section.title
                                                    }
                                                </h3>
                                            </div>

                                            <div className="whitespace-pre-line text-sm leading-7 text-white/65">
                                                {
                                                    section.content
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                        </div>
                    )}
            </section>

            {/* ================================================== */}
            {/* AI CHAT - SAME SECTION / SAME FILE                */}
            {/* ================================================== */}

            <section className="rounded-3xl border border-white/10 bg-[#111a1d] p-5 sm:p-7">
                <div className="mb-5 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#70d5b7]/10">
                        <MessageCircle
                            size={20}
                            className="text-[#70d5b7]"
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">
                            {t.chatTitle}
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-white/45">
                            {t.chatSubtitle}
                        </p>
                    </div>
                </div>

                {/* CHAT MESSAGES */}

                <div className="min-h-[280px] max-h-[520px] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1215] p-4">
                    {chatMessages.length === 0 && (
                        <div className="flex min-h-[240px] items-center justify-center px-5 text-center">
                            <div className="max-w-md">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#70d5b7]/10">
                                    <MessageCircle
                                        size={22}
                                        className="text-[#70d5b7]"
                                    />
                                </div>

                                <p className="text-sm leading-6 text-white/45">
                                    {t.chatEmpty}
                                </p>
                            </div>
                        </div>
                    )}

                    {chatMessages.map(
                        (message, index) => (
                            <div
                                key={`${message.role}-${index}`}
                                className={`flex ${
                                    message.role ===
                                    'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                                        message.role ===
                                        'user'
                                            ? 'bg-[#70d5b7] text-[#07110f]'
                                            : 'border border-white/10 bg-[#111a1d] text-white/70'
                                    }`}
                                >
                                    <div className="whitespace-pre-line">
                                        {
                                            message.text
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    )}

                    {chatLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#111a1d] px-4 py-3 text-sm text-white/50">
                                <Sparkles
                                    size={16}
                                    className="animate-pulse text-[#70d5b7]"
                                />

                                {t.chatLoading}
                            </div>
                        </div>
                    )}
                </div>

                {chatError && (
                    <div className="mt-3 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
                        <p className="text-sm text-red-300">
                            {chatError}
                        </p>
                    </div>
                )}

                {/* CHAT INPUT */}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(event) =>
                            setChatInput(
                                event.target.value
                            )
                        }
                        onKeyDown={
                            handleChatKeyDown
                        }
                        disabled={chatLoading}
                        placeholder={
                            t.chatPlaceholder
                        }
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0b1215] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#70d5b7]/40 disabled:opacity-50"
                    />

                    <button
                        type="button"
                        onClick={
                            sendChatMessage
                        }
                        disabled={
                            !chatInput.trim() ||
                            chatLoading
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#70d5b7] px-5 py-3 text-sm font-semibold text-[#07110f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Send size={16} />
                        {t.send}
                    </button>
                </div>
            </section>
        </div>
    )
}

// ============================================================
// PREFERENCE SELECT
// ============================================================

function PreferenceSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string
    value: string
    onChange: (value: string) => void
    options: [string, string][]
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm text-white/55">
                {label}
            </span>

            <div className="relative">
                <select
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    className="w-full appearance-none rounded-xl border border-white/10 bg-[#0b1215] px-4 py-3 pr-10 text-sm text-white outline-none transition focus:border-[#70d5b7]/40"
                >
                    {options.map(
                        ([optionValue, optionLabel]) => (
                            <option
                                key={optionValue}
                                value={optionValue}
                                className="bg-[#0b1215]"
                            >
                                {optionLabel}
                            </option>
                        )
                    )}
                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/35">
                    <Check size={15} />
                </div>
            </div>
        </label>
    )
}