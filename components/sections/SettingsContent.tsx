  'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
    Bell,
    BellRing,
    Check,
    CalendarDays,
    ChevronRight,
    Droplets,
    HeartPulse,
    Globe2,
    Lock,
    LogOut,
    Moon,
    RotateCcw,
    Ruler,
    Save,
    Scale,
    Shield,
    Sun,
    Target,
    User,
    Utensils,
    X,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { requestNotificationPermission } from '@/lib/notifications'

interface SettingsProps {
    profileName: string
    setProfileName: (name: string) => void

    age: string
    setAge: (value: string) => void

    weight: string
    setWeight: (value: string) => void

    height: string
    setHeight: (value: string) => void

    gender: string
    setGender: (value: string) => void

    goal: string
    setGoal: (value: string) => void

    activity: string
    setActivity: (value: string) => void

    onLogout?: () => void
    onReset?: () => void
}

type Language = 'uz' | 'ru' | 'en'

export default function SettingsContent({
    profileName,
    setProfileName,
    age,
    setAge,
    weight,
    setWeight,
    height,
    setHeight,
    gender,
    setGender,
    goal,
    setGoal,
    activity,
    setActivity,
    onLogout,
    onReset,
}: SettingsProps) {
    const { language, setLanguage, t } = useLanguage()

    const [nameInput, setNameInput] = useState(profileName)

    const [notifications, setNotifications] = useState(true)
    const [mealReminders, setMealReminders] = useState(true)

    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    const [showSaved, setShowSaved] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const [settingsLanguage, setSettingsLanguage] =
        useState<Language>(language as Language)

    useEffect(() => {
        setNameInput(profileName)
    }, [profileName])

    useEffect(() => {
        const savedSettings = localStorage.getItem('intizom-settings')

        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings)

                if (typeof parsed.notifications === 'boolean') {
                    setNotifications(parsed.notifications)
                }

                if (typeof parsed.mealReminders === 'boolean') {
                    setMealReminders(parsed.mealReminders)
                }

                if (
                    parsed.theme === 'dark' ||
                    parsed.theme === 'light'
                ) {
                    setTheme(parsed.theme)
                }

                if (
                    parsed.language === 'uz' ||
                    parsed.language === 'ru' ||
                    parsed.language === 'en'
                ) {
                    setSettingsLanguage(parsed.language)
                }
            } catch {
                // Ignore invalid localStorage data
            }
        }

        const notificationEnabled = localStorage.getItem(
            'intizom-notifications-enabled'
        )

        if (notificationEnabled === 'false') {
            setNotifications(false)
        }

        if (notificationEnabled === 'true') {
            setNotifications(true)
        }
    }, [])

    const handleNotificationToggle = async (
        enabled: boolean
    ) => {
        if (!enabled) {
            setNotifications(false)

            localStorage.setItem(
                'intizom-notifications-enabled',
                'false'
            )

            return
        }

        const token = await requestNotificationPermission()

        if (!token) {
            setNotifications(false)

            localStorage.setItem(
                'intizom-notifications-enabled',
                'false'
            )

            return
        }

        setNotifications(true)

        localStorage.setItem(
            'intizom-notifications-enabled',
            'true'
        )

        localStorage.setItem(
            'intizom-fcm-token',
            token
        )

        console.log(
            'INTIZOM AI FCM token saved.'
        )
    }

    const saveSettings = () => {
        const nextName = nameInput.trim() || 'User'

        setProfileName(nextName)

        localStorage.setItem(
            'intizom-profile-name',
            nextName
        )

        localStorage.setItem(
            'intizom-settings',
            JSON.stringify({
                notifications,
                mealReminders,
                theme,
                language: settingsLanguage,
            })
        )

        setShowSaved(true)

        setTimeout(() => {
            setShowSaved(false)
        }, 2200)
    }

    const changeLanguage = (
        nextLanguage: Language
    ) => {
        setSettingsLanguage(nextLanguage)
        setLanguage(nextLanguage)

        localStorage.setItem(
            'intizom-settings',
            JSON.stringify({
                notifications,
                mealReminders,
                theme,
                language: nextLanguage,
            })
        )
    }

    const confirmReset = () => {
        setShowResetModal(false)

        if (onReset) {
            onReset()
        }
    }

    const confirmLogout = () => {
        setShowLogoutModal(false)

        if (onLogout) {
            onLogout()
        }
    }

    const goalLabel =
        goal === 'Weight loss'
            ? 'Weight loss'
            : goal === 'Build muscle'
                ? 'Build muscle'
                : 'Maintain weight'

    const activityLabel =
        activity === 'Low activity'
            ? 'Low activity'
            : activity === 'Highly active'
                ? 'Highly active'
                : 'Moderately active'

    const genderLabel =
        gender === 'male'
            ? 'Male'
            : gender === 'female'
                ? 'Female'
                : 'Not selected'

    const displayName = profileName.trim() || 'User'
    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    const weightValue = Number(weight)
    const heightInMeters = Number(height) / 100
    const bmi = weightValue > 0 && heightInMeters > 0
        ? (weightValue / heightInMeters ** 2).toFixed(1)
        : '—'

    const profileStats = [
        {
            label: 'Weight',
            value: weight || '—',
            unit: weight ? 'kg' : '',
            icon: Scale,
            tone: 'bg-emerald-400/10 text-emerald-300',
        },
        {
            label: 'Height',
            value: height || '—',
            unit: height ? 'cm' : '',
            icon: Ruler,
            tone: 'bg-sky-400/10 text-sky-300',
        },
        {
            label: 'BMI',
            value: bmi,
            unit: '',
            icon: HeartPulse,
            tone: 'bg-amber-400/10 text-amber-300',
        },
        {
            label: 'Age',
            value: age || '—',
            unit: age ? 'yrs' : '',
            icon: CalendarDays,
            tone: 'bg-violet-400/10 text-violet-300',
        },
    ]

    const profileActions = [
        {
            href: '#profile-goals',
            icon: Target,
            title: t('settings.goals'),
            description: t('settings.goals.desc'),
        },
        {
            href: '#profile-weight',
            icon: Scale,
            title: t('settings.currentWeight'),
            description: weight ? `${weight} kg` : 'Not set',
        },
        {
            href: '#profile-edit',
            icon: User,
            title: t('settings.editProfile'),
            description: t('settings.account.desc'),
        },
    ]

    return (
        <div className="flex flex-col gap-4 pb-32 text-white">

            {/* Header */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                    INTIZOM AI
                </p>

                <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-white">
                    Profile
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                    Your health profile, goals and account preferences.
                </p>
            </div>

            <section className="rounded-[28px] border border-emerald-900/40 bg-[#0d1a12] p-5" aria-label="Profile summary">
                <div className="flex items-center gap-4">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-lg font-bold text-emerald-300">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-semibold tracking-tight text-white">
                            {displayName}
                        </h2>
                        <p className="mt-1 truncate text-sm text-zinc-400">
                            {goalLabel} · {activityLabel}
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                    {profileStats.map((stat) => {
                        const StatIcon = stat.icon

                        return (
                            <div key={stat.label} className="min-w-0 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-2 py-3">
                                <span className={`flex size-8 items-center justify-center rounded-xl ${stat.tone}`}>
                                    <StatIcon className="size-4" aria-hidden="true" />
                                </span>
                                <p className="mt-2 truncate text-[10px] font-medium text-zinc-500">
                                    {stat.label}
                                </p>
                                <p className="mt-0.5 truncate text-sm font-semibold text-white">
                                    {stat.value}
                                    {stat.unit && <span className="ml-0.5 text-[10px] font-medium text-zinc-400">{stat.unit}</span>}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#0e1913] p-4" aria-label={t('settings.account')}>
                <div className="mb-3 flex items-center gap-2">
                    <User className="size-4 text-emerald-300" aria-hidden="true" />
                    <h2 className="text-sm font-semibold text-white">
                        {t('settings.account')}
                    </h2>
                </div>
                <div className="flex flex-col gap-2">
                    {profileActions.map((action) => {
                        const ActionIcon = action.icon

                        return (
                            <a
                                key={action.href}
                                href={action.href}
                                className="flex scroll-mt-28 items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 transition hover:bg-white/[0.06]"
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                    <ActionIcon className="size-4" aria-hidden="true" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-semibold text-white">
                                        {action.title}
                                    </span>
                                    <span className="mt-0.5 block truncate text-xs text-zinc-500">
                                        {action.description}
                                    </span>
                                </span>
                                <ChevronRight className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />
                            </a>
                        )
                    })}
                </div>
            </section>

            {/* Saved message */}
            {showSaved && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                    <div className="flex size-7 items-center justify-center rounded-full bg-emerald-400/15">
                        <Check className="size-4" />
                    </div>

                    Settings saved successfully.
                </div>
            )}

            {/* Profile */}
            <SettingsCard
                id="profile-edit"
                icon={User}
                title="Profile"
                description="Update your personal information."
            >
                <div className="grid gap-5 ">
                    <Field
                        label="Name"
                        value={nameInput}
                        onChange={setNameInput}
                        placeholder="Your name"
                    />

                    <Field
                        label="Age"
                        value={age}
                        onChange={setAge}
                        placeholder="Age"
                        type="number"
                    />

                    <Field
                        label="Weight"
                        value={weight}
                        onChange={setWeight}
                        placeholder="Weight in kg"
                        type="number"
                    />

                    <Field
                        label="Height"
                        value={height}
                        onChange={setHeight}
                        placeholder="Height in cm"
                        type="number"
                    />
                </div>

                <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold text-zinc-400">
                        Gender
                    </p>

                    <div className="grid gap-3 ">
                        <ChoiceButton
                            selected={gender === 'male'}
                            onClick={() =>
                                setGender('male')
                            }
                        >
                            Male
                        </ChoiceButton>

                        <ChoiceButton
                            selected={gender === 'female'}
                            onClick={() =>
                                setGender('female')
                            }
                        >
                            Female
                        </ChoiceButton>
                    </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-[#111d17] p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold text-zinc-500">
                                Current profile
                            </p>

                            <p className="mt-1 text-sm font-semibold text-white">
                                {profileName || 'User'}
                            </p>
                        </div>

                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                            <User className="size-4" />
                        </div>
                    </div>
                </div>
            </SettingsCard>

            {/* Goals */}
            <SettingsCard
                id="profile-goals"
                icon={Target}
                title="Goals"
                description="Choose what you want to focus on."
            >
                <div className="grid gap-3">
                    <ChoiceButton
                        selected={goal === 'Weight loss'}
                        onClick={() =>
                            setGoal('Weight loss')
                        }
                        description="Focus on healthy daily habits."
                    >
                        Weight loss
                    </ChoiceButton>

                    <ChoiceButton
                        selected={
                            goal === 'Maintain weight'
                        }
                        onClick={() =>
                            setGoal('Maintain weight')
                        }
                        description="Keep your routine consistent."
                    >
                        Maintain weight
                    </ChoiceButton>

                    <ChoiceButton
                        selected={goal === 'Build muscle'}
                        onClick={() =>
                            setGoal('Build muscle')
                        }
                        description="Support strength and fitness."
                    >
                        Build muscle
                    </ChoiceButton>
                </div>

                <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold text-zinc-400">
                        Activity level
                    </p>

                    <div className="grid gap-3">
                        <ChoiceButton
                            selected={
                                activity === 'Low activity'
                            }
                            onClick={() =>
                                setActivity(
                                    'Low activity'
                                )
                            }
                        >
                            Low activity
                        </ChoiceButton>

                        <ChoiceButton
                            selected={
                                activity ===
                                'Moderately active'
                            }
                            onClick={() =>
                                setActivity(
                                    'Moderately active'
                                )
                            }
                        >
                            Moderately active
                        </ChoiceButton>

                        <ChoiceButton
                            selected={
                                activity ===
                                'Highly active'
                            }
                            onClick={() =>
                                setActivity(
                                    'Highly active'
                                )
                            }
                        >
                            Highly active
                        </ChoiceButton>
                    </div>
                </div>
            </SettingsCard>

            {/* Health summary */}
            <SettingsCard
                id="profile-health"
                icon={Droplets}
                title="Health profile"
                description="Your current profile information."
            >
                <div className="grid gap-3  ">
                    <InfoBox
                        label="Age"
                        value={
                            age
                                ? `${age} years`
                                : 'Not set'
                        }
                    />

                    <InfoBox
                        label="Weight"
                        value={
                            weight
                                ? `${weight} kg`
                                : 'Not set'
                        }
                    />

                    <InfoBox
                        label="Height"
                        value={
                            height
                                ? `${height} cm`
                                : 'Not set'
                        }
                    />

                    <InfoBox
                        label="Gender"
                        value={genderLabel}
                    />
                </div>

                <div className="mt-4 grid gap-3 ">
                    <InfoBox
                        label="Goal"
                        value={goalLabel}
                    />

                    <InfoBox
                        label="Activity"
                        value={activityLabel}
                    />
                </div>
            </SettingsCard>

            {/* Notifications */}
            <SettingsCard
                icon={Bell}
                title="Notifications"
                description="Control reminders and daily notifications."
            >
                <ToggleRow
                    icon={
                        notifications
                            ? BellRing
                            : Bell
                    }
                    title="Daily notifications"
                    description="Receive useful reminders about your routine."
                    checked={notifications}
                    onChange={
                        handleNotificationToggle
                    }
                />

                <div className="my-4 h-px bg-white/10" />

                <ToggleRow
                    icon={Utensils}
                    title="Meal reminders"
                    description="Get reminders to stay consistent with meals."
                    checked={mealReminders}
                    onChange={setMealReminders}
                />
            </SettingsCard>

            {/* Language */}
            <SettingsCard
                icon={Globe2}
                title="Language"
                description="Choose your preferred interface language."
            >
                <div className="grid gap-3 ">
                    <LanguageButton
                        code="uz"
                        label="O‘zbekcha"
                        selected={
                            settingsLanguage === 'uz'
                        }
                        onClick={() =>
                            changeLanguage('uz')
                        }
                    />

                    <LanguageButton
                        code="ru"
                        label="Русский"
                        selected={
                            settingsLanguage === 'ru'
                        }
                        onClick={() =>
                            changeLanguage('ru')
                        }
                    />

                    <LanguageButton
                        code="en"
                        label="English"
                        selected={
                            settingsLanguage === 'en'
                        }
                        onClick={() =>
                            changeLanguage('en')
                        }
                    />
                </div>

                <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                    <p className="text-xs leading-5 text-amber-200">
                        Language preference is saved locally.
                        Your main language context controls the
                        actual application translations.
                    </p>
                </div>
            </SettingsCard>

            {/* Appearance */}
            <SettingsCard
                icon={
                    theme === 'dark'
                        ? Moon
                        : Sun
                }
                title="Appearance"
                description="Choose how INTIZOM AI should look."
            >
                <div className="grid gap-3 ">
                    <ThemeButton
                        icon={Moon}
                        title="Dark"
                        description="Dark interface"
                        selected={
                            theme === 'dark'
                        }
                        onClick={() =>
                            setTheme('dark')
                        }
                    />

                    <ThemeButton
                        icon={Sun}
                        title="Light"
                        description="Light interface"
                        selected={
                            theme === 'light'
                        }
                        onClick={() =>
                            setTheme('light')
                        }
                    />
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs leading-5 text-zinc-400">
                        Appearance preference is saved. The
                        current dashboard keeps its existing
                        visual theme.
                    </p>
                </div>
            </SettingsCard>

            {/* Privacy */}
            <SettingsCard
                icon={Shield}
                title="Privacy & security"
                description="Keep your account information protected."
            >
                <div className="flex flex-col gap-3">
                    <PrivacyRow
                        icon={Lock}
                        title="Personal information"
                        description="Your profile data stays connected to your account."
                    />

                    <PrivacyRow
                        icon={Shield}
                        title="Local preferences"
                        description="App preferences are stored locally on this device."
                    />
                </div>
            </SettingsCard>

            {/* Save */}
            <div className="flex justify-end">
                <button
                    onClick={saveSettings}
                    className="flex items-center gap-2 rounded-xl bg-[#2bb887] px-6 py-3 text-sm font-bold text-[#062017] shadow-[0_10px_25px_rgba(43,184,135,0.16)] transition hover:bg-[#42d09e]"
                >
                    <Save className="size-4" />
                    Save changes
                </button>
            </div>

            {/* Danger zone */}
            <div className="rounded-3xl border border-red-400/20 bg-[#111713] p-5 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
                        <Shield className="size-5" />
                    </div>

                    <div>
                        <h2 className="font-semibold text-white">
                            Account actions
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                            These actions affect your current
                            INTIZOM AI session.
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid gap-3 ">
                    <button
                        onClick={() =>
                            setShowResetModal(true)
                        }
                        className="flex items-center justify-between rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-left transition hover:bg-red-400/10"
                    >
                        <div className="flex items-center gap-3">
                            <RotateCcw className="size-4 text-red-500" />

                            <div>
                                <p className="text-sm font-semibold text-red-300">
                                    Reset data
                                </p>

                                <p className="mt-0.5 text-xs text-red-300/70">
                                    Clear your current progress
                                </p>
                            </div>
                        </div>

                        <ChevronRight className="size-4 text-red-400" />
                    </button>

                    <button
                        onClick={() =>
                            setShowLogoutModal(true)
                        }
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.07]"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="size-4 text-zinc-300" />

                            <div>
                                <p className="text-sm font-semibold text-zinc-100">
                                    Log out
                                </p>

                                <p className="mt-0.5 text-xs text-zinc-500">
                                    Return to the login screen
                                </p>
                            </div>
                        </div>

                        <ChevronRight className="size-4 text-zinc-500" />
                    </button>
                </div>
            </div>

            {/* Reset modal */}
            {showResetModal && (
                <ConfirmModal
                    icon={RotateCcw}
                    title="Reset your data?"
                    description="This will clear your current profile, meals, routine and progress. This action cannot be undone."
                    confirmText="Reset data"
                    cancelText="Cancel"
                    danger
                    onCancel={() =>
                        setShowResetModal(false)
                    }
                    onConfirm={confirmReset}
                />
            )}

            {/* Logout modal */}
            {showLogoutModal && (
                <ConfirmModal
                    icon={LogOut}
                    title="Log out of INTIZOM AI?"
                    description="You will return to the login screen. Your saved local preferences will remain on this device."
                    confirmText="Log out"
                    cancelText="Cancel"
                    onCancel={() =>
                        setShowLogoutModal(false)
                    }
                    onConfirm={confirmLogout}
                />
            )}
        </div>
    )
}

/* ----------------------------- */
/* Settings Card                  */
/* ----------------------------- */

function SettingsCard({
    icon: Icon,
    title,
    description,
    children,
    id,
}: {
    icon: typeof User
    title: string
    description: string
    children: ReactNode
    id?: string
}) {
    return (
        <section id={id} className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#0e1913] p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="size-5" />
                </div>

                <div>
                    <h2 className="font-semibold text-white">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-zinc-400">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mt-6">
                {children}
            </div>
        </section>
    )
}

/* ----------------------------- */
/* Field                          */
/* ----------------------------- */

function Field({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
}: {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder: string
    type?: string
}) {
    const fieldId = `profile-${label.toLowerCase().replace(/\s+/g, '-')}`

    return (
        <div>
            <label htmlFor={fieldId} className="mb-2 block text-xs font-semibold text-zinc-400">
                {label}
            </label>

            <input
                id={fieldId}
                type={type}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                placeholder={placeholder}
                className="h-12 w-full rounded-xl border border-white/10 bg-[#111d17] px-4 text-sm font-medium text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-400 focus:bg-[#14231b]"
            />
        </div>
    )
}

/* ----------------------------- */
/* Choice Button                  */
/* ----------------------------- */

function ChoiceButton({
    selected,
    onClick,
    children,
    description,
}: {
    selected: boolean
    onClick: () => void
    children: React.ReactNode
    description?: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                selected
                    ? 'border-emerald-400/50 bg-emerald-400/10'
                    : 'border-white/10 bg-[#111d17] hover:border-white/20 hover:bg-[#17251d]'
            }`}
        >
            <div>
                <p
                    className={`text-sm font-bold ${
                        selected
                            ? 'text-emerald-300'
                            : 'text-zinc-200'
                    }`}
                >
                    {children}
                </p>

                {description && (
                    <p className="mt-1 text-xs text-zinc-500">
                        {description}
                    </p>
                )}
            </div>

            <div
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                    selected
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-white/15 bg-[#17251d]'
                }`}
            >
                {selected && (
                    <Check className="size-3.5" />
                )}
            </div>
        </button>
    )
}

/* ----------------------------- */
/* Info Box                       */
/* ----------------------------- */

function InfoBox({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#111d17] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                {label}
            </p>

            <p className="mt-2 truncate text-sm font-semibold text-zinc-100">
                {value}
            </p>
        </div>
    )
}

/* ----------------------------- */
/* Toggle                         */
/* ----------------------------- */

function ToggleRow({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
}: {
    icon: typeof Bell
    title: string
    description: string
    checked: boolean
    onChange: (value: boolean) => void
}) {
    return (
        <div className="flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="size-4" />
                </div>

                <div>
                    <p className="text-sm font-semibold text-zinc-100">
                        {title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {description}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={() =>
                    onChange(!checked)
                }
                aria-label={title}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    checked
                        ? 'bg-emerald-400'
                        : 'bg-white/15'
                }`}
            >
                <span
                    className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition ${
                        checked
                            ? 'left-6'
                            : 'left-1'
                    }`}
                />
            </button>
        </div>
    )
}

