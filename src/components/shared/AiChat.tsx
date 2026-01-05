'use client'
import { FileText, Lightbulb, Send, X, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react'
import { AiChatProps, ConversationHistoryItem, Message, QuickAction } from '@/interfaces/AiChat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';



const API_BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function uid() {
  return crypto.randomUUID?.() ?? String(Date.now() + Math.random());
}

const AiChat = ({ hasDocument = false, userId, fileId }: AiChatProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      type: 'system',
      content: 'How can I assist you with this document?',
      timestamp: nowTime(),
      status: "done"
    }
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const quickActions: QuickAction[] = useMemo(() => ([
    {
      id: 'summarize',
      title: 'Summarize this document',
      icon: FileText,
      description: 'Get a comprehensive summary of the document'
    },
    {
      id: 'highlight',
      title: 'Highlight main points',
      icon: Lightbulb,
      description: 'Extract and highlight key concepts'
    },
    {
      id: 'flashcards',
      title: 'Generate flashcards',
      icon: Zap,
      description: 'Create study flashcards from content'
    }
  ]), []);

  useEffect(() => {
    // auto-scroll on new messages
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // OPTIONAL: load conversation history when panel opens (and doc exists)
  useEffect(() => {
    if (!hasDocument || !isOpen) return;
    if (!userId || !fileId) return;
    if (!API_BASE) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/${userId}/${fileId}/conversation/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, fileId, limit: 30 })
        });

        if (!res.ok) {
          if (res.status === 409) {
            const data = await res.json();
            throw new Error(
              `Preparing document… (${data.embeddedChunkCount || 0}/${data.chunkCount || "?"})`
            );
          }
          throw new Error(await res.text());
        }

        const data = await res.json();

        // Expecting: { items: [{ role, content, ts, sources }] }
        const items = Array.isArray(data?.items) ? data.items : [];
        if (cancelled) return;

        if (items.length > 0) {
          const mapped: Message[] = items.map((it: ConversationHistoryItem) => ({
            id: uid(),
            type: it.role === "assistant" ? "assistant" : it.role === "system" ? "system" : "user",
            content: String(it.content ?? ""),
            timestamp: it.ts ? new Date(it.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : nowTime(),
            status: "done",
            sources: Array.isArray(it.sources) ? it.sources : []
          }));

          // Replace current system seed with history + keep initial system message if you want:
          setMessages(prev => {
            // keep first system message if no history contains it
            const seed = prev.length === 1 ? prev : prev.slice(0, 1);
            return [...seed, ...mapped];
          });
        }
      } catch {
        // ignore
      }
    })();

    return () => { cancelled = true; };
  }, [hasDocument, isOpen, userId, fileId]);

  const handleQuickAction = async (action: QuickAction) => {
    await sendMessage(action.title);
  };

  const handleSendMessage = async () => {
    await sendMessage(chatInput);
  };

  async function sendMessage(text: string) {
    const question = text.trim();
    if (!question) return;

    if (!hasDocument || !userId || !fileId) {
      // fallback UI behavior
      setMessages(prev => ([
        ...prev,
        { id: uid(), type: "user", content: question, timestamp: nowTime(), status: "done" },
        {
          id: uid(),
          type: "system",
          content: "Upload/select a document first so I can answer using its content.",
          timestamp: nowTime(),
          status: "done"
        }
      ]));
      setChatInput('');
      return;
    }

    if (!API_BASE) {
      setMessages(prev => ([
        ...prev,
        { id: uid(), type: "user", content: question, timestamp: nowTime(), status: "done" },
        {
          id: uid(),
          type: "system",
          content: "Missing NEXT_PUBLIC_API_BASE_URL. Set it in Amplify environment variables.",
          timestamp: nowTime(),
          status: "error"
        }
      ]));
      setChatInput('');
      return;
    }

    // 1) Add user message
    const userMsgId = uid();
    setMessages(prev => ([
      ...prev,
      { id: userMsgId, type: "user", content: question, timestamp: nowTime(), status: "done" }
    ]));
    setChatInput('');

    // 2) Add assistant placeholder
    const assistantMsgId = uid();
    setMessages(prev => ([
      ...prev,
      { id: assistantMsgId, type: "assistant", content: "Thinking…", timestamp: nowTime(), status: "thinking" }
    ]));

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/${userId}/${fileId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, fileId, question, topK: 5, lastTurns: 8 })
      });

      // ✅ Handle processing
      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        const done = Number(data.embeddedChunkCount ?? 0);
        const total = Number(data.chunkCount ?? 0);

        // Update placeholder to progress
        setMessages(prev => prev.map(m => {
          if (m.id !== assistantMsgId) return m;
          return {
            ...m,
            content: total
              ? `Preparing your document… (${done}/${total})\nTry again in a moment.`
              : `Preparing your document…\nTry again in a moment.`,
            status: "thinking"
          };
        }));

        // ✅ Optional: auto-retry loop (lightweight)
        // poll a few times to avoid users needing to resend
        let attempts = 0;
        while (attempts < 6) {
          await new Promise(r => setTimeout(r, 2500));
          attempts++;

          const retry = await fetch(`${API_BASE}/${userId}/${fileId}/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, fileId, question, topK: 5, lastTurns: 8 })
          });

          if (retry.status === 409) {
            const prog = await retry.json().catch(() => ({}));
            const d = Number(prog.embeddedChunkCount ?? 0);
            const t = Number(prog.chunkCount ?? 0);

            setMessages(prev => prev.map(m => {
              if (m.id !== assistantMsgId) return m;
              return {
                ...m,
                content: t
                  ? `Preparing your document… (${d}/${t})`
                  : `Preparing your document…`,
                status: "thinking"
              };
            }));
            continue;
          }

          if (!retry.ok) {
            const txt = await retry.text();
            throw new Error(txt || "Request failed");
          }

          const data2 = await retry.json();
          const answer2 = String(data2?.answer ?? "");
          const sources2 = Array.isArray(data2?.sources) ? data2.sources : [];

          setMessages(prev => prev.map(m => {
            if (m.id !== assistantMsgId) return m;
            return { ...m, content: answer2 || "No answer returned.", status: "done", sources: sources2 };
          }));

          return; // ✅ success
        }

        // If retries exhausted
        setMessages(prev => prev.map(m => {
          if (m.id !== assistantMsgId) return m;
          return { ...m, content: "Still preparing the document. Please try again in a minute.", status: "done" };
        }));
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Request failed");
      }

      const data = await res.json();
      const answer = String(data?.answer ?? "");
      const sources = Array.isArray(data?.sources) ? data.sources : [];

      setMessages(prev => prev.map(m => {
        if (m.id !== assistantMsgId) return m;
        return {
          ...m,
          content: answer || "I couldn’t generate an answer from the available context.",
          status: "done",
          sources
        };
      }));
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setMessages(prev => prev.map(m => {
        if (m.id !== assistantMsgId) return m;
        return {
          ...m,
          content: `Sorry — I ran into an error. ${errorMessage}`,
          status: "error"
        };
      }));
    } finally {
      setIsLoading(false);
    }
  }

  // No document state - show disabled icon
  if (!hasDocument) {
    return (
      <>
        {/* Desktop - collapsed icon bar */}
        <div className="hidden md:flex flex-shrink-0 h-screen w-16 bg-white border-l border-gray-200 flex-col items-center py-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 rounded-full bg-blue-100 text-gray-400" title="Upload a document to chat with Athena AI">
              <Image src="/ai.png" alt="Athena AI" width={24} height={24} className="opacity-50" />
            </div>
            <span className="text-xs text-gray-400 text-center px-2">Upload a Document</span>
          </div>
        </div>

        {/* Mobile - floating icon button (above bottom nav) */}
        <div className="md:hidden fixed bottom-24 right-4 z-40">
          <div className="p-3 rounded-full bg-gray-200 text-gray-400 shadow-lg" title="Upload a document to chat with Athena AI">
            <Image src="/ai.png" alt="Athena AI" width={24} height={24} className="opacity-50" />
          </div>
        </div>
      </>
    );
  }

  // Has document - show toggle button and panel
  return (
    <>
      {/* Desktop Layout */}
      <div className={`hidden md:flex flex-shrink-0 h-screen overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'w-96' : 'w-16'}`}>
        {/* Collapsed state - toggle button */}
        <div
          className={`
            h-screen w-16 bg-white border-l border-gray-200
            flex flex-col items-center py-6
            transition-all duration-500 ease-in-out cursor-pointer
            ${isOpen ? 'hidden' : 'flex'}
          `}
          onClick={() => setIsOpen(true)}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="Open Athena AI Chat">
              <Image src="/ai.png" alt="Athena AI" width={24} height={24} className="opacity-50" />
            </div>
            <span className="text-xs text-blue-600 text-center px-2">Athena AI</span>
          </div>
        </div>

        {/* Expanded state - full panel */}
        <div
          className={`
            w-96 h-screen bg-white border-l border-gray-200
            flex flex-col flex-shrink-0 overflow-hidden
            ${isOpen ? 'flex' : 'hidden'}
          `}
        >
          {/* Summary Section */}
          <div className="border-b border-gray-200 p-6 flex-shrink-0">
            <div className='flex gap-4 items-center mb-4 justify-between'>
              <h3 className="text-md font-normal text-gray-900">Quick Actions</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="w-full text-left p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <action.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-900">
                        {action.title}
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-blue-700">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div className='flex gap-4 items-center'>
                <Image src="/owl.png" alt="Athena AI Logo" width={32} height={32} />
                <h2 className="text-xl font-semibold text-gray-900">Athena AI</h2>
              </div>
              {isLoading && <span className="text-xs text-gray-500 animate-pulse">Thinking…</span>}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.status === "error"
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Chat Input - desktop */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Enter a message..."
                  className="flex-1 px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-60 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {/* <div className="mt-2 text-[11px] text-gray-500">
                Using document context • {userId?.slice(0, 6)}… / {fileId?.slice(0, 6)}…
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed bottom-24 right-4 z-40 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-gray-600 text-white' : 'bg-blue-400 text-white hover:bg-blue-600'
        }`}
        title={isOpen ? 'Close Athena AI' : 'Open Athena AI'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Image src="/ai.png" alt="Athena AI" width={24} height={24} className="" />}
      </button>

      <div
        className={`
          md:hidden fixed inset-0 z-30 transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`
            absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl
            flex flex-col transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="border-b border-gray-200 p-4">
            <div className='flex gap-4 items-center justify-between'>
              <div className='flex gap-4 items-center'>
                <Image src="/owl.png" alt="Athena AI Logo" width={32} height={32} />
                <h2 className="text-xl font-semibold text-gray-900">Athena AI</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 p-4">
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    <span className="font-medium text-gray-900 group-hover:text-blue-900">
                      {action.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
              {isLoading && <span className="text-xs text-gray-500 animate-pulse">Thinking…</span>}
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.status === "error"
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {/* {message.type === "assistant" && message.sources?.length ? (
                      <div className="mt-2 text-xs opacity-80">
                        Sources:{" "}
                        {message.sources.slice(0, 6).map((s, i) => (
                          <span key={`${s.chunkIndex}-${i}`} className="mr-2">
                            [{s.chunkIndex}]
                          </span>
                        ))}
                      </div>
                    ) : null} */}

                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Enter a message..."
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-60 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AiChat;
