# Music Discovery Hub

A modern music recommendation system built with Node.js, Express, and MongoDB using the MVC (Model-View-Controller) architecture pattern.

## Features

- **User Authentication**: Secure registration and login system with password hashing
- **Music Management**: Add, view, and manage music tracks with detailed information
- **Genre-based Browsing**: Filter music by different genres (Pop, Rock, Jazz, Classical, Electronic, Hip Hop)
- **Random Suggestions**: Get random music recommendations for discovery
- **Responsive Design**: Modern, mobile-friendly interface with beautiful animations
- **Rating System**: Rate music tracks from 1-10
- **Session Management**: Secure user sessions with proper authentication middleware

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Template Engine**: EJS (Embedded JavaScript)
- **Authentication**: bcrypt for password hashing, express-session for session management
- **Frontend**: HTML5, CSS3, Font Awesome icons
- **Architecture**: MVC (Model-View-Controller) pattern

## Project Structure

```
Music_Recommendation-main/
├── controllers/
│   ├── authController.js      # Authentication logic
│   └── musicController.js     # Music management logic
├── middleware/
│   └── auth.js               # Authentication middleware
├── models/
│   ├── Music.js              # Music data model
│   └── User.js               # User data model
├── public/
│   └── style.css             # Stylesheets
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   └── musicRoutes.js        # Music routes
├── views/
│   ├── add-music.ejs         # Add music form
│   ├── error.ejs             # Error page
│   ├── genre-suggestions.ejs # Genre-specific music
│   ├── index.ejs             # Main dashboard
│   ├── login.ejs             # Login form
│   ├── random-suggestion.ejs # Random music suggestion
│   └── register.ejs          # Registration form
├── app.js                    # Main application file
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Music_Recommendation-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Install MongoDB on your system
   - Start MongoDB service
   - The application will connect to `mongodb://127.0.0.1:27017/musicdb`

4. **Run the application**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## Usage

### Getting Started
1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Add Music**: Start building your music library by adding tracks
4. **Explore**: Browse by genre or get random suggestions

### Adding Music
Fill in the following information when adding a new track:
- **Title**: Song name
- **Artist**: Performer or band name
- **Album**: Album name
- **Genre**: Music category
- **Year**: Release year
- **Duration**: Song length (e.g., "3:45")
- **Rating**: Your rating (1-10)
- **Description**: Brief description or review

### Browsing Music
- **Home**: View all music tracks in your library
- **Genre Filter**: Click on genre cards to filter by specific genres
- **Random**: Get surprise music recommendations
- **Search**: Browse through your collection

## API Routes

### Authentication Routes (`/auth`)
- `GET /auth/register` - Registration form
- `POST /auth/register` - Create new user
- `GET /auth/login` - Login form
- `POST /auth/login` - Authenticate user
- `GET /auth/logout` - Logout user

### Music Routes (`/music`)
- `GET /music` - View all music (protected)
- `GET /music/add` - Add music form (protected)
- `POST /music/add` - Create new music entry (protected)
- `GET /music/genre/:genre` - Filter by genre (protected)
- `GET /music/random` - Random suggestion (protected)

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed)
}
```

### Music Model
```javascript
{
  title: String (required),
  artist: String (required),
  album: String (required),
  genre: String (required),
  year: Number (required),
  duration: String (required),
  rating: Number (1-10),
  description: String (required),
  timestamps: true
}
```

## Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **Session Management**: Secure session handling with express-session
- **Route Protection**: Authentication middleware protects music routes
- **Input Validation**: Form validation on both client and server side
- **XSS Protection**: EJS template engine with proper escaping

## Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn package manager

### Development Scripts
```bash
npm run dev    # Start with nodemon for auto-restart
npm start      # Start in production mode
```

### Environment Variables
Create a `.env` file for production:
```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/musicdb
SESSION_SECRET=your_secret_key_here
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- **Music Streaming**: Integration with music streaming APIs
- **Social Features**: User profiles, following, and sharing
- **Advanced Search**: Full-text search and filtering options
- **Playlists**: Create and manage custom playlists
- **Recommendations**: AI-powered music recommendations
- **Mobile App**: React Native or Flutter mobile application
- **Music Upload**: Allow users to upload their own music files
- **Reviews**: User reviews and comments system

## Support

For support, email support@musicdiscoveryhub.com or create an issue in the repository.

---

**Music Discovery Hub** - Find your rhythm! 🎵