 'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowDown,
    BarChart3,
    ChevronDown,
    Check,
    CircleHelp,
    Clock,
    CloudUpload,
    Flame,
    LayoutDashboard,
    Menu,
    MoreHorizontal,
    Plus,
    Search,
    Settings,
    SlidersHorizontal,
    Sparkles,
    Camera,
    Target,
    Utensils,
    X,
    Footprints,
    Dumbbell,
    Bot,
    ChefHat,
    Shield,
    Loader2,
} from 'lucide-react'
import StepCounter from '@/components/sections/StepCounter'
import GymFinder from '@/components/sections/GymFinder'
import AIChat from '@/components/sections/AIChat'
import Recipes from '@/components/sections/Recipes'
import AITrainer from '@/components/sections/AITrainer'
import Insights from '@/components/sections/Insights'
import Goals from '@/components/sections/Goals'

type Meal = { name: string; type: string; time: string; calories: number; carbs: number; protein: number; fat: number; color: string; icon: string; image?: string }

const initialMeals: Meal[] = [
    { name: 'Greek yogurt & berries', type: 'Breakfast', time: '8:15 AM', calories: 320, carbs: 34, protein: 22, fat: 9, color: 'bg-amber-100 text-amber-700', icon: '🥣' },
    { name: 'Chicken grain bowl', type: 'Lunch', time: '12:40 PM', calories: 580, carbs: 61, protein: 42, fat: 18, color: 'bg-emerald-100 text-emerald-700', icon: '🥗' },
    { name: 'Apple with almond butter', type: 'Snack', time: '3:20 PM', calories: 210, carbs: 28, protein: 5, fat: 10, color: 'bg-rose-100 text-rose-700', icon: '🍎' },
]

const macroGoals = { carbs: 220, protein: 140, fat: 65 }

const fastingSteps = [
    { text: 'Finish your last meal by 8:00 PM', label: 'Wind down', icon: Clock, sticker: 'bg-[#e8f1ff] text-[#6b8fd8]' },
    { text: 'Drink water during the fasting window', label: 'Stay hydrated', icon: CloudUpload, sticker: 'bg-[#e3f7f3] text-[#4eb99e]' },
    { text: 'Break your fast with a protein-rich meal', label: 'Fuel gently', icon: Utensils, sticker: 'bg-[#fff0dc] text-[#d89a45]' },
    { text: 'Keep caffeine unsweetened while fasting', label: 'Keep it simple', icon: Sparkles, sticker: 'bg-[#f2eaff] text-[#9b78cf]' },
]

type NavKey = 'overview' | 'meals' | 'goals' | 'insights' | 'steps' | 'gyms' | 'aichat' | 'recipes' | 'aitrainer' | 'admin'

