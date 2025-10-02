# SheetMailEngine 📧

A powerful email campaign management system with Google Sheets integration built with React, TypeScript, Express, and SendGrid.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/SheetMailEngine)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/SheetMailEngine)

## ✨ Features

- 📧 **Email Campaign Management** - Create, manage, and send email campaigns
- 📊 **Real-time Analytics** - Track open rates, click rates, and engagement
- 📋 **Google Sheets Integration** - Import contacts directly from Google Sheets
- 🎨 **Rich Text Editor** - Beautiful email composition with formatting
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- ⚡ **Fast & Modern** - Built with Vite, React, and TypeScript
- 🔒 **Secure** - Environment-based configuration for API keys
- 🚀 **Easy Deployment** - One-click deploy to Vercel or Netlify

## 📸 Screenshots

[Add screenshots here]

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- SendGrid account (for email sending)
- Google Sheets API key (for sheets integration)
- PostgreSQL database (optional - uses in-memory storage by default)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/SheetMailEngine.git
cd SheetMailEngine
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
```bash
cp .env.example .env
```

4. **Edit `.env` with your configuration:**
```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
DATABASE_URL=postgresql://... (optional)
NODE_ENV=development
PORT=5000
```

### Development

**Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and configurations
├── server/              # Express backend
│   ├── services/        # External service integrations
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage layer
│   └── index.ts         # Server entry point
├── shared/              # Shared types and schemas
└── migrations/          # Database migrations (if using PostgreSQL)
```

## API Endpoints

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns/:id` - Get campaign details
- `PATCH /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/send` - Send campaign emails

### Contacts
- `GET /api/contacts` - List all contacts
- `POST /api/contacts` - Create a new contact

### Google Sheets
- `GET /api/sheets/:spreadsheetId` - Get sheet data
- `GET /api/sheets/:spreadsheetId/info` - Get spreadsheet info
- `POST /api/sheets/:spreadsheetId/import` - Import contacts from sheet

### Email Templates
- `GET /api/templates` - List all templates
- `POST /api/templates` - Create a new template

### Statistics
- `GET /api/stats` - Get campaign statistics

## Environment Variables

| Variable | Description | Required | Where to Get |
|----------|-------------|----------|--------------|
| `PORT` | Server port (default: 5000) | No | - |
| `NODE_ENV` | Environment mode | No | `development` or `production` |
| `SENDGRID_API_KEY` | SendGrid API key for emails | Yes | [SendGrid Dashboard](https://app.sendgrid.com/settings/api_keys) |
| `GOOGLE_SHEETS_API_KEY` | Google Sheets API key | Yes | [Google Console](https://console.cloud.google.com/apis/credentials) |
| `DATABASE_URL` | PostgreSQL connection string | No | [Neon](https://neon.tech) / [Supabase](https://supabase.com) |

**Required for full functionality*

## 🚀 Deployment

### Quick Deploy

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Detailed Deployment Guides

- 📖 [Complete Deployment Guide](DEPLOYMENT_GUIDE.md) - Full step-by-step instructions
- ⚡ [Quick Deploy Commands](QUICK_DEPLOY.md) - Fast deployment reference

### Important Files for Deployment

- ✅ `.gitignore` - Excludes sensitive files
- ✅ `.env.example` - Environment variable template
- ✅ `vercel.json` - Vercel configuration
- ✅ `netlify.toml` - Netlify configuration

**Remember to add environment variables in your hosting dashboard!**

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - How to deploy to Vercel/Netlify
- [Quick Deploy](QUICK_DEPLOY.md) - Fast deployment commands
- [SendGrid Setup](SENDGRID_SENDER_IDENTITY_FIX.md) - Email sending configuration

## Development Features

- ⚡ Hot module replacement with Vite
- 🔷 TypeScript support with strict type checking
- 📝 ESLint and Prettier configuration
- 🔥 Automatic error handling and logging
- 💾 In-memory storage for development (no database required)
- 📧 Email simulation when SendGrid is not configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checks: `npm run check`
5. Build the project: `npm run build`
6. Submit a pull request

## License

MIT