/* ----------------------------- */
/* Language                       */
/* ----------------------------- */

function LanguageButton({
    code,
    label,
    selected,
    onClick,
}: {
    code: string
    label: string
    selected: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                selected
                    ? 'border-emerald-400/50 bg-emerald-400/10'
                    : 'border-white/10 bg-[#111d17] hover:border-white/20'
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex size-9 items-center justify-center rounded-xl text-xs font-bold uppercase ${
                        selected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/[0.06] text-zinc-400'
                    }`}
                >
                    {code}
                </div>

                <span
                    className={`text-sm font-bold ${
                        selected
                            ? 'text-emerald-300'
                            : 'text-zinc-200'
                    }`}
                >
                    {label}
                </span>
            </div>

            {selected && (
                <Check className="size-4 text-emerald-300" />
            )}
        </button>
    )
}

/* ----------------------------- */
/* Theme                          */
/* ----------------------------- */

function ThemeButton({
    icon: Icon,
    title,
    description,
    selected,
    onClick,
}: {
    icon: typeof Moon
    title: string
    description: string
    selected: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                selected
                    ? 'border-emerald-400/50 bg-emerald-400/10'
                    : 'border-white/10 bg-[#111d17] hover:border-white/20'
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex size-10 items-center justify-center rounded-xl ${
                        selected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/[0.06] text-zinc-400'
                    }`}
                >
                    <Icon className="size-4" />
                </div>

                <div>
                    <p className="text-sm font-semibold text-zinc-100">
                        {title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                        {description}
                    </p>
                </div>
            </div>

            {selected && (
                <Check className="size-4 text-emerald-300" />
            )}
        </button>
    )
}