export default function Page() {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [adminOpen, setAdminOpen] = useState(false)
    const [meals, setMeals] = useState<Meal[]>(initialMeals)
    const [modalOpen, setModalOpen] = useState(false)
    const [cameraOpen, setCameraOpen] = useState(false)
    const [foodName, setFoodName] = useState('')
    const [uploaded, setUploaded] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [fasting, setFasting] = useState(false)
    const [routineSteps, setRoutineSteps] = useState([false, false, false, false])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [screen, setScreen] = useState<'auth' | 'onboarding' | 'dashboard'>('auth')
    const [showCelebration, setShowCelebration] = useState(false)
    const [authMode, setAuthMode] = useState<'register' | 'login'>('register')
    const [profileName, setProfileName] = useState('')
    const [authName, setAuthName] = useState('')
    const [authAge, setAuthAge] = useState('')
    const [authWeight, setAuthWeight] = useState('')
    const [authPassword, setAuthPassword] = useState('')
    const [onboardingStep, setOnboardingStep] = useState(1)
    const [height, setHeight] = useState('')
    const [gender, setGender] = useState('')
    const [goal, setGoal] = useState('Weight loss')
    const [activity, setActivity] = useState('Moderately active')
    const [condition, setCondition] = useState('None')
    const [activeNav, setActiveNav] = useState<NavKey>('overview')

    const finishAuth = () => {
        setIsLoggedIn(true)
        setProfileName(authName.trim() || 'User')
        setScreen(authMode === 'register' ? 'onboarding' : 'dashboard')
    }
    const nextOnboarding = () => setOnboardingStep((step) => Math.min(step + 1, 4))

    const totals = meals.reduce((total, meal) => ({ calories: total.calories + meal.calories, carbs: total.carbs + meal.carbs, protein: total.protein + meal.protein, fat: total.fat + meal.fat }), { calories: 0, carbs: 0, protein: 0, fat: 0 })
    const macroData = [
        { label: 'Carbs', value: totals.carbs, goal: macroGoals.carbs, color: 'bg-[#72d6bd]', soft: 'bg-[#e0f6ef]' },
        { label: 'Protein', value: totals.protein, goal: macroGoals.protein, color: 'bg-[#8d9bf2]', soft: 'bg-[#e8ebff]' },
        { label: 'Fat', value: totals.fat, goal: macroGoals.fat, color: 'bg-[#f4bf77]', soft: 'bg-[#fff0dc]' },
    ]

    const openMealModal = () => setModalOpen(true)
    const openCamera = () => { setCameraOpen(true); setUploaded(null) }
    const handleFile = (file?: File) => {
        if (file) { setUploaded(URL.createObjectURL(file)); setModalOpen(true) }
    }
    const analyzeMeal = () => {
        if (!foodName.trim() || isAnalyzing) return
        setIsAnalyzing(true)
        window.setTimeout(() => {
            const calories = Math.round(240 + foodName.trim().length * 17)
            const carbs = Math.round(calories * 0.14)
            const protein = Math.round(calories * 0.08)
            const fat = Math.round(calories * 0.035)
            setMeals((current) => [{ name: foodName.trim(), type: 'Meal', time: 'Just now', calories, carbs, protein, fat, color: 'bg-[#e4f6ef] text-[#398b73]', icon: '🍽️', image: uploaded ?? undefined }, ...current])
            const mealParams = new URLSearchParams({ name: foodName.trim(), calories: String(calories), carbs: String(carbs), protein: String(protein), fat: String(fat) })
            setFoodName(''); setUploaded(null); setIsAnalyzing(false); setModalOpen(false); router.push(`/meals?${mealParams.toString()}`)
        }, 900)
    }

    if (!isLoggedIn || screen === 'auth') return <AuthScreen mode={authMode} setMode={setAuthMode} name={authName} setName={setAuthName} age={authAge} setAge={setAuthAge} weight={authWeight} setWeight={setAuthWeight} password={authPassword} setPassword={setAuthPassword} onSubmit={finishAuth} />

    if (screen === 'onboarding') return showCelebration ? <CelebrationModal name={profileName} onContinue={() => { setShowCelebration(false); setScreen('dashboard') }} /> : <OnboardingScreen step={onboardingStep} height={height} setHeight={setHeight} gender={gender} setGender={setGender} goal={goal} setGoal={setGoal} activity={activity} setActivity={setActivity} condition={condition} setCondition={setCondition} onNext={onboardingStep === 4 ? () => setShowCelebration(true) : nextOnboarding} />

    const navItems: { key: NavKey; icon: typeof LayoutDashboard; label: string }[] = [
        { key: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { key: 'meals', icon: Utensils, label: 'My meals' },
        { key: 'goals', icon: Target, label: 'Goals' },
        { key: 'insights', icon: SlidersHorizontal, label: 'Insights' },
        { key: 'steps', icon: Footprints, label: 'Step Counter' },
        { key: 'gyms', icon: Dumbbell, label: 'Gym Finder' },
        { key: 'aichat', icon: Bot, label: 'AI Chat' },
        { key: 'recipes', icon: ChefHat, label: 'Recipes' },
        { key: 'aitrainer', icon: Shield, label: 'AI Trainer' },
    ]

    const renderSection = () => {
        switch (activeNav) {
            case 'goals': return <Goals />
            case 'insights': return <Insights />
            case 'steps': return <StepCounter />
            case 'gyms': return <GymFinder />
            case 'aichat': return <AIChat />
            case 'recipes': return <Recipes />
            case 'aitrainer': return <AITrainer />
            default: return null
        }
    }

    const isNewSection = ['goals', 'insights', 'steps', 'gyms', 'aichat', 'recipes', 'aitrainer'].includes(activeNav)

    return (
        <div className="min-h-screen bg-[#f7f9f8] text-[#182522]">
            {mobileOpen && <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
            <aside className={`fixed inset-y-0 left-0 z-30 flex w-[250px] flex-col border-r border-[#e5ece9] bg-white px-5 py-6 transition-transform overflow-y-auto lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2.5"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%20logo-rWZW2v9rDKVsccvfdCC0WtS8jceRlr.jpg" alt="INTIZOM AI logo" className="size-9 rounded-xl object-cover" /><span className="text-[19px] font-semibold tracking-tight">INTIZOM <span className="text-[#4eb99e]">AI</span></span></div>
                    <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="size-5" /></button>
                </div>
                <nav className="mt-12 flex flex-col gap-2" aria-label="Main navigation">
                    {navItems.map((item) => (
                        <NavItem key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key} onClick={() => { setActiveNav(item.key); setMobileOpen(false) }} />
                    ))}
                    <NavItem icon={BarChart3} label="Admin panel" active={false} onClick={() => { setAdminOpen(true); setMobileOpen(false) }} />
                </nav>
                <div className="mt-auto flex flex-col gap-2">
                    <NavItem icon={Settings} label="Settings" />
                    <div className="mt-5 rounded-2xl bg-[#f0f7f4] p-4"><div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-white text-[#4eb99e]"><CircleHelp className="size-4" /></div><p className="text-sm font-semibold">Need a hand?</p><p className="mt-1 text-xs leading-5 text-[#70817c]">Get tips for reaching your nutrition goals.</p><button className="mt-3 text-xs font-semibold text-[#3a9f87]">Visit help center <ArrowDown className="ml-1 inline size-3 -rotate-45" /></button></div>
                    <div className="mt-4 flex items-center gap-3 border-t border-[#edf1ef] pt-4"><div className="flex size-9 items-center justify-center rounded-full bg-[#d9eee7] text-sm font-semibold text-[#327967]">{profileName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{profileName}</p><p className="text-xs text-[#82918d]">Free plan</p></div><MoreHorizontal className="ml-auto size-4 text-[#9aa8a3]" /></div>
                </div>
            </aside>

            <main className="min-w-0 lg:ml-[250px]">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e5ece9] bg-white/90 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-12">
                    <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu className="size-5" /></button>
                    <div className="hidden items-center gap-2 text-sm text-[#81908b] sm:flex"><span>Wednesday, October 23, 2024</span><ChevronDown className="size-4" /></div>
                    <div className="ml-auto flex items-center gap-3"><button className="hidden size-9 items-center justify-center rounded-full border border-[#e5ece9] text-[#667570] sm:flex" aria-label="Search"><Search className="size-4" /></button><div className="flex size-9 items-center justify-center rounded-full bg-[#d9eee7] text-sm font-semibold text-[#327967]">{profileName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div></div>
                </header>

                {adminOpen && <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0b1215] text-slate-100 lg:left-[250px]">
                    <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
                        <div className="mb-8 flex items-start justify-between gap-4"><div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> Restricted Access <span className="text-slate-500">•</span> Admin: Komila &amp; Abdulloh</div><p className="mb-2 text-sm font-medium text-emerald-400">Executive workspace</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">Admin panel</h1><p className="mt-2 text-sm text-slate-400">Live member activity and nutrition intelligence.</p></div><button onClick={() => setAdminOpen(false)} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-semibold text-slate-300 shadow-sm hover:border-emerald-400/40 hover:text-white"><X className="size-4" /> Close</button></div>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><AdminStat label="Total active users" value="248" detail="+12% this month" /><AdminStat label="Today's meals logged" value={(1426 + meals.length).toLocaleString()} detail="Live count" /><AdminStat label="AI photo scans" value="392" detail="94% successful" /><AdminStat label="Avg. daily calories" value="1,846" detail="Within target" /></div>
                        <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]"><div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-7"><div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold text-white">Member activity</h2><p className="mt-1 text-sm text-slate-400">Daily meal logging over the past week</p></div><BarChart3 className="size-5 text-emerald-400" /></div><div className="mt-8 flex h-48 items-end gap-3">{[42, 58, 48, 72, 64, 86, 76].map((height, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-emerald-400/80 shadow-[0_0_14px_rgba(52,211,153,0.2)]" style={{ height: `${height}%` }} /><span className="text-xs text-slate-500">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span></div>)}</div></div><div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-white">Live activity feed</h2><p className="mt-1 text-sm text-slate-400">Recent member events</p></div><span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400"><span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> Live</span></div><div className="mt-5 flex flex-col gap-4"><AdminMember name="Alex Morgan" action="Logged a breakfast" time="2 min ago" online /><AdminMember name="Sam Rivera" action="Analyzed food photo via AI" time="18 min ago" online /><AdminMember name="Taylor Kim" action="Completed daily goal" time="42 min ago" /><AdminMember name="Jordan Lee" action="Logged an evening meal" time="1 hr ago" /></div><button className="mt-6 w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-400/5">View all activity</button></div></div>
                        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(16,185,129,0.06)] sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-white">Quick controls</h2><p className="mt-1 text-sm text-slate-400">Manage workspace operations.</p></div><Settings className="size-5 text-slate-500" /></div><div className="mt-5 flex flex-wrap gap-3"><button className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300">Export member report</button><button className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:border-emerald-400/50 hover:text-white">Manage members</button><button className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:border-emerald-400/50 hover:text-white">Workspace settings</button></div></div>
                    </div>
                </div>}

                <div className={`mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10 ${isNewSection ? 'bg-[#0b1215] min-h-[calc(100vh-73px)]' : ''}`}>
                    {isNewSection ? (
                        renderSection()
                    ) : (
                        <>
                            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-[#57a993]">Salom, {profileName}!</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#19352f] sm:text-[38px]">Your daily overview</h1><p className="mt-2 text-sm text-[#7d8d87]">Stay on track with your nutrition goals.</p></div><button onClick={openMealModal} className="flex w-fit items-center gap-2 rounded-xl bg-[#193e35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#28584c]"><Plus className="size-4" /> Log a meal</button></div>

                            <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
                                <div className="rounded-2xl border border-[#e4ece8] bg-white p-6 shadow-[0_8px_30px_rgba(45,83,70,0.04)] sm:p-7"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[#768781]">Today's calories</p><div className="mt-2 flex items-baseline gap-2"><span className="text-4xl font-semibold tracking-[-0.05em] text-[#19352f]">{totals.calories.toLocaleString()}</span><span className="text-sm text-[#91a09a]">/ 2,000 kcal</span></div></div><div className="flex size-11 items-center justify-center rounded-xl bg-[#e4f6ef] text-[#4eb99e]"><Flame className="size-5 fill-current" /></div></div><div className="mt-6 h-3 overflow-hidden rounded-full bg-[#edf3f0]"><div className="h-full rounded-full bg-[#5ac4a4]" style={{ width: `${Math.min((totals.calories / 2000) * 100, 100)}%` }} /></div><div className="mt-2 flex justify-between text-xs text-[#8a9993]"><span>{Math.round((totals.calories / 2000) * 100)}% of daily goal</span><span>{Math.max(2000 - totals.calories, 0)} kcal left</span></div><div className="mt-7 grid grid-cols-3 gap-3 border-t border-[#edf1ef] pt-5">{macroData.map((macro) => <div key={macro.label}><div className="flex items-center gap-1.5 text-xs text-[#84938e]"><span className={`size-2 rounded-full ${macro.color}`} />{macro.label}</div><p className="mt-1.5 text-lg font-semibold text-[#2b413b]">{macro.value}<span className="ml-1 text-xs font-normal text-[#93a19d]">/ {macro.goal}g</span></p></div>)}</div></div>
                                <div className="rounded-2xl bg-[#193e35] p-6 text-white sm:p-7"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[#a7cdc1]">Weekly average</p><p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">1,846 <span className="text-sm font-normal text-[#a7cdc1]">kcal/day</span></p></div><Sparkles className="size-5 text-[#78d8ba]" /></div><div className="mt-7 flex h-20 items-end gap-2">{[45, 63, 52, 80, 58, 74, 55].map((height, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className={`w-full rounded-t-md ${i === 4 ? 'bg-[#70d5b7]' : 'bg-[#41665b]'}`} style={{ height: `${height}%` }} /><span className="text-[10px] text-[#91b4aa]">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span></div>)}</div><div className="mt-5 flex items-center gap-2 text-xs text-[#a7cdc1]"><span className="flex size-5 items-center justify-center rounded-full bg-[#356b5d]"><ArrowDown className="size-3 rotate-45 text-[#78d8ba]" /></span> 8% better than last week</div></div>
                            </section>

                            <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.45fr]">
                                <div className="rounded-2xl border border-[#a8dfcc] bg-[#effbf6] p-6 shadow-[0_12px_32px_rgba(40,184,135,0.10)] sm:p-7"><div className="flex items-start justify-between gap-4"><div><div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#d9f7ea] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#238b68]"><Camera className="size-3.5" /> Kamera bilan skanerlash</div><h2 className="text-lg font-semibold text-[#23423a]">Kamera orqali aniqlash</h2><p className="mt-1 max-w-[280px] text-sm leading-5 text-[#769089]">Bugun nima yedingiz? Suratga oling va AI kaloriyalarni hisoblasin.</p></div><button onClick={openCamera} className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#193e35] text-[#8af0c7] shadow-lg transition hover:scale-105 hover:bg-[#28584c]" aria-label="Kamera bilan skanerlash"><Camera className="size-6" /></button></div><button onClick={openCamera} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2bb887] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(43,184,135,0.24)] transition hover:bg-[#219d73]"><Camera className="size-4" /> Rasmga olish & AI hisoblash</button>{uploaded ? <div className="relative mt-5 overflow-hidden rounded-xl bg-white"><img src={uploaded} alt="Uploaded meal preview" className="h-32 w-full object-cover" /><button onClick={() => setUploaded(null)} className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-[#49645b]" aria-label="Remove uploaded image"><X className="size-4" /></button></div> : <button onClick={() => inputRef.current?.click()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }} onDragOver={(e) => e.preventDefault()} className="mt-5 flex w-full flex-col items-center justify-center rounded-xl border border-[#cce6dc] bg-white/70 px-4 py-6 text-center transition hover:bg-white"><div className="mb-2 flex size-9 items-center justify-center rounded-full bg-[#dff4ec] text-[#4eb99e]"><Plus className="size-4" /></div><span className="text-sm font-semibold text-[#387d6b]">Upload a photo</span><span className="mt-1 text-xs text-[#8ca29b]">or drag and drop here</span></button>}<input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} /></div>
                                <div className="rounded-2xl border border-[#e4ece8] bg-white p-6 shadow-[0_8px_30px_rgba(45,83,70,0.04)] sm:p-7"><div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold text-[#23423a]">Macro breakdown</h2><p className="mt-1 text-sm text-[#82918c]">Your progress against today's targets</p></div><button className="flex items-center gap-1 text-xs font-semibold text-[#4ba48d]">Today <ChevronDown className="size-3" /></button></div><div className="mt-6 flex flex-col gap-4">{macroData.map((macro) => <div key={macro.label}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-[#50635c]">{macro.label}</span><span className="text-[#82918c]"><strong className="text-[#2d453d]">{macro.value}g</strong> / {macro.goal}g</span></div><div className={`h-2 rounded-full ${macro.soft}`}><div className={`h-full rounded-full ${macro.color}`} style={{ width: `${(macro.value / macro.goal) * 100}%` }} /></div></div>)}</div></div>
                            </section>

                            <section className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_1fr]">
                                <div className="rounded-2xl border border-[#e4ece8] bg-white p-6 shadow-[0_8px_30px_rgba(45,83,70,0.04)] sm:p-7">
                                    <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[#57a993]">Fasting plan</p><h2 className="mt-1 text-lg font-semibold text-[#23423a]">Step-by-step fasting</h2><p className="mt-1 text-sm text-[#82918c]">A gentle 14:10 rhythm for today.</p></div><div className="flex size-10 items-center justify-center rounded-xl bg-[#e8f6f1] text-[#4ba48d]"><Clock className="size-5" /></div></div>
                                    <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f3faf7] p-4"><div><p className="text-xs text-[#82918c]">Eating window</p><p className="mt-1 text-base font-semibold text-[#2d453d]">10:00 AM – 8:00 PM</p></div><button onClick={() => { setFasting((value) => !value); router.push('/fasting') }} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${fasting ? 'bg-[#193e35] text-white' : 'bg-white text-[#398b73] ring-1 ring-[#cfe6dc] hover:bg-[#e9f8f2]'}`}>{fasting ? 'Fasting active' : 'Start fast'}</button></div>
                                    <div className="mt-5 flex flex-col gap-2">{fastingSteps.map((step, index) => { const StepIcon = step.icon; return <button key={step.text} onClick={() => setRoutineSteps((current) => current.map((done, itemIndex) => itemIndex === index ? !done : done))} className={`group flex items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#f6fbf8] ${routineSteps[index] ? 'bg-[#f6fbf8]' : ''}`}><span className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition ${step.sticker} ${routineSteps[index] ? 'scale-95 opacity-60' : 'group-hover:-rotate-3'}`} aria-hidden="true">{routineSteps[index] ? <Check className="size-5" /> : <StepIcon className="size-5" />}</span><span className="min-w-0 flex-1"><span className={`block text-sm ${routineSteps[index] ? 'text-[#91a09a] line-through' : 'text-[#50635c]'}`}>{step.text}</span><span className={`mt-0.5 block text-[11px] font-medium ${routineSteps[index] ? 'text-[#a8b5b0]' : 'text-[#9aada5]'}`}>{routineSteps[index] ? 'Completed' : step.label}</span></span><span className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs transition ${routineSteps[index] ? 'border-[#5ac4a4] bg-[#5ac4a4] text-white' : 'border-[#cfe1da] text-transparent'}`}><Check className="size-3" /></span></button> })}</div>
                                </div>
                                <div className="rounded-2xl bg-[#193e35] p-6 text-white shadow-[0_8px_30px_rgba(45,83,70,0.08)] sm:p-7"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[#a7cdc1]">Daily routine effect</p><h2 className="mt-1 text-lg font-semibold">Small habits, steady progress</h2></div><Sparkles className="size-5 text-[#78d8ba]" /></div><p className="mt-4 text-sm leading-6 text-[#b9d5cd]">Completing your routine helps create a consistent eating pattern and makes your calorie trend easier to understand.</p><div className="mt-6 grid grid-cols-3 gap-2"><div className="rounded-xl bg-[#2a554a] p-3"><p className="text-2xl font-semibold">{routineSteps.filter(Boolean).length}/4</p><p className="mt-1 text-[11px] text-[#a7cdc1]">steps done</p></div><div className="rounded-xl bg-[#2a554a] p-3"><p className="text-2xl font-semibold">14h</p><p className="mt-1 text-[11px] text-[#a7cdc1]">fasting goal</p></div><div className="rounded-xl bg-[#2a554a] p-3"><p className="text-2xl font-semibold">{fasting ? 'On' : 'Ready'}</p><p className="mt-1 text-[11px] text-[#a7cdc1]">today&apos;s plan</p></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-[#41665b]"><div className="h-full rounded-full bg-[#70d5b7] transition-all" style={{ width: `${(routineSteps.filter(Boolean).length / 4) * 100}%` }} /></div></div>
                            </section>

                            <section className="mt-8 rounded-[28px] border border-[#e2ece7] bg-white p-5 shadow-[0_12px_40px_rgba(45,83,70,0.05)] sm:p-7"><div className="flex flex-col gap-5 border-b border-[#edf1ef] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg bg-[#e7f7f0] text-[#4ba48d]"><Utensils className="size-4" /></span><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#57a993]">My meals</p></div><h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#23423a]">Fuel your day, one plate at a time</h2><p className="mt-1 text-sm text-[#82918c]">A visual log of everything you&apos;ve enjoyed today.</p></div><button onClick={openMealModal} className="flex w-fit items-center gap-2 rounded-xl border border-[#bfe2d5] bg-[#f3fbf7] px-4 py-2.5 text-sm font-semibold text-[#398b73] transition hover:bg-[#e8f7f0]"><Plus className="size-4" /> Log meal</button></div><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{meals.map((meal, index) => <article key={`${meal.name}-${index}`} className="group overflow-hidden rounded-2xl border border-[#e7efeb] bg-[#fbfdfc] transition hover:-translate-y-0.5 hover:border-[#c8e5da] hover:shadow-[0_10px_24px_rgba(45,83,70,0.08)]">{meal.image ? <img src={meal.image} alt={`${meal.name} meal`} className="h-32 w-full object-cover" /> : <div className={`flex h-32 items-center justify-center text-5xl ${meal.color}`}>{meal.icon}</div>}<div className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#304840]">{meal.name}</p><p className="mt-1 text-xs text-[#91a09a]">{meal.type} <span className="mx-1">·</span> {meal.time}</p></div><button aria-label={`More options for ${meal.name}`} className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#9aa9a3] transition hover:bg-[#edf6f2] hover:text-[#398b73]"><MoreHorizontal className="size-4" /></button></div><div className="mt-4 flex items-center justify-between border-t border-[#edf1ef] pt-3"><p className="text-sm font-semibold text-[#304840]">{meal.calories} <span className="text-[11px] font-normal text-[#91a09a]">kcal</span></p><div className="flex gap-2 text-[10px] font-medium text-[#82918c]"><span>P {meal.protein}g</span><span>C {meal.carbs}g</span><span>F {meal.fat}g</span></div></div></div></article>)}</div><div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl bg-[#f3faf7] px-4 py-3.5 sm:flex-row"><p className="text-xs text-[#6f8880]">You&apos;ve logged <strong className="text-[#356e5d]">{meals.length} meals</strong> today and {totals.calories.toLocaleString()} calories.</p><button onClick={openMealModal} className="flex items-center gap-2 text-sm font-semibold text-[#4ba48d] hover:text-[#2f826b]"><Plus className="size-4" /> Add another meal</button></div></section>
                        </>
                    )}
                </div>

                {cameraOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102e27]/70 px-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="camera-dialog-title">
                        <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-white/20 bg-[#173d34] p-5 text-white shadow-2xl sm:p-7">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8af0c7]">Food Vision AI</p>
                                    <h2 id="camera-dialog-title" className="mt-2 text-2xl font-semibold">Kamera bilan skanerlash</h2>
                                    <p className="mt-1 text-sm text-[#b9d5cd]">Taomingizni ramka ichiga joylashtiring.</p>
                                </div>
                                <button onClick={() => setCameraOpen(false)} className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close camera"><X className="size-4" /></button>
                            </div>
                            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_center,#47776a,#102b25)]">
                                <div className="absolute inset-7 rounded-2xl border-2 border-dashed border-[#8af0c7]/80 shadow-[0_0_0_999px_rgba(4,28,22,0.18)]" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                    <Camera className="size-10 text-[#8af0c7] opacity-80" />
                                    <p className="text-xs font-medium text-[#d1eee4]">Capture or upload a clear photo of your meal</p>
                                </div>
                            </div>
                            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleFile(f); setCameraOpen(false) } }} />
                            <div className="mt-6 flex gap-3">
                                <button onClick={() => cameraInputRef.current?.click()} className="flex-1 rounded-xl bg-[#2bb887] py-3 text-center text-sm font-bold text-white shadow-md hover:bg-[#219d73]">Take photo</button>
                                <button onClick={() => { setCameraOpen(false); inputRef.current?.click() }} className="flex-1 rounded-xl border border-white/20 bg-white/10 py-3 text-center text-sm font-semibold text-white hover:bg-white/20">Upload file</button>
                            </div>
                        </div>
                    </div>
                )}

                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <div className="flex items-center justify-between border-b border-[#edf1ef] pb-4">
                                <h3 className="text-lg font-semibold text-[#19352f]">Log a meal</h3>
                                <button onClick={() => setModalOpen(false)} aria-label="Close modal"><X className="size-5 text-[#82918c]" /></button>
                            </div>
                            <div className="mt-4 flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#50635c]">Meal Name</label>
                                    <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="e.g. Avocado Toast with Eggs" className="mt-1 w-full rounded-xl border border-[#d3e3dc] px-3.5 py-2.5 text-sm focus:border-[#4eb99e] focus:outline-none" />
                                </div>
                                {uploaded && (
                                    <div className="relative overflow-hidden rounded-xl border border-[#edf1ef]">
                                        <img src={uploaded} alt="Meal upload" className="h-40 w-full object-cover" />
                                        <button onClick={() => setUploaded(null)} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"><X className="size-4" /></button>
                                    </div>
                                )}
                                <button onClick={analyzeMeal} disabled={!foodName.trim() || isAnalyzing} className="flex items-center justify-center gap-2 rounded-xl bg-[#193e35] py-3 text-sm font-semibold text-white transition hover:bg-[#28584c] disabled:opacity-50">
                                    {isAnalyzing ? <><Loader2 className="size-4 animate-spin" /> Analyzing...</> : <><Sparkles className="size-4" /> Analyze &amp; Save</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: typeof LayoutDashboard; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-[#f0f7f4] text-[#327967]' : 'text-[#647570] hover:bg-[#f6f9f8] hover:text-[#182522]'}`}>
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
        </button>
    )
}

