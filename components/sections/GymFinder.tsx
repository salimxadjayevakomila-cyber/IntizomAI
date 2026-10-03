 'use client'

import { useMemo, useState } from 'react'
import {
  Car,
  ChevronDown,
  ChevronUp,
  Coffee,
  Dumbbell,
  Heart,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  Star,
  Waves,
  Wifi,
} from 'lucide-react'

import { useLanguage } from '@/contexts/language-context'

type Language = 'uz' | 'ru' | 'en'

type Gym = {
  id: string
  name: string
  city: string
  location: string
  rating: number
  reviews: number
  hours: string
  is247: boolean
  image: string
  description: Record<Language, string>
  facilities: {
    icon: typeof Dumbbell
    label: Record<Language, string>
  }[]
}

const GYMS: Gym[] = [
  {
    id: 'befit-one',
    name: 'BeFit ONE',
    city: 'Toshkent',
    location: 'Mirzo Ulug‘bek, Osiyo ko‘chasi 1B',
    rating: 5.0,
    reviews: 525,
    hours: '07:00–23:00',
    is247: false,
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Zamonaviy trenajyorlar va professional mashg‘ulotlar uchun qulay fitness markaz.',
      ru: 'Современный фитнес-центр с тренажёрами и комфортными условиями для тренировок.',
      en: 'A modern fitness center with quality equipment and comfortable training facilities.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Trenajyorlar', ru: 'Тренажёры', en: 'Equipment' },
      },
      {
        icon: Waves,
        label: { uz: 'Dush', ru: 'Душ', en: 'Showers' },
      },
      {
        icon: Wifi,
        label: { uz: 'Wi-Fi', ru: 'Wi-Fi', en: 'Wi-Fi' },
      },
    ],
  },
  {
    id: 'befit-pro',
    name: 'BeFit PRO',
    city: 'Toshkent',
    location: 'Chilonzor, Beshyog‘och ko‘chasi 10B',
    rating: 5.0,
    reviews: 1187,
    hours: '07:00–23:00',
    is247: false,
    image:
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Keng zal, zamonaviy uskunalar va turli mashg‘ulotlar uchun professional muhit.',
      ru: 'Просторный зал, современное оборудование и профессиональная атмосфера.',
      en: 'A spacious gym with modern equipment and a professional training environment.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Fitness', ru: 'Фитнес', en: 'Fitness' },
      },
      {
        icon: Car,
        label: { uz: 'Parking', ru: 'Парковка', en: 'Parking' },
      },
      {
        icon: Waves,
        label: { uz: 'Dush', ru: 'Душ', en: 'Showers' },
      },
    ],
  },
  {
    id: 'chekhov',
    name: 'Chekhov Sport',
    city: 'Toshkent',
    location: 'Mirobod, Fidokor ko‘chasi 40/1',
    rating: 4.8,
    reviews: 500,
    hours: '07:00–23:00',
    is247: false,
    image:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Sport va fitness bilan shug‘ullanish uchun zamonaviy va qulay sport klubi.',
      ru: 'Современный спортивный клуб для тренировок и занятий фитнесом.',
      en: 'A modern sports club for fitness and strength training.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Og‘ir atletika', ru: 'Силовые', en: 'Strength' },
      },
      {
        icon: Coffee,
        label: { uz: 'Kafe', ru: 'Кафе', en: 'Cafe' },
      },
      {
        icon: Wifi,
        label: { uz: 'Wi-Fi', ru: 'Wi-Fi', en: 'Wi-Fi' },
      },
    ],
  },
  {
    id: 'landfitness',
    name: 'LandFitness',
    city: 'Toshkent',
    location: 'Chilonzor',
    rating: 4.8,
    reviews: 200,
    hours: '24/7',
    is247: true,
    image:
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Kun-u tun ishlaydigan zamonaviy fitness markazi.',
      ru: 'Современный фитнес-центр, работающий круглосуточно.',
      en: 'A modern fitness center open 24 hours a day.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Trenajyorlar', ru: 'Тренажёры', en: 'Equipment' },
      },
      {
        icon: ShieldCheck,
        label: { uz: 'Xavfsizlik', ru: 'Безопасность', en: 'Security' },
      },
      {
        icon: Car,
        label: { uz: 'Parking', ru: 'Парковка', en: 'Parking' },
      },
    ],
  },
  {
    id: 'buka',
    name: 'Buka Fit',
    city: 'Toshkent',
    location: 'Mirobod, 41/6',
    rating: 5.0,
    reviews: 1400,
    hours: '24/7',
    is247: true,
    image:
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Yuqori sifatli fitness uskunalari va qulay mashg‘ulot muhiti.',
      ru: 'Качественное оборудование и комфортная атмосфера для тренировок.',
      en: 'Quality fitness equipment and a comfortable training atmosphere.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Fitness', ru: 'Фитнес', en: 'Fitness' },
      },
      {
        icon: Waves,
        label: { uz: 'Dush', ru: 'Душ', en: 'Showers' },
      },
      {
        icon: Car,
        label: { uz: 'Parking', ru: 'Парковка', en: 'Parking' },
      },
    ],
  },
  {
    id: 'lafit',
    name: 'Lafit Andijan',
    city: 'Andijon',
    location: 'Mashrab ko‘chasi 18',
    rating: 4.9,
    reviews: 108,
    hours: '08:00–22:00',
    is247: false,
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Andijondagi qulay va zamonaviy fitness markaz.',
      ru: 'Современный и комфортный фитнес-центр в Андижане.',
      en: 'A modern and comfortable fitness center in Andijan.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Trenajyorlar', ru: 'Тренажёры', en: 'Equipment' },
      },
      {
        icon: Wifi,
        label: { uz: 'Wi-Fi', ru: 'Wi-Fi', en: 'Wi-Fi' },
      },
    ],
  },
  {
    id: 'alp',
    name: 'Alpomish Fitness',
    city: 'Andijon',
    location: 'Amir Temur shoh ko‘chasi 59',
    rating: 5.0,
    reviews: 88,
    hours: '08:00–22:00',
    is247: false,
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Mashg‘ulotlar uchun qulay va zamonaviy sport zali.',
      ru: 'Удобный современный спортивный зал для тренировок.',
      en: 'A comfortable modern gym for your workouts.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Gym', ru: 'Зал', en: 'Gym' },
      },
      {
        icon: Car,
        label: { uz: 'Parking', ru: 'Парковка', en: 'Parking' },
      },
    ],
  },
  {
    id: 'znx',
    name: 'ZNX Oxygen Fitness',
    city: 'Andijon',
    location: 'O‘zbekiston ko‘chasi 364',
    rating: 5.0,
    reviews: 101,
    hours: '24/7',
    is247: true,
    image:
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: '24/7 ishlaydigan zamonaviy fitness markaz.',
      ru: 'Современный фитнес-центр, работающий 24/7.',
      en: 'A modern fitness center open 24/7.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Fitness', ru: 'Фитнес', en: 'Fitness' },
      },
      {
        icon: Waves,
        label: { uz: 'Dush', ru: 'Душ', en: 'Showers' },
      },
    ],
  },
  {
    id: 'life-sam',
    name: 'Life Fitness',
    city: 'Samarqand',
    location: 'Mir Sayyid Baraka mahallasi',
    rating: 5.0,
    reviews: 192,
    hours: '24/7',
    is247: true,
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Samarqanddagi zamonaviy va qulay fitness markaz.',
      ru: 'Современный фитнес-центр в Самарканде.',
      en: 'A modern fitness center in Samarkand.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Gym', ru: 'Зал', en: 'Gym' },
      },
      {
        icon: Wifi,
        label: { uz: 'Wi-Fi', ru: 'Wi-Fi', en: 'Wi-Fi' },
      },
      {
        icon: Waves,
        label: { uz: 'Dush', ru: 'Душ', en: 'Showers' },
      },
    ],
  },
  {
    id: 'academy',
    name: 'Fitness Academy',
    city: 'Samarqand',
    location: 'Amir Temur ko‘chasi 117',
    rating: 5.0,
    reviews: 270,
    hours: '07:00–23:00',
    is247: false,
    image:
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Professional mashg‘ulotlar va zamonaviy sport uskunalari.',
      ru: 'Профессиональные тренировки и современное оборудование.',
      en: 'Professional training and modern fitness equipment.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Fitness', ru: 'Фитнес', en: 'Fitness' },
      },
      {
        icon: ShieldCheck,
        label: { uz: 'Xavfsizlik', ru: 'Безопасность', en: 'Security' },
      },
    ],
  },
  {
    id: 'olympia',
    name: 'Olympia',
    city: 'Samarqand',
    location: 'Professor Nuriddin Shukurov ko‘chasi 12',
    rating: 5.0,
    reviews: 240,
    hours: '24/7',
    is247: true,
    image:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Keng va zamonaviy sport zali.',
      ru: 'Просторный современный спортивный зал.',
      en: 'A spacious modern gym.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Gym', ru: 'Зал', en: 'Gym' },
      },
      {
        icon: Car,
        label: { uz: 'Parking', ru: 'Парковка', en: 'Parking' },
      },
    ],
  },
  {
    id: 'krida',
    name: 'Krida',
    city: 'Almaty, Kazakhstan',
    location: 'Nauryzbay Batyr ko‘chasi 89',
    rating: 5.0,
    reviews: 1064,
    hours: '06:00–00:00',
    is247: false,
    image:
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Almatydagi zamonaviy va premium fitness markaz.',
      ru: 'Современный премиальный фитнес-центр в Алматы.',
      en: 'A modern premium fitness center in Almaty.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Premium gym', ru: 'Премиум зал', en: 'Premium gym' },
      },
      {
        icon: Waves,
        label: { uz: 'Dush', ru: 'Душ', en: 'Showers' },
      },
    ],
  },
  {
    id: 'royal',
    name: 'Royal Club',
    city: 'Almaty, Kazakhstan',
    location: 'Samal-3, 20',
    rating: 5.0,
    reviews: 492,
    hours: '06:00–00:00',
    is247: false,
    image:
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=85',
    description: {
      uz: 'Almaty shahridagi zamonaviy fitness klubi.',
      ru: 'Современный фитнес-клуб в Алматы.',
      en: 'A modern fitness club in Almaty.',
    },
    facilities: [
      {
        icon: Dumbbell,
        label: { uz: 'Fitness', ru: 'Фитнес', en: 'Fitness' },
      },
      {
        icon: Wifi,
        label: { uz: 'Wi-Fi', ru: 'Wi-Fi', en: 'Wi-Fi' },
      },
      {
        icon: Car,
        label: { uz: 'Parking', ru: 'Парковка', en: 'Parking' },
      },
    ],
  },
]

