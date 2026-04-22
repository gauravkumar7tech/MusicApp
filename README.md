# Music Discovery Hub

A modern web application for managing and discovering music with audio playback, genre filtering, and dark mode support.

## Features

- 🎵 Add and manage music tracks with audio file uploads
- 🎧 Built-in audio player for each track
- 🎨 Dark/Light theme toggle
- 🔍 Browse music by genre
- 🎲 Random music suggestion
- 📱 Responsive design
- 🎭 User authentication

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: EJS, CSS3, JavaScript
- **File Upload**: Multer
- **Authentication**: Express-session

## Installation

1. Clone the repository
```bash
git clone <https://github.com/gauravkumar7tech/MusicApp>
cd MusicApp-main
```

2. Install dependencies
```bash
npm install
express install
```

3. Create MongoDB database
```bash
# Make sure MongoDB is running on localhost:27017
```

4. Add sample songs (optional)
```bash
node addAudioFiles.js
```

5. Start the server
```bash
npm start
```

6. Open browser at `http://localhost:3000`

## Project Structure

```
MusicApp-main/
├── controllers/        # Route controllers
├── models/            # MongoDB models
├── routes/            # Express routes
├── views/             # EJS templates
├── public/            # Static files
│   ├── songs/        # Audio files
│   ├── style.css     # Styles
│   └── js/           # Client scripts
└── server.js         # Entry point
```

## Usage

1. **Register/Login**: Create an account or login
2. **Add Music**: Upload audio files with details
3. **Browse**: View all tracks or filter by genre
4. **Play**: Click on any track to play audio
5. **Random**: Get random music suggestions
6. **Theme**: Toggle between light and dark modes

## Environment Variables

Create a `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/musicdb
SESSION_SECRET=your-secret-key
```

## License

MIT
