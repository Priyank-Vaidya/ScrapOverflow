# Q&A Search Engine

A powerful MERN stack application that aggregates and displays Q&A content from Stack Overflow and Reddit, with advanced features like result filtering, email sharing, and translation capabilities.


## 🌟 Features

- **Multi-Platform Search**: Fetch results from Stack Overflow and Reddit simultaneously
- **Advanced Filtering**: Sort and filter results by relevance, date, and popularity
- **Email Sharing**: Share search results via email
- **Result Caching**: MongoDB-based caching for faster repeated searches
- **Translation Support**: Translate results to multiple languages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **No Authentication Required**: Open access for all users

## 🛠️ Tech Stack

### Frontend
- React.js 18
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Redis (optional, for caching)

### APIs Used
- Stack Exchange API
- Reddit API
- Google Translate API (optional)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB
- npm or yarn
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/qa-search-engine.git
   cd qa-search-engine
   ```

2. **Set up environment variables**
   
   Create `.env` files in both frontend and backend directories:

   Backend (.env):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/qa-search
   STACK_EXCHANGE_KEY=your_stackexchange_api_key
   REDDIT_CLIENT_ID=your_reddit_client_id
   REDDIT_CLIENT_SECRET=your_reddit_client_secret
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

   Frontend (.env):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Install dependencies**

   Backend:
   ```bash
   cd backend
   npm install
   ```

   Frontend:
   ```bash
   cd frontend
   npm install
   ```

4. **Start the application**

   Backend:
   ```bash
   npm run dev
   ```

   Frontend:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🔧 Configuration

### API Keys Setup

1. **Stack Exchange API**
   - Visit [Stack Apps](https://stackapps.com/)
   - Register your application
   - Get your API key

2. **Reddit API**
   - Visit [Reddit Apps](https://www.reddit.com/prefs/apps)
   - Create a new application
   - Get your client ID and secret

3. **Email Service**
   - Enable 2-factor authentication in your Gmail account
   - Generate an app password
   - Use these credentials in your .env file
