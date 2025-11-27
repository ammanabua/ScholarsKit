'use client '
import { FileText, Lightbulb, Send, Zap } from 'lucide-react';
import { useState } from 'react'

const AiChat = () => {


  interface Message {
    type: 'system' | 'user';
    content: string;
    timestamp: string;
  }

//   interface NavItem {
//     id: string;
//     label: string;
//     icon: React.ComponentType<{ className?: string }>;
//     hasSubmenu?: boolean;
//   }

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


  return (
    <>
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col wrap">
        {/* Summary Section */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
          
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
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-scroll">
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

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
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
    </>
  )
}

export default AiChat