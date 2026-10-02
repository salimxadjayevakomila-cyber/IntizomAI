 'use client'

import { useState } from 'react'
import {
  Car,
  ChevronDown,
  ChevronUp,
  Coffee,
  Dumbbell,
  MapPin,
  Search,
  Star,
  Users,
  Waves,
  Wifi,
} from 'lucide-react'

import { useLanguage } from '@/contexts/language-context'

type Gym = {
  id: string
  name: string
  area: string
  address: string
  rating: number
  reviews: number
  facilities: { icon: typeof Waves; key: string }[]
  trainers: { name: string; specialtyKey: string; experienceYears: number }[]
}

const GYMS: Gym[] = [
  {
    id: 'befit',
    name: 'BeFit Gym',
    area: 'Mirzo Ulugbek',
    address: 'Amir Temur St 108, Tashkent',
    rating: 4.8,
    reviews: 312,
    facilities: [
      { icon: Dumbbell, key: 'gymFinder.facility.freeWeights' },
      { icon: Waves, key: 'gymFinder.facility.pool' },
      { icon: Coffee, key: 'gymFinder.facility.cafe' },
      { icon: Car, key: 'gymFinder.facility.parking' },
    ],
    trainers: [
      { name: 'Jasur Karimov', specialtyKey: 'gymFinder.specialty.strength', experienceYears: 8 },
      { name: 'Dilnoza Yusupova', specialtyKey: 'gymFinder.specialty.yoga', experienceYears: 6 },
    ],
  },
  {
    id: 'chekhov',
    name: 'Chekhov Fitness',
    area: 'Yakkasaray',
    address: 'Chekhov St 24, Tashkent',
    rating: 4.6,
    reviews: 198,
    facilities: [
      { icon: Dumbbell, key: 'gymFinder.facility.freeWeights' },
      { icon: Dumbbell, key: 'gymFinder.facility.crossfit' },
      { icon: Wifi, key: 'gymFinder.facility.wifi' },
    ],
    trainers: [
      { name: 'Otabek Rasulov', specialtyKey: 'gymFinder.specialty.crossfit', experienceYears: 5 },
      { name: 'Malika Ahmedova', specialtyKey: 'gymFinder.specialty.pilates', experienceYears: 4 },
      { name: 'Sardor Aliyev', specialtyKey: 'gymFinder.specialty.boxing', experienceYears: 7 },
    ],
  },
  {
    id: 'bekfit',
    name: 'Bek Fit Club',
    area: 'Chilonzor',
    address: 'Bunyodkor Ave 12, Tashkent',
    rating: 4.5,
    reviews: 156,
    facilities: [
      { icon: Dumbbell, key: 'gymFinder.facility.freeWeights' },
      { icon: Waves, key: 'gymFinder.facility.sauna' },
      { icon: Car, key: 'gymFinder.facility.parking' },
    ],
    trainers: [
      { name: 'Bekzod Tursunov', specialtyKey: 'gymFinder.specialty.bodybuilding', experienceYears: 10 },
      { name: 'Nigora Sultanova', specialtyKey: 'gymFinder.specialty.weightLoss', experienceYears: 5 },
    ],
  },
  {
    id: 'arena',
    name: 'Arena Fitness Center',
    area: 'Sergeli',
    address: 'Yangi Sergeli Rd 7, Tashkent',
    rating: 4.4,
    reviews: 89,
    facilities: [
      { icon: Dumbbell, key: 'gymFinder.facility.crossfit' },
      { icon: Wifi, key: 'gymFinder.facility.wifi' },
      { icon: Coffee, key: 'gymFinder.facility.cafe' },
    ],
    trainers: [
      { name: 'Timur Yuldashev', specialtyKey: 'gymFinder.specialty.functional', experienceYears: 6 },
    ],
  },
]

export default function GymFinder() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>('befit')

  const filtered = GYMS.filter(
    (g) =>
      g.name.toLowerCase().includes(query.toLowerCase()) ||
      g.area.toLowerCase().includes(query.toLowerCase()) ||
      g.address.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="mx-auto max-w-[1080px]">
      <div className="mb-7">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
          <Dumbbell className="size-3.5" /> {t('gymFinder.badge')}
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">
          {t('gymFinder.title')}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {t('gymFinder.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('gymFinder.searchPlaceholder')}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>

      {/* Gym list */}
      <div className="flex flex-col gap-4">
        {filtered.map((gym) => {
          const isOpen = expanded === gym.id
          return (
            <div
              key={gym.id}
              className="overflow-hidden rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] shadow-[0_0_30px_rgba(16,185,129,0.08)]"
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : gym.id)}
                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-800/30 sm:p-6"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                  <Dumbbell className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-white">{gym.name}</h3>
                    <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                      {gym.area}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" /> {gym.address}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-300">{gym.rating}</span>
                    <span className="text-xs text-slate-500">
                      ({gym.reviews} {t('gymFinder.reviews')})
                    </span>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="size-5 shrink-0 text-slate-500" />
                ) : (
                  <ChevronDown className="size-5 shrink-0 text-slate-500" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-slate-800 p-5 sm:p-6">
                  {/* Facilities */}
                  <div className="mb-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      {t('gymFinder.facilities')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {gym.facilities.map((f, idx) => {
                        const Icon = f.icon
                        return (
                          <span
                            key={`${f.key}-${idx}`}
                            className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300"
                          >
                            <Icon className="size-3.5 text-emerald-400" /> {t(f.key)}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {/* Trainers */}
                  <div>
                    <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      <Users className="size-3.5" /> {t('gymFinder.trainers')} ({gym.trainers.length})
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {gym.trainers.map((tItem) => (
                        <div
                          key={tItem.name}
                          className="flex items-center gap-3 rounded-xl bg-slate-800/40 p-4 transition hover:bg-slate-800/60"
                        >
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-sm font-semibold text-emerald-300">
                            {tItem.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">{tItem.name}</p>
                            <p className="mt-0.5 truncate text-xs text-slate-400">
                              {t(tItem.specialtyKey)}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-400">
                            {tItem.experienceYears} {t('gymFinder.exp')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
            &quot;{query}&quot; {t('gymFinder.notFound')}
          </div>
        )}
      </div>
    </div>
  )
}