const mongoose = require('mongoose');
const Music = require('./models/Music');

mongoose.connect('mongodb://127.0.0.1:27017/musicdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const songs = [
  { title: 'Ateraxia', artist: 'Unknown', album: 'Collection', genre: 'Electronic', year: 2024, duration: '3:45', rating: 8, description: 'An atmospheric electronic track', audioFile: 'Ateraxia.mp3' },
  { title: 'Brother', artist: 'Unknown', album: 'Collection', genre: 'Rock', year: 2024, duration: '4:20', rating: 7, description: 'A powerful rock anthem', audioFile: 'Brother.mp3' },
  { title: 'Get Away', artist: 'Unknown', album: 'Collection', genre: 'Pop', year: 2024, duration: '3:30', rating: 8, description: 'An upbeat pop track', audioFile: 'Get Away.mp3' },
  { title: 'Highschool Funeral', artist: 'Unknown', album: 'Collection', genre: 'Rock', year: 2024, duration: '4:15', rating: 9, description: 'A melancholic rock ballad', audioFile: 'Highschool Funeral.mp3' },
  { title: 'Intro', artist: 'Unknown', album: 'Collection', genre: 'Electronic', year: 2024, duration: '2:10', rating: 7, description: 'An introductory piece', audioFile: 'Intro.mp3' },
  { title: 'J5', artist: 'Unknown', album: 'Collection', genre: 'Hip Hop', year: 2024, duration: '3:55', rating: 8, description: 'A hip hop track', audioFile: 'J5.mp3' },
  { title: 'Manimal', artist: 'Unknown', album: 'Collection', genre: 'Rock', year: 2024, duration: '4:30', rating: 8, description: 'An intense rock track', audioFile: 'Manimal.mp3' },
  { title: 'Neruda', artist: 'Unknown', album: 'Collection', genre: 'Classical', year: 2024, duration: '5:20', rating: 9, description: 'A poetic classical piece', audioFile: 'Neruda.mp3' },
  { title: 'Scarwhores', artist: 'Unknown', album: 'Collection', genre: 'Rock', year: 2024, duration: '3:40', rating: 7, description: 'A gritty rock song', audioFile: 'Scarwhores.mp3' },
  { title: 'Solitude', artist: 'Unknown', album: 'Collection', genre: 'Jazz', year: 2024, duration: '4:50', rating: 9, description: 'A contemplative jazz piece', audioFile: 'Solitude.mp3' },
  { title: 'Throne', artist: 'Unknown', album: 'Collection', genre: 'Electronic', year: 2024, duration: '4:05', rating: 8, description: 'An epic electronic track', audioFile: 'Throne.mp3' },
  { title: 'Victims of Chaos', artist: 'Unknown', album: 'Collection', genre: 'Rock', year: 2024, duration: '4:45', rating: 8, description: 'A chaotic rock anthem', audioFile: 'Victims of Chaos.mp3' }
];

async function addSongs() {
  try {
    await Music.deleteMany({});
    await Music.insertMany(songs);
    console.log('✓ All songs added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addSongs();
