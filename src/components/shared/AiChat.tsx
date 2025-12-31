'use client'
import { FileText, Lightbulb, MessageCircle, Send, X, Zap } from 'lucide-react';
import { useState } from 'react'
import Image from 'next/image';

interface AiChatProps {
  hasDocument?: boolean;
}

const AiChat = ({ hasDocument = false }: AiChatProps) => {
  const [isOpen, setIsOpen] = useState(true);

  interface Message {
    type: 'system' | 'user';
    content: string;
    timestamp: string;
  }

  interface QuickAction {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: 'How can I assist you with this document?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  
  const quickActions = [
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
  ];

  const handleQuickAction = (action: QuickAction) => {
    const newMessage: Message = {
      type: 'user',
      content: action.title,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage = {
        type: 'user',
        content: chatInput,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([...messages, newMessage]);
      setChatInput('');
    }
  };

  // No document state - show disabled icon
  if (!hasDocument) {
    return (
      <>
        {/* Desktop - collapsed icon bar */}
        <div className="hidden md:flex flex-shrink-0 h-full w-16 bg-white border-l border-gray-200 flex-col items-center py-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 rounded-full bg-gray-100 text-gray-400" title="Upload a document to chat with Athena AI">
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
      <div className={`hidden md:flex flex-shrink-0 h-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'w-96' : 'w-16'}`}>
        {/* Collapsed state - toggle button */}
        <div 
          className={`
            h-full w-16 bg-white border-l border-gray-200 
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
            w-96 h-full bg-white border-l border-gray-200 
            flex flex-col flex-shrink-0 overflow-hidden
            ${isOpen ? 'block' : 'hidden'}
          `}
        >
          {/* Summary Section */}
          <div className="border-b border-gray-200 p-6">
            <div className='flex gap-4 items-center mb-4 justify-between'>
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
            
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <action.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-900">
                        {action.title}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col relative pb-20">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input - Fixed at bottom of screen */}
            <div className="fixed bottom-0 right-0 w-96 p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Enter a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      {/* Floating toggle button (above bottom nav) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed bottom-24 right-4 z-40 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-gray-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title={isOpen ? 'Close Athena AI' : 'Open Athena AI'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Mobile overlay panel */}
      <div 
        className={`
          md:hidden fixed inset-0 z-30 transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/30"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Panel sliding from right */}
        <div 
          className={`
            absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl
            flex flex-col transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* Header */}
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

          {/* Quick Actions */}
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

          {/* Chat Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Enter a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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

export default AiChat