const TEXT = {
  uz: {
    badge: 'GYM FINDER',
    title: 'O‘zingizga mos gymni toping',
    subtitle:
      'O‘zingizga qulay joydagi fitness markazlarini toping va mashg‘ulotni boshlang.',
    search: 'Gym nomi yoki manzilini qidiring...',
    all: 'Barchasi',
    allGyms: 'Barcha gymlar',
    open247: '24/7',
    top: 'Top rated',
    recommended: 'Tavsiya etilgan gymlar',
    details: 'Batafsil',
    hide: 'Yopish',
    reviews: 'ta sharh',
    openMap: 'Google Maps',
    facilities: 'Qulayliklar',
    noResults: 'Gym topilmadi',
  },
  ru: {
    badge: 'GYM FINDER',
    title: 'Найдите подходящий зал',
    subtitle:
      'Найдите фитнес-центры в удобном месте и начните свои тренировки.',
    search: 'Поиск по названию или адресу...',
    all: 'Все',
    allGyms: 'Все залы',
    open247: '24/7',
    top: 'Топ рейтинг',
    recommended: 'Рекомендуемые залы',
    details: 'Подробнее',
    hide: 'Скрыть',
    reviews: 'отзывов',
    openMap: 'Google Maps',
    facilities: 'Удобства',
    noResults: 'Залы не найдены',
  },
  en: {
    badge: 'GYM FINDER',
    title: 'Find the right gym for you',
    subtitle:
      'Discover fitness centers in convenient locations and start your training.',
    search: 'Search gym name or location...',
    all: 'All',
    allGyms: 'All gyms',
    open247: '24/7',
    top: 'Top rated',
    recommended: 'Recommended gyms',
    details: 'Details',
    hide: 'Hide',
    reviews: 'reviews',
    openMap: 'Google Maps',
    facilities: 'Facilities',
    noResults: 'No gyms found',
  },
}

