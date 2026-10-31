  'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowDown,
    BarChart3,
    ChevronDown,
    Check,
    CircleHelp,
    Clock,
    Coffee,
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
    ChefHat,
    Shield,
    Loader2,
    ArrowRight,
    ArrowLeft,
    Droplets,
    Trophy,
    User,
    Lock,
    Eye,
    EyeOff,
    CalendarDays,
    Ruler,
    Scale,
    HeartPulse,
    LogIn,
    UserPlus,
} from 'lucide-react'

import StepCounter from '@/components/sections/StepCounter'
import GymFinder from '@/components/sections/GymFinder'
import Recipes from '@/components/sections/Recipes'
import AITrainer from '@/components/sections/AITrainer'
import Insights from '@/components/sections/Insights'
import Goals from '@/components/sections/Goals'
import SettingsContent from '@/components/sections/SettingsContent'
import { useLanguage } from '@/contexts/language-context'


const API_URL =
      'http://localhost:5001';
    

const apiFetch = async (
    endpoint: string,
    options: RequestInit = {},
    timeoutMs = 45000
) => {
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs)

    try {
        const response = await fetch(
            `${API_URL}${endpoint}`,
            {
                ...options,
                signal: controller.signal,
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

    if (!response.ok || data?.success === false) {
        throw new Error(
            data?.message ||
            data?.error ||
            'Serverda xatolik yuz berdi'
        )
    }

        return data
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('So‘rov juda uzoq davom etdi. Iltimos, qayta urinib ko‘ring.')
        }
        if (error instanceof TypeError) {
            throw new Error('Tarmoq bilan bog‘lanib bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring.')
        }
        throw error
    } finally {
        window.clearTimeout(timeout)
    }
}

type Meal = {
    _id?: string
    name: string
    type: string
    time: string
    calories: number
    carbs: number
    protein: number
    fat: number
    color: string
    icon: string
    image?: string
}

const mapMealFromApi = (item: any): Meal => ({
    _id: item._id,
    name: item.foodName || item.name || 'Unknown food',
    type: 'Meal',
    time: item.createdAt
        ? new Date(item.createdAt).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
        })
        : '',
    calories: Number(item.calories) || 0,
    carbs: Number(item.carbs) || 0,
    protein: Number(item.protein) || 0,
    fat: Number(item.fat) || 0,
    color: 'bg-emerald-100 text-emerald-700',
    icon: '🍽️',
    image: item.imageUrl || item.image || undefined,
})


const fastingStepKeys = [
    {
        text: 'dashboard.fasting.finishMeal',
        label: 'dashboard.fasting.windDown',
        icon: Check,
        sticker: 'bg-[#e8f7f0] text-[#4ba48d]',
    },
    {
        text: 'dashboard.fasting.drinkWater',
        label: 'dashboard.fasting.stayHydrated',
        icon: Droplets,
        sticker: 'bg-[#e8f3fb] text-[#5b9fc4]',
    },
    {
        text: 'dashboard.fasting.breakFast',
        label: 'dashboard.fasting.fuelGently',
        icon: Utensils,
        sticker: 'bg-[#fff3df] text-[#d59a45]',
    },
    {
        text: 'dashboard.fasting.caffeine',
        label: 'dashboard.fasting.keepSimple',
        icon: Coffee,
        sticker: 'bg-[#f4eafa] text-[#9b6bc4]',
    },
]

type NavKey =
    | 'overview'
    | 'meals'
    | 'goals'
    | 'insights'
    | 'steps'
    | 'gyms'
    | 'aichat'
    | 'recipes'
    | 'aitrainer'
    | 'settings'