/* ----------------------------- */
/* Privacy                        */
/* ----------------------------- */

function PrivacyRow({
    icon: Icon,
    title,
    description,
}: {
    icon: typeof Lock
    title: string
    description: string
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-[#111d17] p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <Icon className="size-4" />
            </div>

            <div>
                <p className="text-sm font-semibold text-zinc-100">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {description}
                </p>
            </div>
        </div>
    )
}

/* ----------------------------- */
/* Confirm Modal                  */
/* ----------------------------- */

function ConfirmModal({
    icon: Icon,
    title,
    description,
    confirmText,
    cancelText,
    danger = false,
    onCancel,
    onConfirm,
}: {
    icon: typeof RotateCcw
    title: string
    description: string
    confirmText: string
    cancelText: string
    danger?: boolean
    onCancel: () => void
    onConfirm: () => void
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0e1913] p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div
                        className={`flex size-12 items-center justify-center rounded-2xl ${
                            danger
                                ? 'bg-red-400/10 text-red-300'
                                : 'bg-emerald-400/10 text-emerald-300'
                        }`}
                    >
                        <Icon className="size-5" />
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex size-9 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
                    {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {description}
                </p>

                <div className="mt-7 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.06]"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold ${
                            danger
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-[#2bb887] text-[#062017] hover:bg-[#42d09e]'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
