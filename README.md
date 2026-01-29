# 🎵 Enhanced Music Discovery Hub

A beautiful, feature-rich music discovery and streaming application built with Node.js, Express, and MongoDB.

## ✨ Features

### 🎧 Audio Player
- **Full Audio Playback**: Stream all 12 included songs directly in the browser
- **Visual Feedback**: Cards glow and animate when music is playing
- **Floating Music Notes**: Animated musical notes appear on playing tracks
- **Keyboard Controls**: 
  - `Space` - Play/Pause
  - `←/→` - Skip backward/forward 10 seconds
  - `↑/↓` - Volume control

### 🎨 Enhanced UI/UX
- **Responsive Design**: Works perfectly on desktop and mobile
- **Smooth Animations**: Hover effects, glow animations, and transitions
- **Loading States**: Visual feedback while audio loads
- **Error Handling**: Graceful handling of audio loading errors
- **Genre-based Browsing**: Filter music by genre with beautiful cards

### 🎵 Music Library
- **12 Pre-loaded Songs**: Diverse collection across multiple genres
- **Genre Categories**: Pop, Rock, Jazz, Classical, Electronic, Hip Hop
- **Detailed Metadata**: Artist, album, year, duration, rating, and description
- **Random Discovery**: Surprise yourself with random song suggestions

### 🔐 User Authentication
- **Secure Login/Register**: Session-based authentication
- **Protected Routes**: Music features require authentication
- **User Sessions**: Persistent login sessions

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/enhanced-music-app.git
   cd enhanced-music-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on `mongodb://127.0.0.1:27017/musicdb`

4. **Load sample songs**
   ```bash
   node addAudioFiles.js
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3002`

## 📁 Project Structure

```
enhanced-music-app/
├── controllers/           # Route controllers
│   ├── authController.js  # Authentication logic
│   └── musicController.js # Music CRUD operations
├── middleware/           # Custom middleware
│   └── auth.js          # Authentication middleware
├── models/              # MongoDB schemas
│   ├── Music.js         # Music model
│   └── User.js          # User model
├── public/              # Static assets
│   ├── js/
│   │   └── player.js    # Enhanced audio player
│   ├── songs/           # Audio files (12 songs)
│   └── style.css        # Enhanced styling
├── routes/              # Express routes
│   ├── authRoutes.js    # Authentication routes
│   └── musicRoutes.js   # Music routes
├── view/                # EJS templates
│   ├── index.ejs        # Main music library
│   ├── genre-suggestions.ejs
│   ├── random-suggestion.ejs
│   ├── add-music.ejs
│   ├── login.ejs
│   └── register.ejs
├── addAudioFiles.js     # Database seeding script
├── app.js               # Main application file
└── package.json         # Dependencies and scripts
```

## 🎵 Included Songs

The app comes with 12 carefully selected songs across various genres:

1. **Ateraxia** - Electronic
2. **Brother** - Rock
3. **Get Away** - Pop
4. **Highschool Funeral** - Rock
5. **Intro** - Electronic
6. **J5** - Hip Hop
7. **Manimal** - Rock
8. **Neruda** - Classical
9. **Scarwhores** - Rock
10. **Solitude** - Jazz
11. **Throne** - Electronic
12. **Victims of Chaos** - Rock

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templating, Vanilla JavaScript
- **Styling**: CSS3 with animations and gradients
- **Authentication**: Express-session
- **Audio**: HTML5 Audio API

## 🎨 Key Enhancements

### Audio Player Features
- **One-at-a-time playback**: Only one song plays at a time
- **Visual playing state**: Cards change appearance when playing
- **Keyboard shortcuts**: Full keyboard control
- **Error handling**: Graceful audio loading error handling
- **Loading indicators**: Visual feedback during audio loading

### UI/UX Improvements
- **Smooth animations**: Hover effects and transitions
- **Responsive design**: Mobile-friendly layout
- **Visual feedback**: Playing indicators and animations
- **Enhanced styling**: Modern gradient backgrounds and effects

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 3002)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://127.0.0.1:27017/musicdb)

### Session Configuration
Update the session secret in `app.js` for production:
```javascript
app.use(session({
  secret: 'your_secure_secret_key_here',
  resave: false,
  saveUninitialized: false
}))
```

## 🚀 Deployment

### Local Development
```bash
npm run dev  # If you have nodemon installed
# or
npm start
```

### Production
1. Set environment variables
2. Ensure MongoDB is accessible
3. Run `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Font Awesome for beautiful icons
- All the artists whose music makes this app come alive
- The open-source community for inspiration and tools

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/YOUR_USERNAME/enhanced-music-app/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide detailed information about your environment and the issue

---

**Enjoy discovering and streaming music with the Enhanced Music Discovery Hub! 🎵**