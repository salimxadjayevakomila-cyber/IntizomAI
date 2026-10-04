 'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
    Bell,
    BellRing,
    Check,
    ChevronRight,
    Droplets,
    Globe2,
    Lock,
    LogOut,
    Moon,
    RotateCcw,
    Save,
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
    const { language, setLanguage } = useLanguage()

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

    return (
        <div className="space-y-6 pb-10">

            {/* Header */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
                    INTIZOM AI
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#182522]">
                    Settings
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71827c]">
                    Manage your profile, goals, preferences and
                    account settings.
                </p>
            </div>

            {/* Saved message */}
            {showSaved && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="size-4" />
                    </div>

                    Settings saved successfully.
                </div>
            )}

            {/* Profile */}
            <SettingsCard
                icon={User}
                title="Profile"
                description="Update your personal information."
            >
                <div className="grid gap-5 md:grid-cols-2">
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
                    <p className="mb-2 text-xs font-semibold text-[#536760]">
                        Gender
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
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

                <div className="mt-5 rounded-2xl bg-[#f5f8f7] p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold text-[#72817c]">
                                Current profile
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#182522]">
                                {profileName || 'User'}
                            </p>
                        </div>

                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <User className="size-4" />
                        </div>
                    </div>
                </div>
            </SettingsCard>

            {/* Goals */}
            <SettingsCard
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
                    <p className="mb-2 text-xs font-semibold text-[#536760]">
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
                icon={Droplets}
                title="Health profile"
                description="Your current profile information."
            >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

                <div className="my-4 h-px bg-[#edf1ef]" />

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
                <div className="grid gap-3 sm:grid-cols-3">
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

                <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <p className="text-xs leading-5 text-amber-700">
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
                <div className="grid gap-3 sm:grid-cols-2">
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

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs leading-5 text-slate-600">
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
                <div className="space-y-3">
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
            <div className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <Shield className="size-5" />
                    </div>

                    <div>
                        <h2 className="font-bold text-[#182522]">
                            Account actions
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-[#71827c]">
                            These actions affect your current
                            INTIZOM AI session.
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                        onClick={() =>
                            setShowResetModal(true)
                        }
                        className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/50 p-4 text-left transition hover:bg-red-50"
                    >
                        <div className="flex items-center gap-3">
                            <RotateCcw className="size-4 text-red-500" />

                            <div>
                                <p className="text-sm font-bold text-red-700">
                                    Reset data
                                </p>

                                <p className="mt-0.5 text-xs text-red-500/70">
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
                        className="flex items-center justify-between rounded-2xl border border-[#e5ebe8] bg-[#f8faf9] p-4 text-left transition hover:bg-[#f1f5f3]"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="size-4 text-[#587069]" />

                            <div>
                                <p className="text-sm font-bold text-[#25332f]">
                                    Log out
                                </p>

                                <p className="mt-0.5 text-xs text-[#82918c]">
                                    Return to the login screen
                                </p>
                            </div>
                        </div>

                        <ChevronRight className="size-4 text-[#9aa8a3]" />
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
}: {
    icon: typeof User
    title: string
    description: string
    children: ReactNode
}) {
    return (
        <section className="rounded-3xl border border-[#e4ebe8] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf7f2] text-[#2b8870]">
                    <Icon className="size-5" />
                </div>

                <div>
                    <h2 className="font-bold text-[#182522]">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-[#7b8a85]">
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
    return (
        <div>
            <label className="mb-2 block text-xs font-semibold text-[#536760]">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                placeholder={placeholder}
                className="h-12 w-full rounded-xl border border-[#dfe8e4] bg-[#fbfcfc] px-4 text-sm font-medium text-[#182522] outline-none transition placeholder:text-[#a0ada8] focus:border-emerald-400 focus:bg-white"
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
                    ? 'border-emerald-400/60 bg-emerald-50'
                    : 'border-[#e3ebe7] bg-[#fbfcfc] hover:border-[#cbd8d3] hover:bg-white'
            }`}
        >
            <div>
                <p
                    className={`text-sm font-bold ${
                        selected
                            ? 'text-emerald-700'
                            : 'text-[#263530]'
                    }`}
                >
                    {children}
                </p>

                {description && (
                    <p className="mt-1 text-xs text-[#82918c]">
                        {description}
                    </p>
                )}
            </div>

            <div
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                    selected
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-[#d5dfdb] bg-white'
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
        <div className="rounded-2xl border border-[#e7eeeb] bg-[#f8faf9] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#87958f]">
                {label}
            </p>

            <p className="mt-2 truncate text-sm font-bold text-[#263530]">
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
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f2f7f5] text-[#59736a]">
                    <Icon className="size-4" />
                </div>

                <div>
                    <p className="text-sm font-bold text-[#263530]">
                        {title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#82918c]">
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
                        ? 'bg-emerald-500'
                        : 'bg-[#d7e0dc]'
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
                    ? 'border-emerald-400/60 bg-emerald-50'
                    : 'border-[#e3ebe7] bg-[#fbfcfc] hover:border-[#cbd8d3]'
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex size-9 items-center justify-center rounded-xl text-xs font-bold uppercase ${
                        selected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[#edf3f0] text-[#657870]'
                    }`}
                >
                    {code}
                </div>

                <span
                    className={`text-sm font-bold ${
                        selected
                            ? 'text-emerald-700'
                            : 'text-[#263530]'
                    }`}
                >
                    {label}
                </span>
            </div>

            {selected && (
                <Check className="size-4 text-emerald-600" />
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
                    ? 'border-emerald-400/60 bg-emerald-50'
                    : 'border-[#e3ebe7] bg-[#fbfcfc] hover:border-[#cbd8d3]'
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex size-10 items-center justify-center rounded-xl ${
                        selected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[#edf3f0] text-[#667770]'
                    }`}
                >
                    <Icon className="size-4" />
                </div>

                <div>
                    <p className="text-sm font-bold text-[#263530]">
                        {title}
                    </p>

                    <p className="mt-1 text-xs text-[#82918c]">
                        {description}
                    </p>
                </div>
            </div>

            {selected && (
                <Check className="size-4 text-emerald-600" />
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
        <div className="flex items-center gap-3 rounded-2xl bg-[#f8faf9] p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#61766e] shadow-sm">
                <Icon className="size-4" />
            </div>

            <div>
                <p className="text-sm font-bold text-[#263530]">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#82918c]">
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
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div
                        className={`flex size-12 items-center justify-center rounded-2xl ${
                            danger
                                ? 'bg-red-50 text-red-500'
                                : 'bg-[#eaf7f2] text-[#2b8870]'
                        }`}
                    >
                        <Icon className="size-5" />
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex size-9 items-center justify-center rounded-xl text-[#8a9893] transition hover:bg-[#f3f6f5] hover:text-[#263530]"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#182522]">
                    {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#71827c]">
                    {description}
                </p>

                <div className="mt-7 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-[#dfe7e3] px-4 py-3 text-sm font-bold text-[#52645d] transition hover:bg-[#f6f8f7]"
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