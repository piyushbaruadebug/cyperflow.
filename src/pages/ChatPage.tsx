import { useEffect, useRef, useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { SUGGESTED_PROMPTS } from '../lib/colors'
import { useApp } from '../store/appContext'
import type { ChatMessage } from '../types'

const GREETING: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your Financial Assistant. Ask me about your spending, budget status, financial trends, or savings tips!",
}

export function ChatPage() {
  const { user } = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api
      .listChat()
      .then(setMessages)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load chat history'))
  }, [user])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = async (text: string) => {
    const question = text.trim()
    if (!question || thinking) return

    setMessages((prev) => [...prev, { id: `local-${Date.now()}`, role: 'user', content: question }])
    setInput('')
    setThinking(true)
    setError('')

    try {
      const reply = await api.sendChat(question)
      setMessages((prev) => [...prev, reply])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The assistant is unavailable')
    } finally {
      setThinking(false)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void send(input)
  }

  const visible = messages.length > 0 ? messages : [GREETING]

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-apex-ink">Financial Assistant</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Active Assistant
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Get instant insights grounded directly in your personal financial transaction data.
          </p>
        </div>
      </header>

      <div className="card-static flex h-[68vh] flex-col p-0 overflow-hidden border border-black/[0.08] bg-white shadow-xl">
        {/* Messages Feed */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6 bg-slate-50/50">
          {visible.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200 ${
                  message.role === 'user'
                    ? 'rounded-br-sm bg-apex-ink text-white'
                    : 'rounded-bl-sm border border-black/[0.08] bg-white text-apex-ink shadow-sm'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-apex-blue">
                    <svg className="h-4 w-4 text-apex-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Pennywise Assistant
                  </div>
                )}
                {message.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-5 py-3 text-sm text-slate-500 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-xs">Analyzing financial database…</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input & Suggested Prompts Box */}
        <div className="border-t border-slate-200 bg-white p-5">
          {error && <p className="mb-3 text-sm text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">{error}</p>}

          <div className="mb-3.5 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:-translate-y-0.5"
                onClick={() => void send(prompt)}
              >
                💡 {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              className="input text-base"
              placeholder="Ask anything about your expenses or budget…"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              aria-label="Message"
            />
            <button type="submit" className="btn-primary min-w-[100px]" disabled={thinking || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
