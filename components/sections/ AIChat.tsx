 'use client'

import { useRef, useState, useEffect } from 'react'
import { Bot, Send, Sparkles, User } from 'lucide-react'

interface Message {
  id: number
  role: 'user' | 'ai'
  text: string
}

const SUGGESTIONS = [
  'How much water should I drink daily?',
  'Best post-workout meal for muscle gain?',
  'I ate 2200 kcal today, is that too much?',
  'Suggest a low-carb Uzbek dinner',
]

const AI_RESPONSES: { match: RegExp; reply: string }[] = [
  { match: /water|hydrat/i, reply: 'For your weight and activity level, aim for about 2.5L of water per day. If you exercise intensely, bump that to 3L. A simple trick: keep a reusable bottle visible at your desk — you\'ll drink more without thinking about it.' },
  { match: /post.?workout|muscle|protein/i, reply: 'A great post-workout meal balances protein and carbs. Try grilled chicken breast (40g protein) with brown rice and a side of vegetables. Eat within 30–60 minutes after training for optimal recovery.' },
  { match: /2200|too much|overeat|exceed/i, reply: '2200 kcal is only slightly above your 2000 target — that\'s totally fine on an active day. What matters is the weekly average. If you hit your protein and step goals, a 200 kcal surplus won\'t derail progress.' },
  { match: /low.?carb|uzbek|dinner/i, reply: 'Here\'s a low-carb Uzbek-inspired dinner: grilled lamb skewers (shashlik) with a large tomato-cucumber-onion salad (achichuk), dressed with olive oil and vinegar. Skip the bread and rice — you\'ll get ~450 kcal with 42g protein and under 15g carbs.' },
  { match: /fast|intermittent/i, reply: 'A 14:10 fasting window (eating 10am–8pm) is a gentle starting point. Finish dinner by 8 PM, skip breakfast, and break your fast with a protein-rich meal. Stay hydrated with water and unsweetened tea during the fasting window.' },
]

function generateReply(input: string): string {
  const found = AI_RESPONSES.find((r) => r.match.test(input))
  if (found) return found.reply
  return 'Great question! Based on your current goals (2,000 kcal, 10,000 steps), I\'d recommend focusing on consistency first. Try to log every meal this week and hit your step goal at least 5 days. Small, repeatable habits beat perfect plans. What specific area would you like to dig into?'
}

let msgId = 0

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: msgId++, role: 'ai', text: 'Salom! I\'m your INTIZOM AI health assistant. Ask me about nutrition, calories, workouts, or healthy habits. How can I help today?' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return
    setMessages((prev) => [...prev, { id: msgId++, role: 'user', text: trimmed }])
    setInput('')
    setIsTyping(true)
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: msgId++, role: 'ai', text: generateReply(trimmed) }])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="mx-auto max-w-[820px]">
      <div className="mb-7">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
          <Bot className="size-3.5" /> AI Assistant
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[38px]">AI Health Chat</h1>
        <p className="mt-2 text-sm text-slate-400">Ask about nutrition, fitness, and healthy habits.</p>
      </div>

      <div className="flex flex-col rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-[#0f241d] to-[#0b1a15] shadow-[0_0_30px_rgba(16,185,129,0.08)]">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 sm:p-6" style={{ maxHeight: '460px', minHeight: '320px' }}>
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${msg.role === 'ai' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-sky-400/15 text-sky-300'}`}>
                  {msg.role === 'ai' ? <Bot className="size-5" /> : <User className="size-5" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${msg.role === 'ai' ? 'rounded-tl-sm bg-slate-800/60 text-slate-200' : 'rounded-tr-sm bg-emerald-400/15 text-emerald-50'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                  <Bot className="size-5" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-slate-800/60 px-4 py-3.5">
                  <span className="size-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: '0ms' }} />
                  <span className="size-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: '150ms' }} />
                  <span className="size-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="border-t border-slate-800 px-5 py-4 sm:px-6">
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Sparkles className="size-3.5 text-emerald-400" /> Try asking
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-slate-700 bg-slate-800/40 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-800 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) send(input) }}
              placeholder="Type your health question..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || isTyping}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 shadow-[0_0_16px_rgba(52,211,153,0.25)] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}