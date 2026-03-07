# ScholarsKit AI

<div align="center">
  <img src="public/logo-white.svg" alt="ScholarsKit Logo" width="100"/>
  <p><strong>Your AI-powered study companion for smarter, faster learning and research</strong></p>
</div>

## 📖 Overview

ScholarsKit is an intelligent study platform that helps students and researchers analyze academic documents using AI. Upload PDFs, interact with an AI assistant (Athena AI), and get instant summaries, flashcards, and insights from your study materials.

## ✨ Features

- **📄 Smart Document Upload**: Drag-and-drop PDF upload with automatic processing
- **🤖 Athena AI Chat**: Interactive AI assistant powered by RAG (Retrieval-Augmented Generation)
- **💡 Quick Actions**:
  - Comprehensive document summaries
  - Key concept highlighting
  - Automatic flashcard generation
- **📚 File Management**: Organized library of all uploaded documents
- **🔐 Secure Authentication**: AWS Cognito integration with hosted UI
- **📱 Responsive Design**: Seamless experience across desktop and mobile devices
- **⚡ Real-time Processing**: Document chunking and embedding for context-aware responses
- **🎨 Modern UI**: Clean, intuitive interface built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks, Context API
- **Markdown Rendering**: ReactMarkdown with remark-gfm

### Backend & Infrastructure
- **Hosting**: AWS Amplify
- **Authentication**: AWS Cognito
- **Storage**: AWS S3 (document storage)
- **API**: AWS API Gateway + Lambda
- **Session Management**: Iron Session
- **Database**: AWS DynamoDB (file metadata)

### Key Libraries
- `iron-session` - Secure, stateless session management
- `react-toastify` - User notifications
- `lucide-react` - Icon system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- AWS Account with configured services:
  - Cognito User Pool
  - S3 Bucket
  - API Gateway
  - Lambda Functions
  - DynamoDB Table

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ammanabua/ScholarsKit.git
   cd ScholarsKit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Session Security
   SESSION_PASSWORD=your-32-character-minimum-secret-key

   # AWS Cognito
   COGNITO_REGION=us-east-1
   COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
   COGNITO_CLIENT_ID=your-cognito-client-id
   COGNITO_CLIENT_SECRET=your-cognito-client-secret
   COGNITO_HOSTED_UI_DOMAIN=your-app.auth.us-east-1.amazoncognito.com
   COGNITO_LOGOUT_REDIRECT_URI=http://localhost:3000/sign-in

   # API Gateway
   NEXT_PUBLIC_API_GATEWAY_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
scholars-kit/
├── src/
│   ├── app/
│   │   ├── (web)/                    # Public landing page
│   │   ├── (app)/
│   │   │   ├── (sign-in)/           # Authentication pages
│   │   │   └── (dashboard)/         # Protected dashboard routes
│   │   │       ├── api/             # API routes
│   │   │       ├── dashboard/       # Main dashboard
│   │   │       ├── files/           # File management
│   │   │       └── settings/        # User settings
│   │   ├── globals.css              # Global styles
│   │   └── layout.tsx               # Root layout
│   ├── components/
│   │   ├── layout/
│   │   │   └── SideNav.tsx          # Navigation sidebar
│   │   └── shared/
│   │       ├── AiChat.tsx           # AI chat interface
│   │       ├── DocumentViewer.tsx   # PDF viewer
│   │       └── GeneralLoader.tsx    # Loading component
│   ├── hooks/
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useCurrentDocument.ts    # Current document state
│   │   └── useUserFiles.ts          # File management hook
│   ├── interfaces/                   # TypeScript interfaces
│   ├── lib/
│   │   ├── cognito.ts               # Cognito utilities
│   │   └── session.ts               # Session configuration
│   ├── providers/
│   │   └── AuthProvider.tsx         # Authentication context
│   └── middleware.ts                 # Route protection
├── public/                           # Static assets
├── .env.local                        # Environment variables (gitignored)
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
└── tsconfig.json                     # TypeScript configuration
```

## 🔒 Authentication Flow

1. User clicks "Sign In" → Redirected to Cognito Hosted UI
2. After successful authentication → Cognito redirects to `/api/auth/callback`
3. Callback exchanges authorization code for tokens
4. Session created with Iron Session (encrypted cookie)
5. User redirected to dashboard
6. Middleware protects routes and validates session on each request

## 💾 File Upload & Processing

1. User uploads PDF (max 3MB)
2. File converted to base64 and sent to API Gateway
3. Lambda function:
   - Stores PDF in S3
   - Extracts text content
   - Chunks text for embeddings
   - Stores metadata in DynamoDB
4. Signed URL returned for immediate viewing
5. File indexed for AI chat queries

## 🤖 AI Chat Features

- **Conversation History**: Messages persist across sessions
- **Context-Aware**: RAG retrieves relevant document chunks
- **Real-time Responses**: Streaming support for long answers
- **Document Processing**: Handles 409 status for documents still being embedded
- **Markdown Support**: Rich formatting in responses

## 🚢 Deployment

### AWS Amplify

1. **Connect your repository** to AWS Amplify
2. **Set environment variables** in Amplify Console:
   - All variables from `.env.local`
   - Ensure `SESSION_PASSWORD` is set
3. **Configure build settings** (auto-detected for Next.js)
4. **Deploy** - Amplify handles CI/CD automatically

### Build Command
```bash
npm run build
```

### Environment Variables Required in Production
- `SESSION_PASSWORD`
- `COGNITO_REGION`
- `COGNITO_USER_POOL_ID`
- `COGNITO_CLIENT_ID`
- `COGNITO_CLIENT_SECRET`
- `COGNITO_HOSTED_UI_DOMAIN`
- `COGNITO_LOGOUT_REDIRECT_URI`
- `NEXT_PUBLIC_API_GATEWAY_URL`

## 🔐 Security Features

- **Secure Sessions**: Iron Session with encrypted cookies
- **Route Protection**: Middleware guards all protected routes
- **Client-Side Checks**: AuthProvider validates session state
- **Cache Prevention**: No-cache headers prevent stale pages
- **URL Expiration**: Signed URLs expire after 1 hour
- **CORS Protection**: API Gateway configured with proper CORS

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation, expanded AI chat panel
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation bar, slide-out AI chat

## 🎯 Features In Detail

### Document Viewer
- Full-screen PDF display
- Drag-and-drop upload overlay
- Upload progress indicators
- Error handling with user feedback
- Auto-mount on URL expiration

### AI Chat (Athena AI)
- Context-aware responses using RAG
- Quick actions for common tasks
- Message history persistence
- Auto-scroll to latest message
- Markdown rendering
- Source citations (configurable)

### File Management
- Grid view with thumbnails
- Hover actions (view, download)
- File metadata (size, upload date)
- Delete with confirmation
- Sort by most recent
- Responsive grid layout

## 🐛 Known Issues & Solutions

- **Back button after logout**: Client-side auth check in layout handles this
- **Signed URL expiration**: Auto-unmount after 1 hour
- **Mobile hover states**: Touch-friendly overlays on mobile
- **Scroll issues**: Proper overflow containment in all layouts

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Amman Abua**
- GitHub: [@ammanabua](https://github.com/ammanabua)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- AWS for robust cloud infrastructure
- Lucide for beautiful icons
- The open-source community

---

<div align="center">
  <p>Made with ❤️ for students and researchers everywhere</p>
  <p>© 2026 ScholarsKit<sup>&trade;</sup>. All rights reserved.</p>
</div>