export default function Page() {
    const router = useRouter()
    const { language, t } = useLanguage()

    const inputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    const [mobileOpen, setMobileOpen] = useState(false)
    const [adminOpen, setAdminOpen] = useState(false)
    const [meals, setMeals] = useState<Meal[]>([])
    const [screen, setScreen] = useState<
        'auth' | 'onboarding' | 'success' | 'dashboard'
    >('auth')

    useEffect(() => {
        if (screen !== 'dashboard') return

        const token = localStorage.getItem('token')
        if (!token) return

        const loadMeals = async () => {
            try {
                const result = await apiFetch('/api/meals')

                const apiMeals = Array.isArray(result.data)
                    ? result.data
                    : []

                setMeals(apiMeals.map(mapMealFromApi))
            } catch (error) {
                console.error('Load meals error:', error)
            }
        }

        loadMeals()
    }, [screen])

    const [modalOpen, setModalOpen] = useState(false)
    const [cameraOpen, setCameraOpen] = useState(false)
    const [foodName, setFoodName] = useState('')
    const [uploaded, setUploaded] = useState<string | null>(null)
    const [imageBase64, setImageBase64] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [scanError, setScanError] = useState('')
    const [scanResult, setScanResult] = useState<{
        name: string
        calories: number
        carbs: number
        protein: number
        fat: number
    } | null>(null)

    const [fasting, setFasting] = useState(false)

    const [routineSteps, setRoutineSteps] = useState([
        false,
        false,
        false,
        false,
    ])



    const [authMode, setAuthMode] = useState<
        'register' | 'login'
    >('register')

    const [profileName, setProfileName] = useState('User')

    const [authName, setAuthName] = useState('')
    const [authAge, setAuthAge] = useState('')
    const [authWeight, setAuthWeight] = useState('')
    const [authPassword, setAuthPassword] = useState('')
    const [authLoading, setAuthLoading] = useState(false)
    const [authError, setAuthError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [onboardingStep, setOnboardingStep] = useState(1)
    const [height, setHeight] = useState('')
    const [gender, setGender] = useState('')
    const [goal, setGoal] = useState('Weight loss')
    const [activity, setActivity] = useState(
        'Moderately active'
    )

    const [activeNav, setActiveNav] =
        useState<NavKey>('overview')

    const copy = {
        uz: {
            welcomeBack: 'Qaytganingizdan xursandmiz',
            createAccount: 'Hisobingizni yarating',
            loginSubtitle:
                'Intizom AI bilan kunlik odatlaringizni boshqaring.',
            registerSubtitle:
                'Siz uchun moslashtirilgan sog‘lom hayot rejasini yarating.',
            name: 'Ismingiz',
            email: 'Ismingiz', // O'zgartirildi (Email o'rniga Ism)
            password: 'Parol',
            namePlaceholder: 'Ismingizni kiriting',
            emailPlaceholder: 'Ismingizni kiriting', // O'zgartirildi
            passwordPlaceholder:
                'Parolingizni kiriting',
            login: 'Kirish',
            register: 'Ro‘yxatdan o‘tish',
            noAccount: 'Hisobingiz yo‘qmi?',
            haveAccount: 'Hisobingiz bormi?',
            createOne: 'Yaratish',
            signIn: 'Kirish',
            continue: 'Davom etish',
            back: 'Orqaga',
            skip: 'O‘tkazib yuborish',
            onboardingTitle:
                'Sizni yaxshiroq tushunaylik',
            onboardingSubtitle:
                'Javoblaringiz asosida kunlik maqsadlaringizni hisoblaymiz.',
            age: 'Yoshingiz nechida?',
            ageSubtitle:
                'Bu siz uchun xavfsiz va mos maqsadlarni hisoblashga yordam beradi.',
            agePlaceholder: 'Masalan, 18',
            weight: 'Hozirgi vazningiz',
            weightSubtitle:
                'Vazningizni kilogrammda kiriting.',
            weightPlaceholder: 'Masalan, 60',
            height: 'Bo‘yingiz',
            heightSubtitle:
                'Bo‘yingizni santimetrda kiriting.',
            heightPlaceholder: 'Masalan, 165',
            gender: 'Jinsingiz',
            male: 'Erkak',
            female: 'Ayol',
            goalTitle: 'Asosiy maqsadingiz nima?',
            weightLoss: 'Vazn yo‘qotish',
            maintain: 'Vaznni saqlash',
            muscle: 'Mushak yig‘ish',
            activityTitle:
                'Kundalik faolligingiz',
            low: 'Kam faol',
            moderate: 'O‘rtacha faol',
            high: 'Juda faol',
            congratulations: 'Hammasi tayyor!',
            congratulationsSub:
                'Sizning shaxsiy Intizom AI rejangiz tayyor.',
            dailyTarget: 'Kunlik kaloriya maqsadi',
            dailyWater: 'Kunlik suv',
            goalLabel: 'Maqsad',
            proteinTarget: 'Protein',
            carbsTarget: 'Uglevodlar',
            fatTarget: 'Yog‘lar',
            startJourney: 'Sayohatni boshlash',
            kcal: 'kkal',
            liters: 'l/kun',
            yourPlan:
                'Siz uchun tayyorlangan reja',
            personalized:
                'Sizning ma’lumotlaringiz asosida',
            dashboard: 'Dashboard',
            required: 'Bu maydonni to‘ldiring',
            invalidNumber:
                'Iltimos, to‘g‘ri qiymat kiriting',
        },

        ru: {
            welcomeBack:
                'Рады видеть вас снова',
            createAccount:
                'Создайте аккаунт',
            loginSubtitle:
                'Управляйте ежедневными привычками вместе с Intizom AI.',
            registerSubtitle:
                'Создайте персональный план здорового образа жизни.',
            name: 'Ваше имя',
            email: 'Ваше имя',
            password: 'Пароль',
            namePlaceholder:
                'Введите ваше имя',
            emailPlaceholder:
                'Введите ваше имя',
            passwordPlaceholder:
                'Введите ваш пароль',
            login: 'Войти',
            register: 'Регистрация',
            noAccount: 'Нет аккаунта?',
            haveAccount:
                'Уже есть аккаунт?',
            createOne: 'Создать',
            signIn: 'Войти',
            continue: 'Продолжить',
            back: 'Назад',
            skip: 'Пропустить',
            onboardingTitle:
                'Давайте узнаем вас лучше',
            onboardingSubtitle:
                'На основе ваших ответов мы рассчитаем ежедневные цели.',
            age: 'Сколько вам лет?',
            ageSubtitle:
                'Это поможет рассчитать подходящие цели.',
            agePlaceholder:
                'Например, 18',
            weight: 'Ваш текущий вес',
            weightSubtitle:
                'Введите вес в килограммах.',
            weightPlaceholder:
                'Например, 60',
            height: 'Ваш рост',
            heightSubtitle:
                'Введите рост в сантиметрах.',
            heightPlaceholder:
                'Например, 165',
            gender: 'Ваш пол',
            male: 'Мужчина',
            female: 'Женщина',
            goalTitle:
                'Какая ваша главная цель?',
            weightLoss:
                'Снижение веса',
            maintain:
                'Поддержание веса',
            muscle: 'Набор мышц',
            activityTitle:
                'Ваша ежедневная активность',
            low: 'Низкая',
            moderate: 'Средняя',
            high: 'Высокая',
            congratulations:
                'Всё готово!',
            congratulationsSub:
                'Ваш персональный план Intizom AI готов.',
            dailyTarget:
                'Дневная цель калорий',
            dailyWater:
                'Дневная вода',
            goalLabel: 'Цель',
            proteinTarget:
                'Белок',
            carbsTarget:
                'Углеводы',
            fatTarget: 'Жиры',
            startJourney:
                'Начать путь',
            kcal: 'ккал',
            liters: 'л/день',
            yourPlan:
                'Ваш персональный план',
            personalized:
                'На основе ваших данных',
            dashboard: 'Панель',
            required:
                'Заполните это поле',
            invalidNumber:
                'Введите корректное значение',
        },

        en: {
            welcomeBack:
                'Welcome back',
            createAccount:
                'Create your account',
            loginSubtitle:
                'Manage your daily habits with Intizom AI.',
            registerSubtitle:
                'Build a personalized healthy lifestyle plan.',
            name: 'Your name',
            email: 'Your name',
            password: 'Password',
            namePlaceholder:
                'Enter your name',
            emailPlaceholder:
                'Enter your name',
            passwordPlaceholder:
                'Enter your password',
            login: 'Sign in',
            register: 'Create account',
            noAccount:
                "Don't have an account?",
            haveAccount:
                'Already have an account?',
            createOne: 'Create one',
            signIn: 'Sign in',
            continue: 'Continue',
            back: 'Back',
            skip: 'Skip',
            onboardingTitle:
                'Let’s get to know you',
            onboardingSubtitle:
                'We will calculate your daily targets based on your answers.',
            age: 'How old are you?',
            ageSubtitle:
                'This helps us calculate suitable goals for you.',
            agePlaceholder:
                'For example, 18',
            weight:
                'Your current weight',
            weightSubtitle:
                'Enter your weight in kilograms.',
            weightPlaceholder:
                'For example, 60',
            height: 'Your height',
            heightSubtitle:
                'Enter your height in centimeters.',
            heightPlaceholder:
                'For example, 165',
            gender: 'Your gender',
            male: 'Male',
            female: 'Female',
            goalTitle:
                'What is your main goal?',
            weightLoss:
                'Lose weight',
            maintain:
                'Maintain weight',
            muscle:
                'Build muscle',
            activityTitle:
                'Your daily activity',
            low: 'Low activity',
            moderate:
                'Moderately active',
            high:
                'Highly active',
            congratulations:
                'You’re all set!',
            congratulationsSub:
                'Your personalized Intizom AI plan is ready.',
            dailyTarget:
                'Daily calorie target',
            dailyWater:
                'Daily water',
            goalLabel: 'Goal',
            proteinTarget:
                'Protein',
            carbsTarget:
                'Carbs',
            fatTarget: 'Fat',
            startJourney:
                'Start my journey',
            kcal: 'kcal',
            liters: 'L/day',
            yourPlan:
                'Your personalized plan',
            personalized:
                'Based on your information',
            dashboard:
                'Dashboard',
            required:
                'Please fill in this field',
            invalidNumber:
                'Please enter a valid value',
        },
    }[language]

    const calculateCalories = () => {
        const age = Number(authAge) || 18
        const weight = Number(authWeight) || 60
        const h = Number(height) || 165

        let bmr =
            gender === 'male'
                ? 10 * weight +
                6.25 * h -
                5 * age +
                5
                : 10 * weight +
                6.25 * h -
                5 * age -
                161

        const activityMultiplier =
            activity === 'Low activity'
                ? 1.25
                : activity ===
                    'Highly active'
                    ? 1.725
                    : 1.5

        let calories =
            bmr * activityMultiplier

        if (goal === 'Weight loss')
            calories -= 300

        if (goal === 'Build muscle')
            calories += 250

        return Math.max(
            1200,
            Math.round(calories / 50) * 50
        )
    }

    const dailyCalories = useMemo(
        () => calculateCalories(),
        [
            authAge,
            authWeight,
            height,
            gender,
            activity,
            goal,
        ]
    )

    const dailyWater = useMemo(() => {
        const weight =
            Number(authWeight) || 60

        return (
            Math.round(
                weight * 0.035 * 10
            ) / 10
        )
    }, [authWeight])

    const proteinTarget = Math.round(
        (Number(authWeight) || 60) *
        (goal === 'Build muscle'
            ? 2
            : 1.6)
    )

    const carbsTarget = Math.round(
        (dailyCalories * 0.45) / 4
    )

    const fatTarget = Math.round(
        (dailyCalories * 0.25) / 9
    )

    const totals = meals.reduce(
        (total, meal) => ({
            calories:
                total.calories +
                meal.calories,
            carbs:
                total.carbs +
                meal.carbs,
            protein:
                total.protein +
                meal.protein,
            fat:
                total.fat +
                meal.fat,
        }),
        {
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0,
        }
    )

    const macroData = [
        {
            label: t(
                'dashboard.carbs'
            ),
            value: totals.carbs,
            goal: carbsTarget,
            color: 'bg-[#72d6bd]',
            soft: 'bg-[#e0f6ef]',
        },
        {
            label: t(
                'dashboard.protein'
            ),
            value: totals.protein,
            goal: proteinTarget,
            color: 'bg-[#8d9bf2]',
            soft: 'bg-[#e8ebff]',
        },
        {
            label: t(
                'dashboard.fat'
            ),
            value: totals.fat,
            goal: fatTarget,
            color: 'bg-[#f4bf77]',
            soft: 'bg-[#fff0dc]',
        },
    ]

    /*
     * =========================================================
     * IMAGE -> BASE64
     * =========================================================
     */

    const fileToBase64 = (
        file: File
    ): Promise<string> =>
        new Promise(
            (
                resolve,
                reject
            ) => {
                const reader =
                    new FileReader()

                reader.onload = () => {
                    if (
                        typeof reader.result ===
                        'string'
                    ) {
                        resolve(
                            reader.result
                        )
                    } else {
                        reject(
                            new Error(
                                'Image could not be converted to base64'
                            )
                        )
                    }
                }

                reader.onerror = () => {
                    reject(
                        new Error(
                            'Failed to read image'
                        )
                    )
                }

                reader.readAsDataURL(file)
            }
        )

    const compressImage = async (file: File): Promise<{ base64: string; previewUrl: string }> => {
        if (!file.type.startsWith('image/')) throw new Error('Faqat rasm faylini yuklang.')
        const bitmap = await createImageBitmap(file)
        const maxDimension = 1600
        const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(bitmap.width * scale))
        canvas.height = Math.max(1, Math.round(bitmap.height * scale))
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Rasmni tayyorlab bo‘lmadi.')
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
        bitmap.close()
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.78))
        if (!blob) throw new Error('Rasmni siqib bo‘lmadi.')
        const compressed = new File([blob], 'meal.jpg', { type: 'image/jpeg' })
        return { base64: await fileToBase64(compressed), previewUrl: URL.createObjectURL(compressed) }
    }

    /*
     * =========================================================
     * OPEN FOOD MODAL
     * =========================================================
     */

    const openMealModal = () => {
        setModalOpen(true)
        setScanError('')
    }

    /*
     * =========================================================
     * OPEN CAMERA
     * =========================================================
     */

    const openCamera = () => {
        setScanError('')
        setScanResult(null)
        setUploaded(null)
        setImageBase64(null)
        setCameraOpen(true)
        setModalOpen(true)
    }

    /*
     * =========================================================
     * UPLOAD IMAGE
     * =========================================================
     */

    const handleFile = async (
        file?: File
    ) => {
        if (!file) return

        try {
            setScanError('')
            setScanResult(null)

            const { base64, previewUrl } = await compressImage(file)

            setUploaded(previewUrl)
            setImageBase64(base64)
            setCameraOpen(false)
            setModalOpen(true)
        } catch (error) {
            console.error(
                'File error:',
                error
            )

            setScanError(
                'Rasmni o‘qishda xatolik yuz berdi.'
            )
        }
    }

    /*
     * =========================================================
     * CAMERA START / STOP
     * =========================================================
     */

    useEffect(() => {
        if (!cameraOpen) return

        let active = true

        const startCamera =
            async () => {
                try {
                    if (
                        !navigator
                            .mediaDevices
                            ?.getUserMedia
                    ) {
                        throw new Error(
                            'Camera API is not supported'
                        )
                    }

                    const stream =
                        await navigator.mediaDevices.getUserMedia(
                            {
                                video: {
                                    facingMode: {
                                        ideal: 'environment',
                                    },
                                },
                                audio: false,
                            }
                        )

                    if (!active) {
                        stream
                            .getTracks()
                            .forEach(
                                (
                                    track
                                ) =>
                                    track.stop()
                            )

                        return
                    }

                    streamRef.current =
                        stream

                    if (
                        videoRef.current
                    ) {
                        videoRef.current.srcObject =
                            stream

                        await videoRef.current.play()
                    }
                } catch (error) {
                    console.error(
                        'Camera error:',
                        error
                    )

                    setScanError(
                        'Kameraga ruxsat berilmadi. Brauzer sozlamalaridan camera permission bering yoki rasm upload qiling.'
                    )
                }
            }

        startCamera()

        return () => {
            active = false

            if (
                streamRef.current
            ) {
                streamRef.current
                    .getTracks()
                    .forEach(
                        (
                            track
                        ) =>
                            track.stop()
                    )

                streamRef.current =
                    null
            }

            if (
                videoRef.current
            ) {
                videoRef.current.srcObject =
                    null
            }
        }
    }, [cameraOpen])

    /*
     * =========================================================
     * CAPTURE PHOTO
     * =========================================================
     */

    const capturePhoto = () => {
        const video =
            videoRef.current

        if (
            !video ||
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ) {
            setScanError(
                'Kamera hali tayyor emas. Bir necha soniya kuting.'
            )

            return
        }

        const canvas =
            document.createElement(
                'canvas'
            )

        canvas.width =
            video.videoWidth

        canvas.height =
            video.videoHeight

        const context =
            canvas.getContext(
                '2d'
            )

        if (!context) {
            setScanError(
                'Rasm olishda xatolik yuz berdi.'
            )

            return
        }

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        )

        canvas.toBlob(
            async (blob) => {
                if (!blob) {
                    setScanError(
                        'Rasmni yaratib bo‘lmadi.'
                    )

                    return
                }

                try {
                    const file =
                        new File(
                            [blob],
                            `meal-${Date.now()}.jpg`,
                            {
                                type: 'image/jpeg',
                            }
                        )

                    const base64 =
                        await fileToBase64(
                            file
                        )

                    const previewUrl =
                        URL.createObjectURL(
                            file
                        )

                    setUploaded(
                        previewUrl
                    )

                    setImageBase64(
                        base64
                    )

                    setCameraOpen(
                        false
                    )

                    setModalOpen(
                        true
                    )

                    setScanError('')
                } catch (error) {
                    console.error(
                        'Capture error:',
                        error
                    )

                    setScanError(
                        'Rasmni tayyorlashda xatolik yuz berdi.'
                    )
                }
            },
            'image/jpeg',
            0.9
        )
    }
   const analyzeMeal = async () => {
    if (!imageBase64 || isAnalyzing) {
        return
    }

    setIsAnalyzing(true)
    setScanError('')

    try {
        const token = localStorage.getItem('token')

        if (!token) {
            throw new Error(
                'Iltimos, qaytadan login qiling'
            )
        }

       const data = await apiFetch('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({
        image: imageBase64,
        foodName: foodName.trim() || undefined,
    }),
})

        const result =
            data?.data ??
            data?.result ??
            data

        const detectedName =
            result?.name ??
            result?.foodName ??
            result?.food ??
            result?.dishName ??
            result?.detectedFood ??
            'Unknown food'

        const calories = Number(
            result?.calories ??
            result?.kcal ??
            result?.calorie ??
            result?.nutrition?.calories ??
            result?.nutrition?.kcal ??
            result?.macros?.calories ??
            0
        )

        const carbs = Number(
            result?.carbs ??
            result?.carbohydrates ??
            result?.nutrition?.carbs ??
            result?.nutrition?.carbohydrates ??
            result?.macros?.carbs ??
            0
        )

        const protein = Number(
            result?.protein ??
            result?.nutrition?.protein ??
            result?.macros?.protein ??
            0
        )

        const fat = Number(
            result?.fat ??
            result?.nutrition?.fat ??
            result?.macros?.fat ??
            0
        )

        if (
            !detectedName ||
            calories <= 0
        ) {
            throw new Error(
                'AI ovqat maʼlumotlarini to‘g‘ri aniqlay olmadi.'
            )
        }

        setScanResult({
            name: detectedName,
            calories,
            carbs,
            protein,
            fat,
        })

        setCameraOpen(false)
        setModalOpen(true)

        // Natija ko‘rsatilayotganda rasm preview
        // saqlanib qoladi.
        setImageBase64(null)

    } catch (error) {
        console.error(
            'AI scan error:',
            error
        )

        setScanError(
            error instanceof Error
                ? `${error.message} Qayta urinib ko‘ring.`
                : 'AI tahlilida xatolik yuz berdi. Qayta urinib ko‘ring.'
        )
    } finally {
        setIsAnalyzing(false)
    }
}

    const calorieProgress = dailyCalories > 0
        ? Math.max(
            0,
            Math.min(
                (totals.calories / dailyCalories) * 100,
                100
            )
        )
        : 0

    const weekdayLabels = [
        t('admin.days.sun'),
        t('admin.days.mon'),
        t('admin.days.tue'),
        t('admin.days.wed'),
        t('admin.days.thu'),
        t('admin.days.fri'),
        t('admin.days.sat'),
    ]
    const currentDate = new Date()
    const todayDateLabel = `${weekdayLabels[currentDate.getUTCDay()]} · ${String(currentDate.getUTCDate()).padStart(2, '0')}.${String(currentDate.getUTCMonth() + 1).padStart(2, '0')}.${currentDate.getUTCFullYear()}`

    const renderToday = () => (
        <div className="flex flex-col gap-4">
            <header className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-medium text-zinc-500">
                        {todayDateLabel}
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-300">
                        {t('dashboard.salom')}, {profileName}
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-white">
                        {t('dashboard.today')}
                    </h1>
                    <p className="mt-1 text-sm leading-5 text-zinc-400">
                        {t('dashboard.nutritionGoalsText')}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openMealModal}
                    aria-label={t('dashboard.logMeal')}
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 transition hover:bg-emerald-300"
                >
                    <Plus className="size-5" aria-hidden="true" />
                </button>
            </header>

            <section className="rounded-[28px] border border-emerald-900/50 bg-[#0d1a12] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-400">
                            {t('dashboard.todaysCalories')}
                        </p>
                        <p className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-white">
                            {totals.calories.toLocaleString(language)}
                            <span className="ml-1.5 text-sm font-medium tracking-normal text-zinc-400">
                                kcal
                            </span>
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                            {t('dashboard.dailyGoal')} · {dailyCalories.toLocaleString(language)} kcal
                        </p>
                    </div>

                    <div
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(calorieProgress)}
                        aria-valuetext={`${totals.calories.toLocaleString(language)} of ${dailyCalories.toLocaleString(language)} kcal`}
                        aria-label={t('dashboard.todaysCalories')}
                        className="grid size-32 shrink-0 place-items-center rounded-full p-2"
                        style={{
                            background: `conic-gradient(from -90deg, #34d399 ${calorieProgress}%, #20352a ${calorieProgress}% 100%)`,
                        }}
                    >
                        <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#0d1a12] text-center">
                            <span className="text-2xl font-semibold tracking-tight text-white">
                                {Math.round(calorieProgress)}%
                            </span>
                            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                                {t('dashboard.dailyGoal')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                    {macroData.map((macro, index) => (
                        <div key={macro.label} className="min-w-0 rounded-xl bg-white/[0.035] p-2.5">
                            <p className="truncate text-[10px] font-medium text-zinc-400">
                                {macro.label}
                            </p>
                            <p className="mt-1 truncate text-sm font-semibold text-white">
                                {macro.value}
                                <span className="ml-0.5 text-[10px] font-normal text-zinc-500">
                                    / {macro.goal}g
                                </span>
                            </p>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className={`h-full rounded-full ${index === 0 ? 'bg-emerald-400' : index === 1 ? 'bg-violet-400' : 'bg-amber-400'}`}
                                    style={{
                                        width: `${Math.min((macro.value / Math.max(macro.goal, 1)) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-2 gap-3" aria-label={t('dashboard.dailyGoal')}>
                <button
                    type="button"
                    onClick={() => setActiveNav('steps')}
                    className="rounded-2xl border border-white/10 bg-[#111d16] p-4 text-left transition hover:border-emerald-400/30 hover:bg-[#15251b]"
                >
                    <span className="flex items-center justify-between">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                            <Footprints className="size-5" aria-hidden="true" />
                        </span>
                        <ArrowRight className="size-4 text-zinc-500" aria-hidden="true" />
                    </span>
                    <span className="mt-3 block text-sm font-semibold text-white">
                        {t('dashboard.steps')}
                    </span>
                    <span className="mt-1 block text-xl font-semibold tracking-tight text-white">
                        {(10000).toLocaleString(language)}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-zinc-500">
                        {t('dashboard.dailyGoal')}
                    </span>
                </button>

                <article className="rounded-2xl border border-white/10 bg-[#111d16] p-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                        <Droplets className="size-5" aria-hidden="true" />
                    </span>
                    <p className="mt-3 text-sm font-semibold text-white">
                        {copy.dailyWater}
                    </p>
                    <p className="mt-1 text-xl font-semibold tracking-tight text-white">
                        {dailyWater.toLocaleString(language)}
                        <span className="ml-1 text-xs font-medium text-zinc-400">
                            {copy.liters}
                        </span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                        {t('dashboard.dailyGoal')}
                    </p>
                </article>
            </section>

            <section className="rounded-[24px] border border-emerald-400/20 bg-gradient-to-br from-[#10271c] to-[#0e1913] p-4">
                <div className="flex items-start gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                        <Camera className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300">
                            {t('dashboard.scanWithCamera')}
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-white">
                            {t('dashboard.cameraIdentify')}
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-zinc-400">
                            {t('dashboard.cameraQuestion')}
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={openCamera}
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-3 py-3 text-xs font-bold text-emerald-950 transition hover:bg-emerald-300"
                    >
                        <Camera className="size-4" aria-hidden="true" />
                        {t('dashboard.takePhoto')}
                    </button>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        onDrop={(event) => {
                            event.preventDefault()
                            handleFile(event.dataTransfer.files[0])
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08]"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        {t('dashboard.uploadPhoto')}
                    </button>
                </div>

                {uploaded && (
                    <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10">
                        <img
                            src={uploaded}
                            alt={t('dashboard.uploadedMealPreview')}
                            className="h-28 w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setUploaded(null)
                                setImageBase64(null)
                            }}
                            aria-label={t('dashboard.removeUploadedImage')}
                            className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-black/70 text-white"
                        >
                            <X className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                        handleFile(event.target.files?.[0])
                        event.currentTarget.value = ''
                    }}
                />
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#111b15] p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                            {t('dashboard.fastingPlan')}
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-white">
                            {t('dashboard.stepByStepFasting')}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFasting((value) => !value)}
                        className={`shrink-0 px-3 py-2 text-xs font-semibold ${fasting ? 'bg-emerald-400 text-emerald-950' : 'border border-white/10 bg-white/[0.04] text-zinc-200'}`}
                    >
                        {fasting ? t('dashboard.fastingActive') : t('dashboard.startFast')}
                    </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {fastingStepKeys.map((step, index) => {
                        const StepIcon = step.icon
                        const isComplete = routineSteps[index]

                        return (
                            <button
                                key={step.text}
                                type="button"
                                onClick={() => setRoutineSteps((current) => current.map((done, itemIndex) => itemIndex === index ? !done : done))}
                                className={`flex min-w-0 items-center gap-2 rounded-xl border border-white/10 p-2.5 text-left transition ${isComplete ? 'bg-emerald-400/10' : 'bg-white/[0.025]'}`}
                            >
                                <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${step.sticker}`}>
                                    {isComplete ? <Check className="size-4" aria-hidden="true" /> : <StepIcon className="size-4" aria-hidden="true" />}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-xs font-semibold text-white">
                                        {t(step.text)}
                                    </span>
                                    <span className="mt-0.5 block truncate text-[10px] text-zinc-500">
                                        {t(step.label)}
                                    </span>
                                </span>
                            </button>
                        )
                    })}
                </div>
            </section>

            <button
                type="button"
                onClick={() => setActiveNav('meals')}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111b15] p-4 text-left transition hover:border-emerald-400/30"
            >
                <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                        <Utensils className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                        <span className="block text-sm font-semibold text-white">
                            {t('dashboard.myMeals')}
                        </span>
                        <span className="mt-0.5 block text-xs text-zinc-400">
                            {meals.length} {t('dashboard.mealsLoggedText')}
                        </span>
                    </span>
                </span>
                <ArrowRight className="size-4 text-zinc-500" aria-hidden="true" />
            </button>
        </div>
    )

    const renderDiary = () => {
        const today = new Date()
        const todayIndex = (today.getUTCDay() + 6) % 7
        const weekDays = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(
                Date.UTC(
                    today.getUTCFullYear(),
                    today.getUTCMonth(),
                    today.getUTCDate() + index - todayIndex
                )
            )

            return {
                key: date.toISOString().slice(0, 10),
                label: weekdayLabels[(index + 1) % 7],
                number: date.getUTCDate(),
                isToday: index === todayIndex,
            }
        })

        const mealCategories = [
            {
                label: t('dashboard.mealType.breakfast'),
                icon: Coffee,
                tone: 'bg-amber-400/10 text-amber-300',
            },
            {
                label: t('dashboard.mealType.lunch'),
                icon: Utensils,
                tone: 'bg-emerald-400/10 text-emerald-300',
            },
            {
                label: t('settings.dinner'),
                icon: Flame,
                tone: 'bg-violet-400/10 text-violet-300',
            },
            {
                label: t('dashboard.mealType.snack'),
                icon: Sparkles,
                tone: 'bg-pink-400/10 text-pink-300',
            },
        ]

        return (
            <div className="flex flex-col gap-4">
                <header className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                            {t('dashboard.today')}
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-white">
                            {t('dashboard.myMeals')}
                        </h1>
                        <p className="mt-1 text-sm text-zinc-400">
                            {t('dashboard.visualLog')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={openMealModal}
                        aria-label={t('dashboard.logMeal')}
                        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950"
                    >
                        <Plus className="size-5" aria-hidden="true" />
                    </button>
                </header>

                <section className="rounded-2xl border border-white/10 bg-[#111b15] p-2" aria-label={t('dashboard.today')}>
                    <div className="grid grid-cols-7 gap-1">
                        {weekDays.map((day) => (
                            <div
                                key={day.key}
                                aria-current={day.isToday ? 'date' : undefined}
                                className={`flex min-w-0 flex-col items-center rounded-xl px-1 py-2.5 ${day.isToday ? 'bg-emerald-400 text-emerald-950' : 'text-zinc-500'}`}
                            >
                                <span className="max-w-full truncate text-[10px] font-medium uppercase">
                                    {day.label}
                                </span>
                                <span className="mt-1 text-sm font-semibold">
                                    {day.number}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[24px] border border-emerald-900/50 bg-[#0d1a12] p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium text-zinc-400">
                                {t('dashboard.todaysCalories')}
                            </p>
                            <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                                {totals.calories.toLocaleString(language)}
                                <span className="ml-1 text-sm font-medium text-zinc-400">
                                    kcal
                                </span>
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                                {t('dashboard.dailyGoal')} · {dailyCalories.toLocaleString(language)} kcal
                            </p>
                        </div>
                        <div
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(calorieProgress)}
                            aria-valuetext={`${totals.calories.toLocaleString(language)} of ${dailyCalories.toLocaleString(language)} kcal`}
                            aria-label={t('dashboard.todaysCalories')}
                            className="grid size-20 shrink-0 place-items-center rounded-full p-1.5"
                            style={{
                                background: `conic-gradient(from -90deg, #34d399 ${calorieProgress}%, #20352a ${calorieProgress}% 100%)`,
                            }}
                        >
                            <div className="flex size-full items-center justify-center rounded-full bg-[#0d1a12] text-sm font-semibold text-white">
                                {Math.round(calorieProgress)}%
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                        {macroData.map((macro, index) => (
                            <div key={macro.label} className="min-w-0">
                                <p className="truncate text-[10px] text-zinc-500">{macro.label}</p>
                                <p className="mt-1 truncate text-xs font-semibold text-white">
                                    {macro.value}
                                    <span className="font-normal text-zinc-500"> / {macro.goal}g</span>
                                </p>
                                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className={`h-full rounded-full ${index === 0 ? 'bg-emerald-400' : index === 1 ? 'bg-violet-400' : 'bg-amber-400'}`}
                                        style={{
                                            width: `${Math.min((macro.value / Math.max(macro.goal, 1)) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-[#111b15] p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">
                            {t('dashboard.myMeals')}
                        </h2>
                        <span className="text-xs text-zinc-500">
                            {meals.length} {t('dashboard.mealsLoggedText')}
                        </span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                        {mealCategories.map((category) => {
                            const CategoryIcon = category.icon

                            return (
                                <div
                                    key={category.label}
                                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"
                                >
                                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${category.tone}`}>
                                        <CategoryIcon className="size-4" aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-200">
                                        {category.label}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={openMealModal}
                                        aria-label={`${t('dashboard.logMeal')}: ${category.label}`}
                                        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-emerald-300 transition hover:bg-emerald-400/10"
                                    >
                                        <Plus className="size-4" aria-hidden="true" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </section>

                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">
                            {t('dashboard.fuelYourDay')}
                        </h2>
                        <button
                            type="button"
                            onClick={openMealModal}
                            className="text-xs font-semibold text-emerald-300"
                        >
                            {t('dashboard.logMeal')}
                        </button>
                    </div>

                    {meals.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {meals.map((meal, index) => (
                                <article
                                    key={meal._id ?? `${meal.name}-${index}`}
                                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111b15] p-3"
                                >
                                    {meal.image ? (
                                        <img
                                            src={meal.image}
                                            alt={meal.name}
                                            className="size-12 shrink-0 rounded-xl object-cover"
                                        />
                                    ) : (
                                        <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${meal.color}`}>
                                            <Utensils className="size-5" aria-hidden="true" />
                                        </span>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {meal.name}
                                        </p>
                                        <p className="mt-1 truncate text-xs text-zinc-500">
                                            {meal.type} · {meal.time || t('dashboard.today')}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-sm font-semibold text-white">
                                            {meal.calories.toLocaleString(language)}
                                        </p>
                                        <p className="text-[10px] text-zinc-500">kcal</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-[#111b15] px-4 py-6 text-center">
                            <Utensils className="mx-auto size-5 text-zinc-500" aria-hidden="true" />
                            <p className="mt-2 text-sm font-medium text-zinc-300">
                                {t('dashboard.visualLog')}
                            </p>
                            <button
                                type="button"
                                onClick={openMealModal}
                                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-emerald-950"
                            >
                                <Plus className="size-4" aria-hidden="true" />
                                {t('dashboard.logMeal')}
                            </button>
                        </div>
                    )}
                </section>

                <div className="flex items-center justify-between rounded-2xl bg-[#101b15] px-4 py-3 text-xs text-zinc-400">
                    <span>
                        {t('dashboard.youHaveLogged')} <strong className="text-emerald-300">{meals.length} {t('dashboard.mealsLoggedText')}</strong> · {totals.calories.toLocaleString(language)} {t('dashboard.calories')}
                    </span>
                    <button
                        type="button"
                        onClick={openMealModal}
                        aria-label={t('dashboard.addAnotherMeal')}
                        className="ml-3 flex size-10 shrink-0 items-center justify-center rounded-xl text-emerald-300"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                    </button>
                </div>

                <div className="sticky bottom-24 z-10 mt-1 flex justify-end">
                    <button
                        type="button"
                        onClick={openMealModal}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-bold text-emerald-950 shadow-[0_12px_32px_rgba(16,185,129,0.25)]"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        {t('dashboard.logMeal')}
                    </button>
                </div>
            </div>
        )
    }

    const mobileNavItems: {
        key: NavKey
        icon: typeof LayoutDashboard
        label: string
    }[] = [
        {
            key: 'overview',
            icon: LayoutDashboard,
            label: t('dashboard.today'),
        },
        {
            key: 'meals',
            icon: Utensils,
            label: language === 'uz' ? 'Kundalik' : language === 'ru' ? 'Дневник' : 'Diary',
        },
        {
            key: 'aitrainer',
            icon: Sparkles,
            label: t('dashboard.aiTrainer'),
        },
        {
            key: 'insights',
            icon: BarChart3,
            label: t('dashboard.insights'),
        },
        {
            key: 'settings',
            icon: User,
            label: language === 'uz' ? 'Profil' : language === 'ru' ? 'Профиль' : 'Profile',
        },
    ]

    const navItems: {
        key: NavKey
        icon: typeof LayoutDashboard
        label: string
    }[] = [
            {
                key: 'overview',
                icon: LayoutDashboard,
                label: t(
                    'dashboard.overview'
                ),
            },
            {
                key: 'goals',
                icon: Target,
                label: t(
                    'dashboard.goals'
                ),
            },
            {
                key: 'insights',
                icon: SlidersHorizontal,
                label: t(
                    'dashboard.insights'
                ),
            },
            {
                key: 'steps',
                icon: Footprints,
                label: t(
                    'dashboard.steps'
                ),
            },
            {
                key: 'gyms',
                icon: Dumbbell,
                label: t(
                    'dashboard.gymFinder'
                ),
            },
            {
                key: 'recipes',
                icon: ChefHat,
                label: t(
                    'dashboard.recipes'
                ),
            },
            {
                key: 'aitrainer',
                icon: Shield,
                label: t(
                    'dashboard.aiTrainer'
                ),
            },
        ]

    const renderSection =
        () => {
            switch (
            activeNav
            ) {
                case 'meals':
                    return renderDiary()

                case 'goals':
                    return <Goals />

                case 'insights':
                    return <Insights />

                case 'steps':
                    return <StepCounter />

                case 'gyms':
                    return <GymFinder />

                case 'recipes':
                    return <Recipes />

                case 'aitrainer':
                    return <AITrainer />

                case 'settings':
                    return (
                        <SettingsContent
                            profileName={
                                profileName
                            }
                            setProfileName={
                                setProfileName
                            }
                            age={
                                authAge
                            }
                            setAge={
                                setAuthAge
                            }
                            weight={
                                authWeight
                            }
                            setWeight={
                                setAuthWeight
                            }
                            height={
                                height
                            }
                            setHeight={
                                setHeight
                            }
                            gender={
                                gender
                            }
                            setGender={
                                setGender
                            }
                            goal={
                                goal
                            }
                            setGoal={
                                setGoal
                            }
                            activity={
                                activity
                            }
                            setActivity={
                                setActivity
                            }
                            onLogout={() => {
                                setScreen(
                                    'auth'
                                )
                                setAuthMode(
                                    'login'
                                )
                                setActiveNav(
                                    'overview'
                                )
                            }}
                            onReset={() => {
                                setMeals([])
                                setRoutineSteps(
                                    [
                                        false,
                                        false,
                                        false,
                                        false,
                                    ]
                                )

                                setFasting(
                                    false
                                )

                                setAuthAge(
                                    ''
                                )
                                setAuthWeight(
                                    ''
                                )
                                setHeight(
                                    ''
                                )
                                setGender(
                                    ''
                                )
                                setGoal(
                                    'Weight loss'
                                )
                                setActivity(
                                    'Moderately active'
                                )
                                setProfileName(
                                    'User'
                                )

                                localStorage.removeItem(
                                    'intizom-settings'
                                )

                                localStorage.removeItem(
                                    'intizom-profile-name'
                                )

                                setScreen(
                                    'auth'
                                )
                                setAuthMode(
                                    'register'
                                )
                                setActiveNav(
                                    'overview'
                                )
                            }}
                        />
                    )

                default:
                    return null
            }
        }

    const isNewSection =
        [
            'meals',
            'goals',
            'insights',
            'steps',
            'gyms',
            'recipes',
            'aitrainer',
            'settings',
        ].includes(activeNav)
    const finishAuth = async () => {
        if (authLoading) return
        setAuthError('')
        setAuthLoading(true)
        try {
            // LOGIN
            if (authMode === 'login') {
                if (!authName.trim() || !authPassword.trim()) {
                    setAuthError('Ism va parolni kiriting')
                    return
                }

                console.log('LOGIN DATA:', {
                    name: authName,
                    password: authPassword,
                })

                const result = await apiFetch('/api/users/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: authName.trim(),
                        password: authPassword,
                    }),
                })

                const token = result.token ?? result.data?.token ?? result.accessToken
            if (!token) throw new Error('Server JWT token qaytarmadi.')
            localStorage.setItem('token', token)
                localStorage.setItem(
                    'user',
                    JSON.stringify(result.data)
                )

                const user = result.data

                setProfileName(user.name || authName.trim())
                setAuthAge(String(user.age ?? ''))
                setAuthWeight(String(user.weight ?? ''))
                setHeight(String(user.height ?? ''))
                setGender(user.gender ?? '')
                setGoal(user.goal || 'Weight loss')
                setActivity(user.activity || 'Moderately active')

                setScreen('dashboard')
                return
            }

      // REGISTER
            const age = Number(authAge)
            const weight = Number(authWeight)
            if (!authName.trim() || !authPassword.trim() || !Number.isFinite(age) || !Number.isFinite(weight)) {
                setAuthError("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring")
                return
            }

            const result = await apiFetch('/api/users/register', {
                method: 'POST',
                body: JSON.stringify({
                    name: authName.trim(),
                    age,
                    weight,
                    height: 165,
                    gender: 'female',
                    password: authPassword,
                }),
            })

            const token = result.token ?? result.data?.token ?? result.accessToken
            if (!token) throw new Error('Server JWT token qaytarmadi.')
            localStorage.setItem('token', token)
            localStorage.setItem(
                'user',
                JSON.stringify(result.data)
            )

            const user = result.data

            setProfileName(user.name || authName.trim())
            setAuthAge(String(user.age ?? authAge))
            setAuthWeight(String(user.weight ?? authWeight))

            setOnboardingStep(1)
            setScreen('onboarding')
        } catch (error) {
            console.error('Auth error:', error)
            setAuthError(error instanceof Error ? error.message : 'Server bilan bog‘lanishda xatolik yuz berdi')
        } finally {
            setAuthLoading(false)
        }
    }
      const nextOnboarding = async () => {
    if (onboardingStep < 5) {
        setOnboardingStep((step) => step + 1)
        return
    }

    try {
        console.log('1. SAVE BOSHLANDI')

        const token = localStorage.getItem('token')

        console.log('2. TOKEN:', token ? 'BOR' : 'YO‘Q')

        if (!token) {
            alert('Iltimos, qaytadan login qiling')
            setScreen('auth')
            return
        }

        const result = await apiFetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                age: Number(authAge),
                weight: Number(authWeight),
                height: Number(height),
                gender,
                goal,
                activity,
            }),
        })

        console.log('3. BACKEND RESULT:', result)

        if (!result?.success) {
            throw new Error(
                result?.message ||
                "Profil ma'lumotlarini saqlashda xatolik"
            )
        }

        console.log('4. DATA:', result.data)

        localStorage.setItem(
            'user',
            JSON.stringify(result.data)
        )

        console.log('5. LOCALSTORAGE SAQLANDI')

        setScreen('success')
    } catch (error) {
        console.error(
            'ONBOARDING SAVE ERROR:',
            error
        )

        alert(
            error instanceof Error
                ? error.message
                : "Ma'lumotlarni saqlashda xatolik yuz berdi"
        )
    }
}

    const previousOnboarding =
        () => {
            if (
                onboardingStep ===
                1
            ) {
                setScreen(
                    'auth'
                )
            } else {
                setOnboardingStep(
                    (
                        step
                    ) =>
                        step -
                        1
                )
            }
        }

    const onboardingValid =
        () => {
            if (
                onboardingStep ===
                1
            )
                return (
                    Number(
                        authAge
                    ) >= 13
                )

            if (
                onboardingStep ===
                2
            )
                return (
                    Number(
                        authWeight
                    ) > 0
                )

            if (
                onboardingStep ===
                3
            )
                return (
                    Number(
                        height
                    ) > 0
                )

            if (
                onboardingStep ===
                4
            )
                return !!gender

            return (
                !!goal &&
                !!activity
            )
        }

    if (
        screen === 'auth'
    ) {
        return (
            <AuthScreen
                mode={authMode}
                setMode={setAuthMode}
                name={authName}
                setName={setAuthName}
                password={authPassword}
                setPassword={setAuthPassword}
                age={authAge}
                setAge={setAuthAge}
                weight={authWeight}
                setWeight={setAuthWeight}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onSubmit={finishAuth}
                loading={authLoading}
                error={authError}
                copy={copy}
            />
        )
    }

    if (
        screen ===
        'onboarding'
    ) {
        return (
            <OnboardingScreen
                step={
                    onboardingStep
                }
                setStep={
                    setOnboardingStep
                }
                authAge={
                    authAge
                }
                setAuthAge={
                    setAuthAge
                }
                authWeight={
                    authWeight
                }
                setAuthWeight={
                    setAuthWeight
                }
                height={
                    height
                }
                setHeight={
                    setHeight
                }
                gender={
                    gender
                }
                setGender={
                    setGender
                }
                goal={
                    goal
                }
                setGoal={
                    setGoal
                }
                activity={
                    activity
                }
                setActivity={
                    setActivity
                }
                onNext={
                    nextOnboarding
                }
                onBack={
                    previousOnboarding
                }
                valid={
                    onboardingValid()
                }
                copy={copy}
            />
        )
    }

    if (
        screen ===
        'success'
    ) {
        return (
            <SuccessScreen
                name={
                    profileName
                }
                calories={
                    dailyCalories
                }
                water={
                    dailyWater

                }
                protein={
                    proteinTarget
                }
                carbs={
                    carbsTarget
                }
                fat={
                    fatTarget
                }
                goal={
                    goal
                }
                onStart={() =>
                    setScreen(
                        'dashboard'
                    )
                }
                copy={copy}
            />
        )
    }

    return (
        <div className="intizom-app intizom-mobile-shell relative mx-auto min-h-screen w-full max-w-md overflow-x-hidden bg-zinc-950 text-zinc-50">
            {mobileOpen && (
                <div
                    className="intizom-mobile-overlay fixed inset-0 z-20 bg-black/60"
                    onClick={() =>
                        setMobileOpen(
                            false
                        )
                    }
                    aria-hidden="true"
                />
            )}

            <aside
                className={`intizom-mobile-drawer fixed inset-y-0 left-0 z-30 flex w-full max-w-md flex-col overflow-y-auto border-r border-white/10 bg-zinc-950/95 px-5 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl transition-transform ${mobileOpen
                    ? 'translate-x-0'
                    : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2.5">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%20logo-rWZW2v9rDKVsccvfdCC0WtS8jceRlr.jpg"
                            alt="INTIZOM AI"
                            className="size-9 rounded-xl object-cover"
                        />

                        <span className="text-[19px] font-semibold tracking-tight">
                            INTIZOM{' '}
                            <span className="text-[#4eb99e]">
                                AI
                            </span>
                        </span>
                    </div>

                    <button
                        className="flex size-11 items-center justify-center rounded-2xl text-zinc-300 transition hover:bg-white/10"
                        onClick={() =>
                            setMobileOpen(
                                false
                            )
                        }
                        aria-label={t(
                            'dashboard.closeMenu'
                        )}
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <nav
                    className="mt-12 flex flex-col gap-2"
                    aria-label="Main navigation"
                >
                    {navItems.map(
                        (
                            item
                        ) => (
                            <NavItem
                                key={
                                    item.key
                                }
                                icon={
                                    item.icon
                                }
                                label={
                                    item.label
                                }
                                active={
                                    activeNav ===
                                    item.key
                                }
                                onClick={() => {
                                    setActiveNav(
                                        item.key
                                    )
                                    setMobileOpen(
                                        false
                                    )
                                }}
                            />
                        )
                    )}

                    <NavItem
                        icon={
                            BarChart3
                        }
                        label={t(
                            'dashboard.adminPanel'
                        )}
                        active={
                            false
                        }
                        onClick={() => {
                            setAdminOpen(
                                true
                            )
                            setMobileOpen(
                                false
                            )
                        }}
                    />
                </nav>

                <div className="mt-auto flex flex-col gap-2">
                    <NavItem
                        icon={
                            Settings
                        }
                        label={t(
                            'dashboard.settings'
                        )}
                        active={
                            activeNav ===
                            'settings'
                        }
                        onClick={() => {
                            setActiveNav(
                                'settings'
                            )
                            setMobileOpen(
                                false
                            )
                        }}
                    />

                    <div className="mt-5 rounded-2xl bg-[#f0f7f4] p-4">
                        <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-white text-[#4eb99e]">
                            <CircleHelp className="size-4" />
                        </div>

                        <p className="text-sm font-semibold">
                            {t(
                                'dashboard.needHelp'
                            )}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#70817c]">
                            {t(
                                'dashboard.helpCenterText'
                            )}
                        </p>

                        <button className="mt-3 text-xs font-semibold text-[#3a9f87]">
                            {t(
                                'dashboard.visitHelp'
                            )}{' '}
                            <ArrowDown className="ml-1 inline size-3 -rotate-45" />
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-3 border-t border-[#edf1ef] pt-4">
                        <div className="flex size-9 items-center justify-center rounded-full bg-[#d9eee7] text-sm font-semibold text-[#327967]">
                            {profileName
                                .split(
                                    ' '
                                )
                                .map(
                                    (
                                        part
                                    ) =>
                                        part[0]
                                )
                                .join(
                                    ''
                                )
                                .slice(
                                    0,
                                    2
                                )
                                .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                                {
                                    profileName
                                }
                            </p>

                            <p className="text-xs text-[#82918d]">
                                {t(
                                    'dashboard.freePlan'
                                )}
                            </p>
                        </div>

                        <MoreHorizontal className="ml-auto size-4 text-[#9aa8a3]" />
                    </div>
                </div>
            </aside>

            <main className="intizom-dashboard-main min-w-0 bg-zinc-950">
                <header className="intizom-mobile-topbar z-20 flex items-center justify-between border-b border-white/10 bg-zinc-950/90 px-4 py-3 backdrop-blur-xl">
                    <button
                        className="flex size-11 items-center justify-center rounded-2xl text-zinc-300 transition hover:bg-white/10"
                        onClick={() =>
                            setMobileOpen(
                                true
                            )
                        }
                        aria-label={t(
                            'dashboard.openMenu'
                        )}
                    >
                        <Menu className="size-5" />
                    </button>

                    <div className="hidden items-center gap-2 text-sm text-[#81908b] ">
                        <span>
                            {t(
                                'dashboard.headerDate'
                            )}
                        </span>

                        <ChevronDown className="size-4" />
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <button
                            className="hidden size-9 items-center justify-center rounded-full border border-[#e5ece9] text-[#667570] "
                            aria-label={t(
                                'dashboard.search'
                            )}
                        >
                            <Search className="size-4" />
                        </button>

                        <div className="flex size-9 items-center justify-center rounded-full bg-[#d9eee7] text-sm font-semibold text-[#327967]">
                            {profileName
                                .split(
                                    ' '
                                )
                                .map(
                                    (
                                        part
                                    ) =>
                                        part[0]
                                )
                                .join(
                                    ''
                                )
                                .slice(
                                    0,
                                    2
                                )
                                .toUpperCase()}
                        </div>
                    </div>
                </header>

                {adminOpen && (
                    <div className="intizom-mobile-panel fixed inset-0 z-40 overflow-y-auto bg-zinc-950 text-zinc-100">
                        <div className="mx-auto w-full max-w-md px-4 py-5   ">
                            <div className="mb-8 flex items-start justify-between gap-4">
                                <div>
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                                        <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />

                                        {t(
                                            'admin.restrictedAccess'
                                        )}

                                        <span className="text-slate-500">
                                            •
                                        </span>

                                        {t(
                                            'admin.adminPrefix'
                                        )}
                                        : Komila &amp; Abdulloh
                                    </div>

                                    <p className="mb-2 text-sm font-medium text-emerald-400">
                                        {t(
                                            'admin.executiveWorkspace'
                                        )}
                                    </p>

                                    <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white ">
                                        {t(
                                            'admin.title'
                                        )}
                                    </h1>

                                    <p className="mt-2 text-sm text-slate-400">
                                        {t(
                                            'admin.subtitle'
                                        )}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        setAdminOpen(
                                            false
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-semibold text-slate-300"
                                >
                                    <X className="size-4" />
                                    {t(
                                        'admin.close'
                                    )}
                                </button>
                            </div>

                            <div className="grid gap-4  ">
                                <AdminStat
                                    label={t(
                                        'admin.totalActiveUsers'
                                    )}
                                    value="248"
                                    detail={t(
                                        'admin.thisMonth'
                                    )}
                                />

                                <AdminStat
                                    label={t(
                                        'admin.todaysMealsLogged'
                                    )}
                                    value={(
                                        1426 +
                                        meals.length
                                    ).toLocaleString()}
                                    detail={t(
                                        'admin.liveCount'
                                    )}
                                />

                                <AdminStat
                                    label={t(
                                        'admin.aiPhotoScans'
                                    )}
                                    value="392"
                                    detail={t(
                                        'admin.successful'
                                    )}
                                />

                                <AdminStat
                                    label={t(
                                        'admin.avgDailyCalories'
                                    )}
                                    value={dailyCalories.toLocaleString()}
                                    detail={t(
                                        'admin.withinTarget'
                                    )}
                                />
                            </div>

                            <div className="mt-5 grid gap-5 ">
                                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 ">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">
                                                {t(
                                                    'admin.memberActivity'
                                                )}
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-400">
                                                {t(
                                                    'admin.dailyMealLogging'
                                                )}
                                            </p>
                                        </div>

                                        <BarChart3 className="size-5 text-emerald-400" />
                                    </div>

                                    <div className="mt-8 flex h-48 items-end gap-3">
                                        {[
                                            42,
                                            58,
                                            48,
                                            72,
                                            64,
                                            86,
                                            76,
                                        ].map(
                                            (
                                                h,
                                                i
                                            ) => (
                                                <div
                                                    key={
                                                        i
                                                    }
                                                    className="flex flex-1 flex-col items-center gap-2"
                                                >
                                                    <div
                                                        className="w-full rounded-t-lg bg-emerald-400/80"
                                                        style={{
                                                            height: `${h}%`,
                                                        }}
                                                    />

                                                    <span className="text-xs text-slate-500">
                                                        {
                                                            [
                                                                'Mon',
                                                                'Tue',
                                                                'Wed',
                                                                'Thu',
                                                                'Fri',
                                                                'Sat',
                                                                'Sun',
                                                            ][
                                                            i
                                                            ]
                                                        }
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 ">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">
                                                {t(
                                                    'admin.liveActivityFeed'
                                                )}
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-400">
                                                {t(
                                                    'admin.recentMemberEvents'
                                                )}
                                            </p>
                                        </div>

                                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                                            <span className="size-1.5 rounded-full bg-emerald-400" />
                                            {t(
                                                'admin.live'
                                            )}
                                        </span>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-4">
                                        <AdminMember
                                            name="Alex Morgan"
                                            action={t(
                                                'admin.actions.breakfast'
                                            )}
                                            time={t(
                                                'admin.times.2min'
                                            )}
                                            online
                                        />

                                        <AdminMember
                                            name="Sam Rivera"
                                            action={t(
                                                'admin.actions.aiPhoto'
                                            )}
                                            time={t(
                                                'admin.times.18min'
                                            )}
                                            online
                                        />

                                        <AdminMember
                                            name="Taylor Kim"
                                            action={t(
                                                'admin.actions.completedGoal'
                                            )}
                                            time={t(
                                                'admin.times.42min'
                                            )}
                                        />

                                        <AdminMember
                                            name="Jordan Lee"
                                            action={t(
                                                'admin.actions.eveningMeal'
                                            )}
                                            time={t(
                                                'admin.times.1hr'
                                            )}
                                        />
                                    </div>

                                    <button className="mt-6 w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-emerald-400">
                                        {t(
                                            'admin.viewAllActivity'
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 ">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">
                                            {t(
                                                'admin.quickControls'
                                            )}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-400">
                                            {t(
                                                'admin.manageWorkspace'
                                            )}
                                        </p>
                                    </div>

                                    <Settings className="size-5 text-slate-500" />
                                </div>

                                <div className="mt-5 flex flex-wrap gap-3">
                                    <button className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950">
                                        {t(
                                            'admin.exportMemberReport'
                                        )}
                                    </button>

                                    <button className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300">
                                        {t(
                                            'admin.manageMembers'
                                        )}
                                    </button>

                                    <button className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300">
                                        {t(
                                            'admin.workspaceSettings'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div
                    className={`mx-auto w-full max-w-md px-4 pb-32 pt-5 ${activeNav ===
                        'recipes' ||
                        activeNav === 'gyms'
                        ? 'min-h-[100svh] bg-zinc-950 text-zinc-50'
                        : isNewSection
                            ? 'min-h-[100svh] bg-zinc-950 text-zinc-50'
                            : ''
                        }`}
                >
                    {activeNav === 'overview' ? (
                        renderToday()
                    ) : isNewSection ? (
                        renderSection()
                    ) : (
                        <>
                            <div className="mb-8 flex flex-col justify-between gap-5  ">
                                <div>
                                    <p className="mb-2 text-sm font-medium text-[#57a993]">
                                        {t(
                                            'dashboard.salom'
                                        )}
                                        ,{' '}
                                        {
                                            profileName
                                        }
                                        !
                                    </p>

                                    <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#19352f] ">
                                        {t(
                                            'dashboard.dailyOverview'
                                        )}
                                    </h1>

                                    <p className="mt-2 text-sm text-[#7d8d87]">
                                        {t(
                                            'dashboard.nutritionGoalsText'
                                        )}
                                    </p>
                                </div>

                                <button
                                    onClick={
                                        openMealModal
                                    }
                                    className="flex min-h-11 w-fit items-center gap-2 rounded-2xl bg-[#10b981] px-4 py-2.5 text-sm font-semibold text-[#062017]"
                                >
                                    <Plus className="size-4" />
                                    {t(
                                        'dashboard.logMeal'
                                    )}
                                </button>
                            </div>

                            <section className="grid gap-5 ">
                                <div className="rounded-2xl border border-[#e4ece8] bg-white p-6 shadow-[0_8px_30px_rgba(45,83,70,0.04)] ">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-[#768781]">
                                                {t(
                                                    'dashboard.todaysCalories'
                                                )}
                                            </p>

                                            <div className="mt-2 flex items-baseline gap-2">
                                                <span className="text-4xl font-semibold tracking-[-0.05em] text-[#19352f]">
                                                    {totals.calories.toLocaleString()}
                                                </span>

                                                <span className="text-sm text-[#91a09a]">
                                                    /{' '}
                                                    {dailyCalories.toLocaleString()}{' '}
                                                    kcal
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex size-11 items-center justify-center rounded-xl bg-[#e4f6ef] text-[#4eb99e]">
                                            <Flame className="size-5 fill-current" />
                                        </div>
                                    </div>

                                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#edf3f0]">
                                        <div
                                            className="h-full rounded-full bg-[#5ac4a4]"
                                            style={{
                                                width: `${Math.min(
                                                    (totals.calories /
                                                        dailyCalories) *
                                                    100,
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-2 flex justify-between text-xs text-[#8a9993]">
                                        <span>
                                            {Math.round(
                                                (totals.calories /
                                                    dailyCalories) *
                                                100
                                            )}
                                            %{' '}
                                            {t(
                                                'dashboard.dailyGoal'
                                            )}
                                        </span>

                                        <span>
                                            {Math.max(
                                                dailyCalories -
                                                totals.calories,
                                                0
                                            )}{' '}
                                            {t(
                                                'dashboard.kcalLeft'
                                            )}
                                        </span>
                                    </div>

                                    <div className="mt-7 grid grid-cols-3 gap-3 border-t border-[#edf1ef] pt-5">
                                        {macroData.map(
                                            (
                                                macro
                                            ) => (
                                                <div
                                                    key={
                                                        macro.label
                                                    }
                                                >
                                                    <div className="flex items-center gap-1.5 text-xs text-[#84938e]">
                                                        <span
                                                            className={`size-2 rounded-full ${macro.color}`}
                                                        />

                                                        {
                                                            macro.label
                                                        }
                                                    </div>

                                                    <p className="mt-1.5 text-lg font-semibold text-[#2b413b]">
                                                        {
                                                            macro.value
                                                        }

                                                        <span className="ml-1 text-xs font-normal text-[#93a19d]">
                                                            /{' '}
                                                            {
                                                                macro.goal
                                                            }
                                                            g
                                                        </span>
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5 text-white ">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-[#a7cdc1]">
                                                {t(
                                                    'dashboard.weeklyAverage'
                                                )}
                                            </p>

                                            <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                                                {dailyCalories.toLocaleString()}{' '}
                                                <span className="text-sm font-normal text-[#a7cdc1]">
                                                    kcal/day
                                                </span>
                                            </p>
                                        </div>

                                        <Sparkles className="size-5 text-[#78d8ba]" />
                                    </div>

                                    <div className="mt-7 flex h-20 items-end gap-2">
                                        {[
                                            45,
                                            63,
                                            52,
                                            80,
                                            58,
                                            74,
                                            55,
                                        ].map(
                                            (
                                                h,
                                                i
                                            ) => (
                                                <div
                                                    key={
                                                        i
                                                    }
                                                    className="flex flex-1 flex-col items-center gap-2"
                                                >
                                                    <div
                                                        className={`w-full rounded-t-md ${i ===
                                                            4
                                                            ? 'bg-[#70d5b7]'
                                                            : 'bg-[#41665b]'
                                                            }`}
                                                        style={{
                                                            height: `${h}%`,
                                                        }}
                                                    />

                                                    <span className="text-[10px] text-[#91b4aa]">
                                                        {
                                                            [
                                                                'M',
                                                                'T',
                                                                'W',
                                                                'T',
                                                                'F',
                                                                'S',
                                                                'S',
                                                            ][
                                                            i
                                                            ]
                                                        }
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="mt-5 flex items-center gap-2 text-xs text-[#a7cdc1]">
                                        <span className="flex size-5 items-center justify-center rounded-full bg-[#356b5d]">
                                            <ArrowDown className="size-3 rotate-45 text-[#78d8ba]" />
                                        </span>

                                        8%{' '}
                                        {t(
                                            'dashboard.betterThanLastWeek'
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="mt-5 grid gap-5 ">
                                <div className="rounded-2xl border border-[#a8dfcc] bg-[#effbf6] p-6 ">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#d9f7ea] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#238b68]">
                                                <Camera className="size-3.5" />

                                                {t(
                                                    'dashboard.scanWithCamera'
                                                )}
                                            </div>

                                            <h2 className="text-lg font-semibold text-[#23423a]">
                                                {t(
                                                    'dashboard.cameraIdentify'
                                                )}
                                            </h2>

                                            <p className="mt-1 max-w-[280px] text-sm leading-5 text-[#769089]">
                                                {t(
                                                    'dashboard.cameraQuestion'
                                                )}
                                            </p>
                                        </div>

                                        <button
                                            onClick={
                                                openCamera
                                            }
                                            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#193e35] text-[#8af0c7]"
                                            aria-label={t(
                                                'dashboard.scanWithCamera'
                                            )}
                                        >
                                            <Camera className="size-6" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={
                                            openCamera
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#10b981] px-4 py-3 text-sm font-bold text-[#062017] transition hover:bg-[#059669]"
                                    >
                                        <Camera className="size-4" />
                                        {t(
                                            'dashboard.takePhoto'
                                        )}
                                    </button>

                                    {uploaded ? (
                                        <div className="relative mt-5 overflow-hidden rounded-xl bg-white">
                                            <img
                                                src={
                                                    uploaded
                                                }
                                                alt={t(
                                                    'dashboard.uploadedMealPreview'
                                                )}
                                                className="h-32 w-full object-cover"
                                            />

                                            <button
                                                onClick={() => {
                                                    setUploaded(
                                                        null
                                                    )
                                                    setImageBase64(
                                                        null
                                                    )
                                                }}
                                                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-[#49645b]"
                                                aria-label={t(
                                                    'dashboard.removeUploadedImage'
                                                )}
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                inputRef.current?.click()
                                            }
                                            onDrop={(
                                                e
                                            ) => {
                                                e.preventDefault()

                                                handleFile(
                                                    e
                                                        .dataTransfer
                                                        .files[0]
                                                )
                                            }}
                                            onDragOver={(
                                                e
                                            ) =>
                                                e.preventDefault()
                                            }
                                            className="mt-5 flex w-full flex-col items-center justify-center rounded-xl border border-[#cce6dc] bg-white/70 px-4 py-6 text-center transition hover:bg-white"
                                        >
                                            <div className="mb-2 flex size-9 items-center justify-center rounded-full bg-[#dff4ec] text-[#4eb99e]">
                                                <Plus className="size-4" />
                                            </div>

                                            <span className="text-sm font-semibold text-[#387d6b]">
                                                {t(
                                                    'dashboard.uploadPhoto'
                                                )}
                                            </span>

                                            <span className="mt-1 text-xs text-[#8ca29b]">
                                                {t(
                                                    'dashboard.dragAndDrop'
                                                )}
                                            </span>
                                        </button>
                                    )}

                                    <input
                                        ref={
                                            inputRef
                                        }
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={(
                                            e
                                        ) => {
                                            handleFile(
                                                e
                                                    .target
                                                    .files?.[0]
                                            )

                                            e.currentTarget.value =
                                                ''
                                        }}
                                    />
                                </div>

                                <div className="rounded-2xl border border-[#e4ece8] bg-white p-6 ">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-[#23423a]">
                                                {t(
                                                    'dashboard.macroBreakdown'
                                                )}
                                            </h2>

                                            <p className="mt-1 text-sm text-[#82918c]">
                                                {t(
                                                    'dashboard.targetsProgress'
                                                )}
                                            </p>
                                        </div>

                                        <button className="flex items-center gap-1 text-xs font-semibold text-[#4ba48d]">
                                            {t(
                                                'dashboard.today'
                                            )}
                                            <ChevronDown className="size-3" />
                                        </button>
                                    </div>

                                    <div className="mt-6 flex flex-col gap-4">
                                        {macroData.map(
                                            (
                                                macro
                                            ) => (
                                                <div
                                                    key={
                                                        macro.label
                                                    }
                                                >
                                                    <div className="mb-2 flex justify-between text-sm">
                                                        <span className="font-medium text-[#50635c]">
                                                            {
                                                                macro.label
                                                            }
                                                        </span>

                                                        <span className="text-[#82918c]">
                                                            <strong className="text-[#2d453d]">
                                                                {
                                                                    macro.value
                                                                }
                                                                g
                                                            </strong>{' '}
                                                            /{' '}
                                                            {
                                                                macro.goal
                                                            }
                                                            g
                                                        </span>
                                                    </div>

                                                    <div
                                                        className={`h-2 rounded-full ${macro.soft}`}
                                                    >
                                                        <div
                                                            className={`h-full rounded-full ${macro.color}`}
                                                            style={{
                                                                width: `${Math.min(
                                                                    (macro.value /
                                                                        macro.goal) *
                                                                    100,
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="mt-8 grid gap-5 ">
                                <div className="rounded-2xl border border-[#e4ece8] bg-white p-6 ">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-[#57a993]">
                                                {t(
                                                    'dashboard.fastingPlan'
                                                )}
                                            </p>

                                            <h2 className="mt-1 text-lg font-semibold text-[#23423a]">
                                                {t(
                                                    'dashboard.stepByStepFasting'
                                                )}
                                            </h2>

                                            <p className="mt-1 text-sm text-[#82918c]">
                                                {t(
                                                    'dashboard.gentleRhythm'
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex size-10 items-center justify-center rounded-xl bg-[#e8f6f1] text-[#4ba48d]">
                                            <Clock className="size-5" />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f3faf7] p-4">
                                        <div>
                                            <p className="text-xs text-[#82918c]">
                                                {t(
                                                    'dashboard.eatingWindow'
                                                )}
                                            </p>

                                            <p className="mt-1 text-base font-semibold text-[#2d453d]">
                                                10:00 AM – 8:00 PM
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setFasting(
                                                    (
                                                        value
                                                    ) =>
                                                        !value
                                                )
                                            }
                                            className={`rounded-lg px-3 py-2 text-xs font-semibold ${fasting
                                                ? 'bg-[#10b981] text-[#062017]'
                                                : 'bg-white text-[#398b73] ring-1 ring-[#cfe6dc]'
                                                }`}
                                        >
                                            {fasting
                                                ? t(
                                                    'dashboard.fastingActive'
                                                )
                                                : t(
                                                    'dashboard.startFast'
                                                )}
                                        </button>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-2">
                                        {fastingStepKeys.map(
                                            (
                                                step,
                                                index
                                            ) => {
                                                const StepIcon =
                                                    step.icon

                                                return (
                                                    <button
                                                        key={
                                                            step.text
                                                        }
                                                        onClick={() =>
                                                            setRoutineSteps(
                                                                (
                                                                    current
                                                                ) =>
                                                                    current.map(
                                                                        (
                                                                            done,
                                                                            itemIndex
                                                                        ) =>
                                                                            itemIndex ===
                                                                                index
                                                                                ? !done
                                                                                : done
                                                                    )
                                                            )
                                                        }
                                                        className={`group flex items-center gap-3 rounded-xl p-2 text-left ${routineSteps[
                                                            index
                                                        ]
                                                            ? 'bg-[#f6fbf8]'
                                                            : ''
                                                            }`}
                                                    >
                                                        <span
                                                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${step.sticker}`}
                                                        >
                                                            {routineSteps[
                                                                index
                                                            ] ? (
                                                                <Check className="size-5" />
                                                            ) : (
                                                                <StepIcon className="size-5" />
                                                            )}
                                                        </span>

                                                        <span className="min-w-0 flex-1">
                                                            <span
                                                                className={`block text-sm ${routineSteps[
                                                                    index
                                                                ]
                                                                    ? 'text-[#91a09a] line-through'
                                                                    : 'text-[#50635c]'
                                                                    }`}
                                                            >
                                                                {t(
                                                                    step.text
                                                                )}
                                                            </span>

                                                            <span className="mt-0.5 block text-[11px] font-medium text-[#9aada5]">
                                                                {routineSteps[
                                                                    index
                                                                ]
                                                                    ? t(
                                                                        'dashboard.completed'
                                                                    )
                                                                    : t(
                                                                        step.label
                                                                    )}
                                                            </span>
                                                        </span>

                                                        <span
                                                            className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs ${routineSteps[
                                                                index
                                                            ]
                                                                ? 'border-[#5ac4a4] bg-[#5ac4a4] text-white'
                                                                : 'border-[#cfe1da] text-transparent'
                                                                }`}
                                                        >
                                                            <Check className="size-3" />
                                                        </span>
                                                    </button>
                                                )
                                            }
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5 text-white ">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-[#a7cdc1]">
                                                {t(
                                                    'dashboard.fastingPlan'
                                                )}
                                            </p>

                                            <h2 className="mt-1 text-lg font-semibold">
                                                {t(
                                                    'dashboard.smallHabits'
                                                )}
                                            </h2>
                                        </div>

                                        <Sparkles className="size-5 text-[#78d8ba]" />
                                    </div>

                                    <p className="mt-4 text-sm leading-6 text-[#b9d5cd]">
                                        {t(
                                            'dashboard.fastingDesc'
                                        )}
                                    </p>

                                    <div className="mt-6 grid grid-cols-3 gap-2">
                                        <div className="rounded-xl bg-[#2a554a] p-3">
                                            <p className="text-2xl font-semibold">
                                                {
                                                    routineSteps.filter(
                                                        Boolean
                                                    ).length
                                                }
                                                /4
                                            </p>

                                            <p className="mt-1 text-[11px] text-[#a7cdc1]">
                                                {t(
                                                    'dashboard.stepsDone'
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-[#2a554a] p-3">
                                            <p className="text-2xl font-semibold">
                                                14h
                                            </p>

                                            <p className="mt-1 text-[11px] text-[#a7cdc1]">
                                                {t(
                                                    'dashboard.fastingGoal'
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-[#2a554a] p-3">
                                            <p className="text-2xl font-semibold">
                                                {fasting
                                                    ? t(
                                                        'dashboard.on'
                                                    )
                                                    : t(
                                                        'dashboard.ready'
                                                    )}
                                            </p>

                                            <p className="mt-1 text-[11px] text-[#a7cdc1]">
                                                {t(
                                                    'dashboard.todaysPlan'
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#41665b]">
                                        <div
                                            className="h-full rounded-full bg-[#70d5b7] transition-all"
                                            style={{
                                                width: `${(routineSteps.filter(
                                                    Boolean
                                                ).length /
                                                    4) *
                                                    100
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="mt-8 rounded-[28px] border border-[#e2ece7] bg-white p-5 ">
                                <div className="flex flex-col gap-5 border-b border-[#edf1ef] pb-6   ">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#e7f7f0] text-[#4ba48d]">
                                                <Utensils className="size-4" />
                                            </span>

                                            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#57a993]">
                                                {t(
                                                    'dashboard.myMeals'
                                                )}
                                            </p>
                                        </div>

                                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#23423a]">
                                            {t(
                                                'dashboard.fuelYourDay'
                                            )}
                                        </h2>

                                        <p className="mt-1 text-sm text-[#82918c]">
                                            {t(
                                                'dashboard.visualLog'
                                            )}
                                        </p>
                                    </div>

                                    <button
                                        onClick={
                                            openMealModal
                                        }
                                        className="flex w-fit items-center gap-2 rounded-xl border border-[#bfe2d5] bg-[#f3fbf7] px-4 py-2.5 text-sm font-semibold text-[#398b73]"
                                    >
                                        <Plus className="size-4" />
                                        {t(
                                            'dashboard.logMeal'
                                        )}
                                    </button>
                                </div>

                                <div className="mt-6 grid gap-4  ">
                                    {meals.map(
                                        (
                                            meal,
                                            index
                                        ) => (
                                            <article
                                                key={`${meal.name}-${index}`}
                                                className="group overflow-hidden rounded-2xl border border-[#e7efeb] bg-[#fbfdfc]"
                                            >
                                                {meal.image ? (
                                                    <img
                                                        src={
                                                            meal.image
                                                        }
                                                        alt={`${meal.name} meal`}
                                                        className="h-32 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        className={`flex h-32 items-center justify-center text-5xl ${meal.color}`}
                                                    >
                                                        {
                                                            meal.icon
                                                        }
                                                    </div>
                                                )}

                                                <div className="p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-[#304840]">
                                                                {
                                                                    meal.name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-[#91a09a]">
                                                                {
                                                                    meal.type
                                                                }{' '}
                                                                <span className="mx-1">
                                                                    ·
                                                                </span>{' '}
                                                                {
                                                                    meal.time
                                                                }
                                                            </p>
                                                        </div>

                                                        <button
                                                            aria-label={t(
                                                                'dashboard.moreOptions'
                                                            )}
                                                            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#9aa9a3]"
                                                        >
                                                            <MoreHorizontal className="size-4" />
                                                        </button>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between border-t border-[#edf1ef] pt-3">
                                                        <p className="text-sm font-semibold text-[#304840]">
                                                            {
                                                                meal.calories
                                                            }{' '}
                                                            <span className="text-[11px] font-normal text-[#91a09a]">
                                                                kcal
                                                            </span>
                                                        </p>

                                                        <div className="flex gap-2 text-[10px] font-medium text-[#82918c]">
                                                            <span>
                                                                P{' '}
                                                                {
                                                                    meal.protein
                                                                }
                                                                g
                                                            </span>

                                                            <span>
                                                                C{' '}
                                                                {
                                                                    meal.carbs
                                                                }
                                                                g
                                                            </span>

                                                            <span>
                                                                F{' '}
                                                                {
                                                                    meal.fat
                                                                }
                                                                g
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        )
                                    )}
                                </div>

                                <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl bg-[#f3faf7] px-4 py-3.5 ">
                                    <p className="text-xs text-[#6f8880]">
                                        {t(
                                            'dashboard.youHaveLogged'
                                        )}{' '}
                                        <strong className="text-[#356e5d]">
                                            {
                                                meals.length
                                            }{' '}
                                            {t(
                                                'dashboard.mealsLoggedText'
                                            )}
                                        </strong>{' '}
                                        {totals.calories.toLocaleString()}{' '}
                                        {t(
                                            'dashboard.calories'
                                        )}
                                    </p>

                                    <button
                                        onClick={
                                            openMealModal
                                        }
                                        className="flex items-center gap-2 text-sm font-semibold text-[#4ba48d]"
                                    >
                                        <Plus className="size-4" />
                                        {t(
                                            'dashboard.addAnotherMeal'
                                        )}
                                    </button>
                                </div>
                            </section>
                        </>
                    )}
                </div>

                <nav
                    aria-label="Primary navigation"
                    className="fixed left-1/2 z-10 w-[calc(100%-1.5rem)] max-w-[26rem] -translate-x-1/2 rounded-[22px] border border-white/10 bg-[#0d1610]/95 p-1.5 shadow-2xl backdrop-blur-xl"
                    style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
                >
                    <ul className="grid grid-cols-5 gap-1">
                        {mobileNavItems.map((item) => {
                            const ItemIcon = item.icon
                            const isActive = activeNav === item.key

                            return (
                                <li key={item.key}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveNav(item.key)}
                                        aria-pressed={isActive}
                                        className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 transition ${isActive ? 'bg-emerald-400/12 text-emerald-300' : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200'}`}
                                    >
                                        <ItemIcon className="size-4" aria-hidden="true" />
                                        <span className="max-w-full truncate text-[9px] font-medium leading-none">
                                            {item.label}
                                        </span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* =====================================================
    AI FOOD SCANNER MODAL
===================================================== */}

                {(cameraOpen || modalOpen) && (
                    <div
                        className="intizom-mobile-panel fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/75 px-4 py-6 backdrop-blur-md"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-white/20 bg-[#173d34] p-5 text-white shadow-2xl ">

                            {/* HEADER */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8af0c7]">
                                        {t('dashboard.foodVisionAI')}
                                    </p>

                                    <h2 className="mt-2 text-2xl font-semibold">
                                        {scanResult
                                            ? 'AI Food Analysis'
                                            : t('dashboard.scanWithCamera')}
                                    </h2>

                                    <p className="mt-1 text-sm text-[#b9d5cd]">
                                        {scanResult
                                            ? 'AI detected the following nutrition information.'
                                            : t('dashboard.cameraQuestion')}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setCameraOpen(false)
                                        setModalOpen(false)
                                        setScanError('')
                                        setScanResult(null)
                                        setUploaded(null)
                                        setImageBase64(null)
                                        setFoodName('')
                                        setIsAnalyzing(false)
                                    }}
                                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15"
                                    aria-label="Close"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            <div className="mt-6 flex flex-col gap-4">

                                {/* =================================================
                    AI RESULT
                ================================================= */}

                                {scanResult ? (
                                    <>
                                        {/* IMAGE */}
                                        {uploaded && (
                                            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black">
                                                <img
                                                    src={uploaded}
                                                    alt={scanResult.name}
                                                    className="aspect-[4/3] w-full object-cover"
                                                />

                                                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/65 px-3 py-2 text-xs text-white backdrop-blur">
                                                    <Sparkles className="size-3.5 text-emerald-300" />
                                                    AI analyzed
                                                </div>
                                            </div>
                                        )}

                                        {/* RESULT CARD */}
                                        <div className="rounded-[24px] border border-emerald-300/15 bg-[#102f28] p-5">

                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#78d8ba]">
                                                        Detected food
                                                    </p>

                                                    <h3 className="mt-1 truncate text-2xl font-bold text-white">
                                                        {scanResult.name}
                                                    </h3>
                                                </div>

                                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                                    <Utensils className="size-5" />
                                                </div>
                                            </div>

                                            {/* CALORIES */}
                                            <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-900 p-4">
                                                <div className="flex items-center gap-3">

                                                    <div className="flex size-11 items-center justify-center rounded-xl bg-[#10b981]/15">
                                                        <Flame className="size-5 text-[#70d5b7]" />
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-[#9fc0b6]">
                                                            Calories
                                                        </p>

                                                        <p className="mt-0.5 text-2xl font-bold text-white">
                                                            {scanResult.calories}
                                                            <span className="ml-1 text-sm font-medium text-[#9fc0b6]">
                                                                kcal
                                                            </span>
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>

                                            {/* MACROS */}
                                            <div className="mt-3 grid grid-cols-3 gap-3">

                                                {/* PROTEIN */}
                                                <div className="rounded-2xl bg-[#8d9bf2]/10 p-4">
                                                    <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-[#8d9bf2]/15">
                                                        <span className="text-xs font-bold text-[#aeb8ff]">
                                                            P
                                                        </span>
                                                    </div>

                                                    <p className="text-[11px] text-[#9db2ad]">
                                                        Protein
                                                    </p>

                                                    <p className="mt-1 text-lg font-bold text-white">
                                                        {scanResult.protein}
                                                        <span className="ml-0.5 text-xs font-medium text-[#9db2ad]">
                                                            g
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* CARBS */}
                                                <div className="rounded-2xl bg-[#70d5b7]/10 p-4">
                                                    <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-[#70d5b7]/15">
                                                        <span className="text-xs font-bold text-[#70d5b7]">
                                                            C
                                                        </span>
                                                    </div>

                                                    <p className="text-[11px] text-[#9db2ad]">
                                                        Carbs
                                                    </p>

                                                    <p className="mt-1 text-lg font-bold text-white">
                                                        {scanResult.carbs}
                                                        <span className="ml-0.5 text-xs font-medium text-[#9db2ad]">
                                                            g
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* FAT */}
                                                <div className="rounded-2xl bg-[#f4bf77]/10 p-4">
                                                    <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-[#f4bf77]/15">
                                                        <span className="text-xs font-bold text-[#f4bf77]">
                                                            F
                                                        </span>
                                                    </div>

                                                    <p className="text-[11px] text-[#9db2ad]">
                                                        Fat
                                                    </p>

                                                    <p className="mt-1 text-lg font-bold text-white">
                                                        {scanResult.fat}
                                                        <span className="ml-0.5 text-xs font-medium text-[#9db2ad]">
                                                            g
                                                        </span>
                                                    </p>
                                                </div>

                                            </div>

                                            {/* INFO */}
                                            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                                                <p className="text-xs leading-5 text-[#8eafa5]">
                                                    These nutrition values are estimated by AI based on the visible food and portion.
                                                </p>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        <div className="grid grid-cols-2 gap-3">

                                            {/* SCAN AGAIN */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setScanResult(null)
                                                    setScanError('')
                                                    setUploaded(null)
                                                    setImageBase64(null)
                                                    setFoodName('')
                                                    setCameraOpen(false)
                                                    setModalOpen(true)
                                                }}
                                                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
                                            >
                                                <ArrowLeft className="size-4" />
                                                Scan again
                                            </button>

                                            {/* ADD TO MEALS */}

                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (!scanResult) return

                                                    try {
                                                        const token = localStorage.getItem('token')

                                                        if (!token) {
                                                            alert('Iltimos, qaytadan login qiling')
                                                            setScreen('auth')
                                                            setAuthMode('login')
                                                            return
                                                        }

                                                        const result = await apiFetch('/api/meals', {
                                                            method: 'POST',
                                                            body: JSON.stringify({
                                                                foodName: scanResult.name,
                                                                calories: scanResult.calories,
                                                                carbs: scanResult.carbs,
                                                                protein: scanResult.protein,
                                                                fat: scanResult.fat,
                                                                imageUrl: '',
                                                            }),
                                                        })

                                                        const savedMeal = mapMealFromApi(result.data)

                                                        setMeals((current) => [
                                                            {
                                                                ...savedMeal,
                                                                image: uploaded || undefined,
                                                            },
                                                            ...current,
                                                        ])

                                                        setScanResult(null)
                                                        setUploaded(null)
                                                        setImageBase64(null)
                                                        setFoodName('')
                                                        setScanError('')
                                                        setCameraOpen(false)
                                                        setModalOpen(false)

                                                    } catch (error) {
                                                        console.error('Meal save error:', error)

                                                        alert(
                                                            error instanceof Error
                                                                ? error.message
                                                                : 'Ovqatni serverga saqlashda xatolik yuz berdi'
                                                        )
                                                    }
                                                }}
                                                className="flex items-center justify-center gap-2 rounded-xl bg-[#10b981] py-3.5 text-sm font-bold text-[#062017] transition hover:bg-[#34d399]"
                                            >
                                                <Check className="size-4" />
                                                Add to meals
                                            </button>
                                        </div>
                                    </>

                                ) : cameraOpen ? (

                                    /* =================================================
                                       CAMERA
                                    ================================================= */

                                    <>
                                        <p className="text-xs text-[#a3c7bd]">
                                            {t('dashboard.cameraPrompt')}
                                        </p>

                                        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-xl">

                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                muted
                                                playsInline
                                                className="aspect-[4/3] w-full object-cover"
                                            />

                                            <div className="pointer-events-none absolute inset-4 rounded-[20px] border-2 border-white/30" />

                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-4 py-2 text-xs text-white backdrop-blur">
                                                Point camera at your food
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={capturePhoto}
                                            className="flex items-center justify-center gap-2 rounded-2xl bg-[#10b981] py-4 text-sm font-bold text-[#062017] shadow-[0_12px_30px_rgba(43,184,135,0.18)] transition hover:bg-[#34d399]"
                                        >
                                            <Camera className="size-5" />
                                            Take photo
                                        </button>

                                        {scanError && (
                                            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-200">
                                                {scanError}
                                            </div>
                                        )}
                                    </>

                                ) : uploaded ? (

                                    /* =================================================
                                       PHOTO PREVIEW
                                    ================================================= */

                                    <>
                                        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black">

                                            <img
                                                src={uploaded}
                                                alt="Food preview"
                                                className="aspect-[4/3] w-full object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUploaded(null)
                                                    setImageBase64(null)
                                                }}
                                                className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/75"
                                                aria-label="Remove image"
                                            >
                                                <X className="size-4" />
                                            </button>

                                            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs text-white backdrop-blur">
                                                <Check className="size-3.5 text-emerald-300" />
                                                Photo ready
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">

                                            <button
                                                type="button"
                                                onClick={openCamera}
                                                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                                            >
                                                <Camera className="size-4" />
                                                Retake
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    inputRef.current?.click()
                                                }
                                                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                                            >
                                                <CloudUpload className="size-4" />
                                                Upload
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            value={foodName}
                                            onChange={(e) =>
                                                setFoodName(
                                                    e.target.value
                                                )
                                            }
                                            placeholder={t('dashboard.enterFoodName')}
                                            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 transition focus:border-emerald-300/50"
                                        />

                                        <p className="text-[11px] leading-4 text-[#8eafa5]">
                                            Food name is optional. AI can identify the food from the photo automatically.
                                        </p>

                                        {scanError && (
                                            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-200">
                                                {scanError}
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={analyzeMeal}
                                            disabled={
                                                !imageBase64 ||
                                                isAnalyzing
                                            }
                                            className="flex items-center justify-center gap-2 rounded-2xl bg-[#10b981] py-4 text-sm font-bold text-[#062017] shadow-[0_12px_30px_rgba(43,184,135,0.16)] transition hover:bg-[#34d399] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <Loader2 className="size-5 animate-spin" />
                                                    AI is analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="size-4" />
                                                    {t('dashboard.scanButton')}
                                                </>
                                            )}
                                        </button>
                                    </>

                                ) : (

                                    /* =================================================
                                       CHOOSE CAMERA / UPLOAD
                                    ================================================= */

                                    <>
                                        <div className="grid grid-cols-2 gap-3">

                                            <button
                                                type="button"
                                                onClick={openCamera}
                                                className="group flex flex-col items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-7 text-center transition hover:bg-emerald-300/15"
                                            >
                                                <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-300/10">
                                                    <Camera className="size-6 text-emerald-300 transition group-hover:scale-110" />
                                                </div>

                                                <span className="text-sm font-bold text-white">
                                                    {t('dashboard.takePhoto')}
                                                </span>

                                                <span className="mt-1 text-[11px] text-[#91b0a7]">
                                                    Scan food with AI
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    inputRef.current?.click()
                                                }
                                                className="group flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-7 text-center transition hover:bg-white/10"
                                            >
                                                <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white/10">
                                                    <CloudUpload className="size-6 text-[#a8c7bd] transition group-hover:scale-110" />
                                                </div>

                                                <span className="text-sm font-bold text-white">
                                                    {t('dashboard.uploadPhoto')}
                                                </span>

                                                <span className="mt-1 text-[11px] text-[#91b0a7]">
                                                    JPG, PNG or WEBP
                                                </span>
                                            </button>
                                        </div>

                                        <input
                                            ref={inputRef}
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={(e) => {
                                                handleFile(
                                                    e.target.files?.[0]
                                                )

                                                e.currentTarget.value = ''
                                            }}
                                        />

                                        {scanError && (
                                            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-200">
                                                {scanError}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

/* ============================================================
   AUTH SCREEN
============================================================ */

function AuthScreen({
    mode,
    setMode,
    name,
    setName,
    password,
    setPassword,
    age,
    setAge,
    weight,
    setWeight,
    showPassword,
    setShowPassword,
    onSubmit,
    loading,
    error,
    copy,
}: {
    mode: 'register' | 'login'
    setMode: (
        mode:
            | 'register'
            | 'login'
    ) => void
    name: string
    setName: (
        value: string
    ) => void
    password: string
    setPassword: (
        value: string
    ) => void
    age: string
    setAge: (
        value: string
    ) => void
    weight: string
    setWeight: (
        value: string
    ) => void
    showPassword: boolean
    setShowPassword: (
        value: boolean
    ) => void
    onSubmit: () => void
    loading: boolean
    error: string
    copy: Record<
        string,
        string
    >
}) {
    return (
        <div className="intizom-app intizom-screen-shell mx-auto flex min-h-screen w-full max-w-md items-center justify-center bg-zinc-950 p-4 text-white">
            <div className="mx-auto grid min-h-[calc(100svh-2rem)] w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl">

                {/* LEFT SIDE */}
                <div className="relative hidden overflow-hidden bg-[#163d32] p-10   ">
                    <div className="absolute -right-20 -top-20 size-72 rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-teal-300/10 blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
                                <HeartPulse className="size-6 text-emerald-300" />
                            </div>

                            <span className="text-xl font-bold">
                                INTIZOM{' '}
                                <span className="text-emerald-300">
                                    AI
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="relative max-w-md">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
                            INTIZOM AI
                        </p>

                        <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em]">
                            Build habits.
                            <br />
                            Feel better.
                            <br />
                            Stay consistent.
                        </h1>

                        <p className="mt-6 max-w-sm text-sm leading-6 text-[#b5d2c9]">
                            Your nutrition, movement and daily routine — all in one calm workspace.
                        </p>

                        <div className="mt-8 grid grid-cols-3 gap-3">
                            <MiniAuthStat
                                icon={Flame}
                                text="Daily kcal"
                            />

                            <MiniAuthStat
                                icon={Droplets}
                                text="Hydration"
                            />

                            <MiniAuthStat
                                icon={Footprints}
                                text="Steps"
                            />
                        </div>
                    </div>

                    <p className="relative text-xs text-[#83a69b]">
                        Your routine. Your progress. Your Intizom.
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center justify-center p-6  ">
                    <div className="w-full max-w-md">

                        {/* Mobile logo */}
                        <div className="mb-8 flex items-center gap-3 ">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-[#183d32]">
                                <HeartPulse className="size-5 text-emerald-300" />
                            </div>

                            <span className="font-bold">
                                INTIZOM{' '}
                                <span className="text-emerald-300">
                                    AI
                                </span>
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="mb-8">
                            <div className="mb-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                                {mode === 'login'
                                    ? copy.welcomeBack
                                    : 'INTIZOM AI'}
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight ">
                                {mode === 'login'
                                    ? copy.welcomeBack
                                    : copy.createAccount}
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-[#8ea9a1]">
                                {mode === 'login'
                                    ? copy.loginSubtitle
                                    : copy.registerSubtitle}
                            </p>
                        </div>

                        {/* Login / Register tabs */}
                        <div className="mb-7 grid grid-cols-2 rounded-xl bg-[#091814] p-1">
                            <button
                                type="button"
                                onClick={() =>
                                    setMode('login')
                                }
                                className={`rounded-lg py-2.5 text-sm font-semibold transition ${mode === 'login'
                                    ? 'bg-[#10b981] text-[#062017]'
                                    : 'text-[#78968d]'
                                    }`}
                            >
                                {copy.login}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setMode('register')
                                }
                                className={`rounded-lg py-2.5 text-sm font-semibold transition ${mode === 'register'
                                    ? 'bg-[#10b981] text-[#062017]'
                                    : 'text-[#78968d]'
                                    }`}
                            >
                                {copy.register}
                            </button>
                        </div>

                        {/* Name */}
                        {mode === 'register' && (
                            <AuthInput
                                icon={User}
                                label={copy.name}
                                placeholder={
                                    copy.namePlaceholder
                                }
                                value={name}
                                onChange={setName}
                            />
                        )}

                        {/* Login name */}
                        {mode === 'login' && (
                            <AuthInput
                                icon={User}
                                label={copy.email}
                                placeholder={
                                    copy.emailPlaceholder
                                }
                                value={name}
                                onChange={setName}
                            />
                        )}

                        {/* Password */}
                        <div className="mt-4">
                            <label className="mb-2 block text-xs font-semibold text-[#9ab4ac]">
                                {copy.password}
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#648078]" />

                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder={
                                        copy.passwordPlaceholder
                                    }
                                    className="h-12 w-full rounded-xl border border-white/10 bg-[#091814] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-[#526d65] focus:border-emerald-400/50"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#648078]"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Age + Weight */}
                        {mode === 'register' && (
                            <div className="mt-4 grid grid-cols-2 gap-3">

                                <AuthInput
                                    icon={CalendarDays}
                                    label={copy.age}
                                    placeholder={
                                        copy.agePlaceholder
                                    }
                                    value={age}
                                    onChange={setAge}
                                />

                                <AuthInput
                                    icon={Scale}
                                    label={copy.weight}
                                    placeholder={
                                        copy.weightPlaceholder
                                    }
                                    value={weight}
                                    onChange={setWeight}
                                />

                            </div>
                        )}

                        {error && (
                            <p role="alert" className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={loading}
                            className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#10b981] px-5 py-3.5 text-sm font-bold text-[#062017] shadow-[0_12px_30px_rgba(43,184,135,0.18)] transition hover:bg-[#34d399] disabled:cursor-wait disabled:opacity-60"
                        >
                            {loading ? 'Yuklanmoqda...' : mode === 'login' ? copy.signIn : copy.createOne}
                            {loading ? <Loader2 className="size-4 animate-spin" /> : mode === 'login' ? <LogIn className="size-4" /> : <UserPlus className="size-4" />}
                        </button>

                        {/* Bottom switch */}
                        <p className="mt-7 text-center text-sm text-[#708c84]">
                            {mode === 'login'
                                ? copy.noAccount
                                : copy.haveAccount}{' '}

                            <button
                                type="button"
                                onClick={() =>
                                    setMode(
                                        mode === 'login'
                                            ? 'register'
                                            : 'login'
                                    )
                                }
                                className="font-semibold text-emerald-300"
                            >
                                {mode === 'login'
                                    ? copy.createOne
                                    : copy.signIn}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AuthInput({
    icon: Icon,
    label,
    placeholder,
    value,
    onChange,
}: {
    icon: typeof User
    label: string
    placeholder: string
    value: string
    onChange: (
        value: string
    ) => void
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-semibold text-[#9ab4ac]">
                {label}
            </label>

            <div className="relative">
                <Icon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#648078]" />

                <input
                    value={value}
                    onChange={(e) =>
                        onChange(
                            e.target.value
                        )
                    }
                    placeholder={placeholder}
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#091814] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#526d65] focus:border-emerald-400/50"
                />
            </div>
        </div>
    )
}

function MiniAuthStat({
    icon: Icon,
    text,
}: {
    icon: typeof Flame
    text: string
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <Icon className="mb-3 size-4 text-emerald-300" />

            <p className="text-[11px] text-[#9bbab0]">
                {text}
            </p>
        </div>
    )
}

/* ============================================================
   ONBOARDING
============================================================ */

function OnboardingScreen({
    step,
    setStep,
    authAge,
    setAuthAge,
    authWeight,
    setAuthWeight,
    height,
    setHeight,
    gender,
    setGender,
    goal,
    setGoal,
    activity,
    setActivity,
    onNext,
    onBack,
    valid,
    copy,
}: {
    step: number
    setStep: (
        step: number
    ) => void
    authAge: string
    setAuthAge: (
        value: string
    ) => void
    authWeight: string
    setAuthWeight: (
        value: string
    ) => void
    height: string
    setHeight: (
        value: string
    ) => void
    gender: string
    setGender: (
        value: string
    ) => void
    goal: string
    setGoal: (
        value: string
    ) => void
    activity: string
    setActivity: (
        value: string
    ) => void
    onNext: () => void
    onBack: () => void
    valid: boolean
    copy: Record<
        string,
        string
    >
}) {
    const progress =
        (step / 5) * 100

    const optionClass = (
        selected: boolean
    ) =>
        `flex items-center justify-between rounded-2xl border p-4 text-left transition ${selected
            ? 'border-emerald-400/60 bg-emerald-400/10'
            : 'border-white/10 bg-white/[0.03] hover:border-white/20'
        }`

    return (
        <div className="intizom-app intizom-screen-shell mx-auto min-h-screen w-full max-w-md bg-zinc-950 p-4 text-white">
            <div className="mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-md flex-col rounded-3xl border border-white/10 bg-zinc-900/80 p-5 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/10">
                            <HeartPulse className="size-5 text-emerald-300" />
                        </div>

                        <span className="font-bold">
                            INTIZOM{' '}
                            <span className="text-emerald-300">
                                AI
                            </span>
                        </span>
                    </div>

                    <span className="text-xs font-semibold text-[#78968d]">
                        {step} / 5
                    </span>
                </div>

                <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>

                <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-12">
                    <div className="mb-10 text-center">
                        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                            {step ===
                                1 && (
                                    <CalendarDays className="size-6" />
                                )}

                            {step ===
                                2 && (
                                    <Scale className="size-6" />
                                )}

                            {step ===
                                3 && (
                                    <Ruler className="size-6" />
                                )}

                            {step ===
                                4 && (
                                    <User className="size-6" />
                                )}

                            {step ===
                                5 && (
                                    <Target className="size-6" />
                                )}
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight ">
                            {step ===
                                1 &&
                                copy.age}

                            {step ===
                                2 &&
                                copy.weight}

                            {step ===
                                3 &&
                                copy.height}

                            {step ===
                                4 &&
                                copy.gender}

                            {step ===
                                5 &&
                                copy.goalTitle}
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#829f96]">
                            {step ===
                                1 &&
                                copy.ageSubtitle}

                            {step ===
                                2 &&
                                copy.weightSubtitle}

                            {step ===
                                3 &&
                                copy.heightSubtitle}

                            {step ===
                                4 &&
                                copy.onboardingSubtitle}

                            {step ===
                                5 &&
                                copy.activityTitle}
                        </p>
                    </div>

                    {step ===
                        1 && (
                            <input
                                autoFocus
                                type="number"
                                value={
                                    authAge
                                }
                                onChange={(
                                    e
                                ) =>
                                    setAuthAge(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder={
                                    copy.agePlaceholder
                                }
                                className="h-16 w-full rounded-2xl border border-white/10 bg-[#091814] px-5 text-center text-2xl text-white outline-none placeholder:text-[#415d55] focus:border-emerald-400/50"
                            />
                        )}

                    {step ===
                        2 && (
                            <input
                                autoFocus
                                type="number"
                                value={
                                    authWeight
                                }
                                onChange={(
                                    e
                                ) =>
                                    setAuthWeight(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder={
                                    copy.weightPlaceholder
                                }
                                className="h-16 w-full rounded-2xl border border-white/10 bg-[#091814] px-5 text-center text-2xl text-white outline-none placeholder:text-[#415d55] focus:border-emerald-400/50"
                            />
                        )}

                    {step ===
                        3 && (
                            <input
                                autoFocus
                                type="number"
                                value={
                                    height
                                }
                                onChange={(
                                    e
                                ) =>
                                    setHeight(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder={
                                    copy.heightPlaceholder
                                }
                                className="h-16 w-full rounded-2xl border border-white/10 bg-[#091814] px-5 text-center text-2xl text-white outline-none placeholder:text-[#415d55] focus:border-emerald-400/50"
                            />
                        )}

                    {step ===
                        4 && (
                            <div className="grid gap-3 ">
                                <button
                                    onClick={() =>
                                        setGender(
                                            'male'
                                        )
                                    }
                                    className={optionClass(
                                        gender ===
                                        'male'
                                    )}
                                >
                                    <span className="font-semibold">
                                        {
                                            copy.male
                                        }
                                    </span>

                                    {gender ===
                                        'male' && (
                                            <Check className="size-5 text-emerald-300" />
                                        )}
                                </button>

                                <button
                                    onClick={() =>
                                        setGender(
                                            'female'
                                        )
                                    }
                                    className={optionClass(
                                        gender ===
                                        'female'
                                    )}
                                >
                                    <span className="font-semibold">
                                        {
                                            copy.female
                                        }
                                    </span>

                                    {gender ===
                                        'female' && (
                                            <Check className="size-5 text-emerald-300" />
                                        )}
                                </button>
                            </div>
                        )}

                    {step ===
                        5 && (
                            <div className="space-y-5">
                                <div>
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#718e85]">
                                        {
                                            copy.goalTitle
                                        }
                                    </p>

                                    <div className="grid gap-2">
                                        <button
                                            onClick={() =>
                                                setGoal(
                                                    'Weight loss'
                                                )
                                            }
                                            className={optionClass(
                                                goal ===
                                                'Weight loss'
                                            )}
                                        >
                                            {
                                                copy.weightLoss
                                            }

                                            {goal ===
                                                'Weight loss' && (
                                                    <Check className="size-5 text-emerald-300" />
                                                )}
                                        </button>

                                        <button
                                            onClick={() =>
                                                setGoal(
                                                    'Maintain weight'
                                                )
                                            }
                                            className={optionClass(
                                                goal ===
                                                'Maintain weight'
                                            )}
                                        >
                                            {
                                                copy.maintain
                                            }

                                            {goal ===
                                                'Maintain weight' && (
                                                    <Check className="size-5 text-emerald-300" />
                                                )}
                                        </button>

                                        <button
                                            onClick={() =>
                                                setGoal(
                                                    'Build muscle'
                                                )
                                            }
                                            className={optionClass(
                                                goal ===
                                                'Build muscle'
                                            )}
                                        >
                                            {
                                                copy.muscle
                                            }

                                            {goal ===
                                                'Build muscle' && (
                                                    <Check className="size-5 text-emerald-300" />
                                                )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#718e85]">
                                        {
                                            copy.activityTitle
                                        }
                                    </p>

                                    <div className="grid gap-2">
                                        <button
                                            onClick={() =>
                                                setActivity(
                                                    'Low activity'
                                                )
                                            }
                                            className={optionClass(
                                                activity ===
                                                'Low activity'
                                            )}
                                        >
                                            {
                                                copy.low
                                            }
                                        </button>

                                        <button
                                            onClick={() =>
                                                setActivity(
                                                    'Moderately active'
                                                )
                                            }
                                            className={optionClass(
                                                activity ===
                                                'Moderately active'
                                            )}
                                        >
                                            {
                                                copy.moderate
                                            }
                                        </button>

                                        <button
                                            onClick={() =>
                                                setActivity(
                                                    'Highly active'
                                                )
                                            }
                                            className={optionClass(
                                                activity ===
                                                'Highly active'
                                            )}
                                        >
                                            {
                                                copy.high
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    <div className="mt-10 flex items-center justify-between gap-3">
                        <button
                            onClick={
                                onBack
                            }
                            className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-[#8da9a0]"
                        >
                            <ArrowLeft className="size-4" />
                            {
                                copy.back
                            }
                        </button>

                        <button
                            onClick={
                                onNext
                            }
                            disabled={
                                !valid
                            }
                            className="flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-[#062017] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            {
                                copy.continue
                            }

                            <ArrowRight className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ============================================================
   SUCCESS
============================================================ */

function SuccessScreen({
    name,
    calories,
    water,
    protein,
    carbs,
    fat,
    goal,
    onStart,
    copy,
}: {
    name: string
    calories: number
    water: number
    protein: number
    carbs: number
    fat: number
    goal: string
    onStart: () => void
    copy: Record<
        string,
        string
    >
}) {
    const goalText =
        goal ===
            'Weight loss'
            ? copy.weightLoss
            : goal ===
                'Build muscle'
                ? copy.muscle
                : copy.maintain

    return (
        <div className="intizom-app intizom-screen-shell relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-zinc-950 p-4 text-white">
            <div className="pointer-events-none absolute left-1/2 top-[-180px] size-[500px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-md items-center justify-center">
                <div className="w-full rounded-3xl border border-white/10 bg-zinc-900/95 p-5 shadow-2xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="relative mx-auto mb-7 flex size-20 items-center justify-center rounded-[26px] bg-emerald-400 text-[#062017] shadow-[0_0_50px_rgba(52,211,153,0.2)]">
                            <Trophy className="size-9" />

                            <span className="absolute -right-2 -top-2 text-2xl">
                                ✨
                            </span>
                        </div>

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            INTIZOM AI
                        </p>

                        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] ">
                            {
                                copy.congratulations
                            }
                        </h1>

                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#8eaaa1] ">
                            {
                                copy.congratulationsSub
                            }
                        </p>

                        <div className="mt-3 text-lg font-semibold text-white">
                            {
                                name
                            }{' '}
                            👋
                        </div>
                    </div>

                    <div className="mx-auto mt-8 grid w-full grid-cols-2 gap-3">
                        <SuccessStat
                            icon={
                                Flame
                            }
                            value={calories.toLocaleString()}
                            label={`${copy.dailyTarget} (${copy.kcal})`}
                        />

                        <SuccessStat
                            icon={
                                Droplets
                            }
                            value={`${water} L`}
                            label={
                                copy.dailyWater
                            }
                        />

                        <SuccessStat
                            icon={
                                Target
                            }
                            value={
                                goalText
                            }
                            label={
                                copy.goalLabel
                            }
                        />

                        <SuccessStat
                            icon={
                                HeartPulse
                            }
                            value={`${protein}g`}
                            label={
                                copy.proteinTarget
                            }
                        />
                    </div>

                    <div className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                            <p className="text-2xl font-bold text-white">
                                {
                                    carbs
                                }
                                g
                            </p>

                            <p className="mt-1 text-xs text-[#718e85]">
                                {
                                    copy.carbsTarget
                                }
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                            <p className="text-2xl font-bold text-white">
                                {
                                    fat
                                }
                                g
                            </p>

                            <p className="mt-1 text-xs text-[#718e85]">
                                {
                                    copy.fatTarget
                                }
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5 text-center">
                        <p className="text-sm font-semibold text-emerald-200">
                            {
                                copy.yourPlan
                            }
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#7f9d94]">
                            {
                                copy.personalized
                            }
                        </p>
                    </div>

                    <div className="mt-9 flex justify-center">
                        <button
                            onClick={
                                onStart
                            }
                            className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 text-sm font-bold text-[#062017] shadow-[0_15px_40px_rgba(52,211,153,0.18)] transition hover:scale-[1.02] hover:bg-emerald-300"
                        >
                            {
                                copy.startJourney
                            }

                            <ArrowRight className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SuccessStat({
    icon: Icon,
    value,
    label,
}: {
    icon: typeof Flame
    value: string
    label: string
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center">
            <div className="mx-auto mb-3 flex size-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <Icon className="size-4" />
            </div>

            <p className="truncate text-xl font-bold text-white">
                {
                    value
                }
            </p>

            <p className="mt-1 text-[11px] leading-4 text-[#718e85]">
                {
                    label
                }
            </p>
        </div>
    )
}

function NavItem({
    icon: Icon,
    label,
    active,
    onClick,
}: {
    icon: typeof LayoutDashboard
    label: string
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={
                onClick
            }
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${active
                ? 'bg-[#e9f6f2] text-[#327967]'
                : 'text-[#61736d] hover:bg-[#f3f7f5] hover:text-[#182522]'
                }`}
        >
            <Icon className="size-4" />
            {
                label
            }
        </button>
    )
}

function AdminStat({
    label,
    value,
    detail,
}: {
    label: string
    value: string
    detail: string
}) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs font-medium text-slate-400">
                {
                    label
                }
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight text-white">
                {
                    value
                }
            </p>

            <p className="mt-1 text-xs text-emerald-400">
                {
                    detail
                }
            </p>
        </div>
    )
}

function AdminMember({
    name,
    action,
    time,
    online,
}: {
    name: string
    action: string
    time: string
    online?: boolean
}) {
    return (
        <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
                <div
                    className={`size-2 rounded-full ${online
                        ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                        : 'bg-slate-600'
                        }`}
                />

                <span className="font-semibold text-slate-200">
                    {
                        name
                    }
                </span>

                <span className="text-slate-400">
                    {
                        action
                    }
                </span>
            </div>

            <span className="text-slate-500">
                {
                    time
                }
            </span>
        </div>
    )
}
