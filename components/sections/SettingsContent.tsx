 'use client'

import { Language, t } from '@/lib/translations'

interface SettingsProps {
  lang: Language
  setLang: (lang: Language) => void
  onLogout?: () => void
}

export default function SettingsContent({ lang, setLang, onLogout }: SettingsProps) {
  const trans = t[lang]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">{trans.settings}</h1>
        <p className="text-sm text-slate-400 mt-1">{trans.selectLanguageDesc}</p>
      </div>

      {/* Tilni tanlash bloki */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">{trans.selectLanguage}</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setLang('uz')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition ${
              lang === 'uz'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
            }`}
          >
            🇺🇿 O'zbekcha
          </button>
          <button
            onClick={() => setLang('ru')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition ${
              lang === 'ru'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
            }`}
          >
            🇷🇺 Русский
          </button>
          <button
            onClick={() => setLang('en')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition ${
              lang === 'en'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* Chiqish tugmasi */}
      {onLogout && (
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm font-semibold hover:bg-rose-500/20 transition"
          >
            {trans.logout}
          </button>
        </div>
      )}
    </div>
  )
}