function AdminStat({ label, value, detail }: { label: string; value: string; detail: string }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-xs text-emerald-400">{detail}</p>
        </div>
    )
}

function AdminMember({ name, action, time, online }: { name: string; action: string; time: string; online?: boolean }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
                <span className={`size-2 rounded-full shrink-0 ${online ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{name}</p>
                    <p className="truncate text-slate-400">{action}</p>
                </div>
            </div>
            <span className="text-slate-500 shrink-0">{time}</span>
        </div>
    )
}

function AuthScreen({ mode, setMode, name, setName, age, setAge, weight, setWeight, password, setPassword, onSubmit }: any) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7f9f8] p-4">
            <div className="w-full max-w-md rounded-3xl border border-[#e5ece9] bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center gap-2.5">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%20logo-rWZW2v9rDKVsccvfdCC0WtS8jceRlr.jpg" alt="INTIZOM AI logo" className="size-9 rounded-xl object-cover" />
                    <span className="text-xl font-semibold tracking-tight">INTIZOM <span className="text-[#4eb99e]">AI</span></span>
                </div>
                <h1 className="text-2xl font-bold text-[#19352f]">{mode === 'register' ? 'Create an Account' : 'Welcome Back'}</h1>
                <p className="mt-1 text-sm text-[#7d8d87]">{mode === 'register' ? 'Start tracking your nutrition intelligently.' : 'Sign in to access your dashboard.'}</p>

                <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="mt-6 flex flex-col gap-4">
                    {mode === 'register' && (
                        <>
                            <div>
                                <label className="text-xs font-semibold text-[#50635c]">Full Name</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Komila" className="mt-1 w-full rounded-xl border border-[#d3e3dc] px-3.5 py-2.5 text-sm focus:border-[#4eb99e] focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-[#50635c]">Age</label>
                                    <input type="number" required value={age} onChange={(e) => setAge(e.target.value)} placeholder="18" className="mt-1 w-full rounded-xl border border-[#d3e3dc] px-3.5 py-2.5 text-sm focus:border-[#4eb99e] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#50635c]">Weight (kg)</label>
                                    <input type="number" required value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="65" className="mt-1 w-full rounded-xl border border-[#d3e3dc] px-3.5 py-2.5 text-sm focus:border-[#4eb99e] focus:outline-none" />
                                </div>
                            </div>
                        </>
                    )}
                    <div>
                        <label className="text-xs font-semibold text-[#50635c]">Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full rounded-xl border border-[#d3e3dc] px-3.5 py-2.5 text-sm focus:border-[#4eb99e] focus:outline-none" />
                    </div>
                    <button type="submit" className="mt-2 rounded-xl bg-[#193e35] py-3 text-sm font-semibold text-white shadow transition hover:bg-[#28584c]">
                        {mode === 'register' ? 'Continue to Onboarding' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-[#82918c]">
                    {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="font-semibold text-[#398b73] hover:underline">
                        {mode === 'register' ? 'Sign In' : 'Register'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function OnboardingScreen({ step, height, setHeight, gender, setGender, goal, setGoal, activity, setActivity, condition, setCondition, onNext }: any) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7f9f8] p-4">
            <div className="w-full max-w-md rounded-3xl border border-[#e5ece9] bg-white p-8 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#57a993]">Step {step} of 4</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((s) => (
                            <span key={s} className={`h-1.5 w-6 rounded-full ${s <= step ? 'bg-[#4eb99e]' : 'bg-[#e5ece9]'}`} />
                        ))}
                    </div>
                </div>

                {step === 1 && (
                    <div>
                        <h2 className="text-xl font-bold text-[#19352f]">Body Profile</h2>
                        <p className="mt-1 text-sm text-[#7d8d87]">Help us calculate your basal metabolic rate.</p>
                        <div className="mt-6 flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-[#50635c]">Height (cm)</label>
                                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" className="mt-1 w-full rounded-xl border border-[#d3e3dc] px-3.5 py-2.5 text-sm focus:border-[#4eb99e] focus:outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[#50635c]">Gender</label>
                                <div className="mt-2 grid grid-cols-2 gap-3">
                                    {['Female', 'Male'].map((g) => (
                                        <button key={g} type="button" onClick={() => setGender(g)} className={`rounded-xl border py-2.5 text-sm font-semibold transition ${gender === g ? 'border-[#4eb99e] bg-[#e8f6f1] text-[#398b73]' : 'border-[#d3e3dc] text-[#50635c]'}`}>{g}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-xl font-bold text-[#19352f]">Primary Health Goal</h2>
                        <p className="mt-1 text-sm text-[#7d8d87]">What do you want to accomplish?</p>
                        <div className="mt-6 flex flex-col gap-3">
                            {['Weight loss', 'Maintain weight', 'Muscle gain', 'Improve energy'].map((g) => (
                                <button key={g} type="button" onClick={() => setGoal(g)} className={`rounded-xl border p-3 text-left text-sm font-semibold transition ${goal === g ? 'border-[#4eb99e] bg-[#e8f6f1] text-[#398b73]' : 'border-[#d3e3dc] text-[#50635c]'}`}>{g}</button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 className="text-xl font-bold text-[#19352f]">Activity Level</h2>
                        <p className="mt-1 text-sm text-[#7d8d87]">Select your daily lifestyle intensity.</p>
                        <div className="mt-6 flex flex-col gap-3">
                            {['Sedentary', 'Lightly active', 'Moderately active', 'Very active'].map((a) => (
                                <button key={a} type="button" onClick={() => setActivity(a)} className={`rounded-xl border p-3 text-left text-sm font-semibold transition ${activity === a ? 'border-[#4eb99e] bg-[#e8f6f1] text-[#398b73]' : 'border-[#d3e3dc] text-[#50635c]'}`}>{a}</button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h2 className="text-xl font-bold text-[#19352f]">Dietary Restrictions</h2>
                        <p className="mt-1 text-sm text-[#7d8d87]">Any specific health condition or preference?</p>
                        <div className="mt-6 flex flex-col gap-3">
                            {['None', 'Diabetes friendly', 'Keto / Low carb', 'Vegetarian', 'Gluten free'].map((c) => (
                                <button key={c} type="button" onClick={() => setCondition(c)} className={`rounded-xl border p-3 text-left text-sm font-semibold transition ${condition === c ? 'border-[#4eb99e] bg-[#e8f6f1] text-[#398b73]' : 'border-[#d3e3dc] text-[#50635c]'}`}>{c}</button>
                            ))}
                        </div>
                    </div>
                )}

                <button onClick={onNext} className="mt-8 w-full rounded-xl bg-[#193e35] py-3 text-sm font-semibold text-white shadow transition hover:bg-[#28584c]">
                    {step === 4 ? 'Complete Setup' : 'Next Step'}
                </button>
            </div>
        </div>
    )
}

function CelebrationModal({ name, onContinue }: { name: string; onContinue: () => void }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7f9f8] p-4">
            <div className="w-full max-w-md rounded-3xl border border-[#e5ece9] bg-white p-8 text-center shadow-xl">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#d9f7ea] text-[#398b73]">
                    <Sparkles className="size-8" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-[#19352f]">Tebriklaymiz, {name}!</h2>
                <p className="mt-2 text-sm text-[#7d8d87]">Sizning shaxsiy ovqatlanish rejangingiz muvaffaqiyatli yaratildi. Boshqaruv paneliga o'tishingiz mumkin.</p>
                <button onClick={onContinue} className="mt-6 w-full rounded-xl bg-[#193e35] py-3 text-sm font-semibold text-white shadow transition hover:bg-[#28584c]">
                    O'tish
                </button>
            </div>
        </div>
    )
}