export default function GymFinder() {
  const { language } = useLanguage()

  const lang: Language =
    language === 'ru' || language === 'en' ? language : 'uz'

  const t = TEXT[lang]

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | '247' | 'top'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredGyms = useMemo(() => {
    const query = search.toLowerCase().trim()

    return GYMS.filter((gym) => {
      const matchesSearch =
        !query ||
        gym.name.toLowerCase().includes(query) ||
        gym.city.toLowerCase().includes(query) ||
        gym.location.toLowerCase().includes(query)

      const matchesFilter =
        filter === 'all' ||
        (filter === '247' && gym.is247) ||
        (filter === 'top' && gym.rating >= 5)

      return matchesSearch && matchesFilter
    })
  }, [search, filter])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    )
  }

  const openMap = (gym: Gym) => {
    const query = encodeURIComponent(`${gym.name}, ${gym.location}`)
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      '_blank'
    )
  }

  return (
    <section className="min-h-[calc(100vh-73px)] w-full bg-white text-slate-900">
      <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold tracking-wider text-emerald-700">
            <Dumbbell className="h-3.5 w-3.5" />
            {t.badge}
          </div>

          <h1 className="max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {t.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            {t.subtitle}
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              className="h-12 w-full rounded-xl bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: 'all', label: t.all },
            { id: '247', label: t.open247 },
            { id: 'top', label: t.top },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() =>
                setFilter(item.id as 'all' | '247' | 'top')
              }
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === item.id
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* TITLE */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
              {t.recommended}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {filteredGyms.length} {t.allGyms.toLowerCase()}
            </p>
          </div>
        </div>

        {/* CARDS */}
        {filteredGyms.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredGyms.map((gym) => {
              const isExpanded = expanded === gym.id
              const isFavorite = favorites.includes(gym.id)

              return (
                <article
                  key={gym.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={gym.image}
                      alt={gym.name}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                    <button
                      onClick={() => toggleFavorite(gym.id)}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-105"
                      aria-label="Favorite"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFavorite
                            ? 'fill-red-500 text-red-500'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>

                    {gym.is247 && (
                      <div className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                        24/7
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-extrabold text-white">
                        {gym.name}
                      </h3>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-2 text-sm text-slate-500">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                        <div>
                          <p className="font-bold text-slate-800">
                            {gym.city}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                            {gym.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-slate-800">
                          {gym.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <p className="mb-4 text-sm leading-6 text-slate-500">
                      {gym.description[lang]}
                    </p>

                    {/* FACILITIES */}
                    <div className="mb-5 flex flex-wrap gap-2">
                      {gym.facilities.map((facility, index) => {
                        const Icon = facility.icon

                        return (
                          <div
                            key={`${gym.id}-${index}`}
                            className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                          >
                            <Icon className="h-3.5 w-3.5 text-emerald-600" />
                            {facility.label[lang]}
                          </div>
                        )
                      })}
                    </div>

                    {/* BOTTOM */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {gym.hours}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {gym.reviews} {t.reviews}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setExpanded(isExpanded ? null : gym.id)
                        }
                        className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                      >
                        {isExpanded ? t.hide : t.details}

                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* DETAILS */}
                    {isExpanded && (
                      <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <p className="mb-3 text-sm font-bold text-slate-800">
                          {t.facilities}
                        </p>

                        <div className="mb-4 grid grid-cols-2 gap-2">
                          {gym.facilities.map((facility, index) => {
                            const Icon = facility.icon

                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2 rounded-lg bg-white p-2.5 text-xs text-slate-600"
                              >
                                <Icon className="h-4 w-4 text-emerald-600" />
                                {facility.label[lang]}
                              </div>
                            )
                          })}
                        </div>

                        <button
                          onClick={() => openMap(gym)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                        >
                          <Navigation className="h-4 w-4" />
                          {t.openMap}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
            <Dumbbell className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="font-semibold text-slate-600">
              {t.noResults}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}