const mongoose = require('mongoose')
const Music = require('./models/Music')

// Connect to MongoDB (adjust connection string as needed)
mongoose.connect('mongodb://localhost:27017/musicdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const Songs = [
  {
    title: "Haan Karti",
    artist: "Armaan Bedil",
    album: "Crush Diaries",
    genre: "Pop",
    year: 2023,
    duration: "3:55",
    rating: 8.9,
    description: "Cute romantic song about confession and love"
  },
  {
    title: "Kesariya",
    artist: "Arijit Singh",
    album: "Brahmastra",
    genre: "Pop",
    year: 2022,
    duration: "4:28",
    rating: 9.0,
    description: "A soulful romantic pop melody celebrating love"
  },
  {
    title: "Galliyan",
    artist: "Ankit Tiwari",
    album: "Ek Villain",
    genre: "Pop",
    year: 2014,
    duration: "4:23",
    rating: 8.8,
    description: "Melodic love song with soft rock undertones"
  },
  {
    title: "Nadaan Parindey",
    artist: "A. R. Rahman",
    album: "Rockstar",
    genre: "Rock",
    year: 2011,
    duration: "6:22",
    rating: 9.2,
    description: "Powerful rock ballad exploring soul and freedom"
  },
  {
    title: "Rock On!!",
    artist: "Farhan Akhtar",
    album: "Rock On!!",
    genre: "Rock",
    year: 2008,
    duration: "4:36",
    rating: 8.9,
    description: "Energetic Indian rock anthem about chasing dreams"
  },
  {
    title: "Socha Hai",
    artist: "Farhan Akhtar",
    album: "Rock On!!",
    genre: "Rock",
    year: 2008,
    duration: "4:02",
    rating: 8.5,
    description: "Lively indie rock with existential themes"
  },
  {
    title: "Breathless",
    artist: "Shankar Mahadevan",
    album: "Breathless",
    genre: "Fusion",
    year: 1998,
    duration: "3:40",
    rating: 9.1,
    description: "Unique Indian fusion track sung in one breath"
  },
  {
    title: "Mora Saiyaan",
    artist: "Fuzön",
    album: "Saagar",
    genre: "Jazz",
    year: 2002,
    duration: "5:14",
    rating: 8.7,
    description: "Jazz-fusion song blending Indian classical and modern rhythms"
  },
  {
    title: "Aaoge Jab Tum",
    artist: "Rashid Khan",
    album: "Jab We Met",
    genre: "Classical",
    year: 2007,
    duration: "5:05",
    rating: 9.3,
    description: "Emotional classical-inspired romantic composition"
  },
  {
    title: "Aaj Jaane Ki Zid Na Karo",
    artist: "Farida Khanum",
    album: "Classical Collection",
    genre: "Classical",
    year: 1978,
    duration: "6:00",
    rating: 9.4,
    description: "Timeless ghazal blending soulful lyrics with classical music"
  },
  {
    title: "Kabira",
    artist: "Tochi Raina, Rekha Bhardwaj",
    album: "Yeh Jawaani Hai Deewani",
    genre: "Folk Fusion",
    year: 2013,
    duration: "3:45",
    rating: 9.0,
    description: "Folk-classical fusion that touches the soul"
  },
  {
    title: "Malang Sajna",
    artist: "Sachet–Parampara",
    album: "Single",
    genre: "Pop",
    year: 2023,
    duration: "3:50",
    rating: 8.6,
    description: "Modern Indian pop duet about passionate love"
  },
  {
    title: "Excuses",
    artist: "AP Dhillon, Gurinder Gill",
    album: "Hidden Gems",
    genre: "Hip Hop",
    year: 2021,
    duration: "2:56",
    rating: 9.1,
    description: "Punjabi-English hip hop track with catchy beats"
  },
  {
    title: "Brown Munde",
    artist: "AP Dhillon, Gurinder Gill, Shinda Kahlon",
    album: "Not by Chance",
    genre: "Hip Hop",
    year: 2020,
    duration: "3:12",
    rating: 9.4,
    description: "Punjabi trap anthem representing global brown culture"
  },
  {
    title: "Maan Meri Jaan",
    artist: "King",
    album: "Champagne Talk",
    genre: "Pop",
    year: 2022,
    duration: "3:15",
    rating: 9.0,
    description: "Modern pop song expressing deep emotions and loyalty"
  },
  {
    title: "Jashn-e-Bahaara",
    artist: "Javed Ali",
    album: "Jodhaa Akbar",
    genre: "Classical",
    year: 2008,
    duration: "4:15",
    rating: 9.3,
    description: "A royal semi-classical romantic melody"
  },
  {
    title: "Agar Tum Saath Ho",
    artist: "Alka Yagnik, Arijit Singh",
    album: "Tamasha",
    genre: "Pop",
    year: 2015,
    duration: "5:41",
    rating: 9.5,
    description: "Heart-touching emotional pop ballad"
  },
  {
    title: "Sultan Theme",
    artist: "Vishal–Shekhar",
    album: "Sultan",
    genre: "Electronic",
    year: 2016,
    duration: "3:28",
    rating: 8.7,
    description: "High-energy electronic track with motivational beats"
  },
  {
    title: "Infinity",
    artist: "DJ NYK",
    album: "Electronic India",
    genre: "Electronic",
    year: 2020,
    duration: "3:10",
    rating: 8.5,
    description: "EDM fusion track blending Bollywood elements"
  },
  {
    title: "Excuse Me Girl",
    artist: "Irshad Kamil, Blaaze",
    album: "Single",
    genre: "Hip Hop",
    year: 2008,
    duration: "3:18",
    rating: 8.2,
    description: "Early Bollywood-style hip hop with playful lyrics"
  },
  {
    title: "Kun Faya Kun",
    artist: "A. R. Rahman, Javed Ali, Mohit Chauhan",
    album: "Rockstar",
    genre: "Sufi Rock",
    year: 2011,
    duration: "7:52",
    rating: 9.7,
    description: "Spiritual fusion of rock and Sufi devotional music"
  },
  {
    title: "Pasoori",
    artist: "Ali Sethi, Shae Gill",
    album: "Coke Studio Season 14",
    genre: "Fusion",
    year: 2022,
    duration: "4:37",
    rating: 9.6,
    description: "Cross-border fusion of classical and electronic music"
  },
  {
    title: "Cold/Mess",
    artist: "Prateek Kuhad",
    album: "Cold/Mess",
    genre: "Indie Pop",
    year: 2018,
    duration: "4:30",
    rating: 9.3,
    description: "Soft indie-pop song about heartbreak and self-reflection"
  },
  {
    title: "Voodoo",
    artist: "Badshah, J Balvin",
    album: "Single",
    genre: "Hip Hop",
    year: 2022,
    duration: "3:09",
    rating: 8.9,
    description: "International Indian hip hop collaboration with reggaeton beats"
  },
  {
    title: "Do Gallan",
    artist: "Garry Sandhu",
    album: "Single",
    genre: "Pop",
    year: 2021,
    duration: "3:30",
    rating: 8.7,
    description: "Romantic Punjabi pop duet full of charm"
  },
  {
    title: "Why Not Meri Jaan",
    artist: "Gippy Grewal",
    album: "Single",
    genre: "Hip Hop",
    year: 2021,
    duration: "3:02",
    rating: 8.5,
    description: "Stylish Punjabi hip hop track with attitude"
  },
  {
    title: "Kasoote",
    artist: "Dhanda Nyoliwala",
    album: "Folk Tales",
    genre: "Hip Hop",
    year: 2021,
    duration: "3:55",
    rating: 8.2,
    description: "Emotional Haryanvi hip hop with rustic vibes"
  },
  {
    title: "Yaar Mod Do",
    artist: "Guru Randhawa, Millind Gaba",
    album: "Single",
    genre: "Pop",
    year: 2016,
    duration: "3:25",
    rating: 8.5,
    description: "Catchy Punjabi pop friendship anthem"
  },
  {
    title: "Zinda",
    artist: "Siddharth Mahadevan",
    album: "Bhaag Milkha Bhaag",
    genre: "Rock",
    year: 2013,
    duration: "4:00",
    rating: 9.0,
    description: "Motivational rock anthem with powerful vocals"
  },
  {
    title: "Patakha Guddi",
    artist: "Nooran Sisters",
    album: "Highway",
    genre: "Sufi Rock",
    year: 2014,
    duration: "5:26",
    rating: 9.4,
    description: "Sufi-rock track full of energy and devotion"
  },
  {
    title: "Illahi",
    artist: "Arijit Singh",
    album: "Yeh Jawaani Hai Deewani",
    genre: "Pop Rock",
    year: 2013,
    duration: "3:45",
    rating: 9.2,
    description: "Inspirational travel song with pop-rock vibes"
  },
  {
    title: "Sunn Raha Hai",
    artist: "Ankit Tiwari",
    album: "Aashiqui 2",
    genre: "Rock",
    year: 2013,
    duration: "6:30",
    rating: 9.1,
    description: "Intense emotional rock song filled with heartbreak"
  },
  {
    title: "O Rangrez",
    artist: "Shreya Ghoshal, Javed Bashir",
    album: "Bhaag Milkha Bhaag",
    genre: "Classical",
    year: 2013,
    duration: "6:02",
    rating: 9.3,
    description: "A mesmerizing semi-classical duet blending devotion and melody"
  },
  {
    title: "Kho Gaye Hum Kahan",
    artist: "Jasleen Royal, Prateek Kuhad",
    album: "Baar Baar Dekho",
    genre: "Indie Pop",
    year: 2016,
    duration: "4:30",
    rating: 9.0,
    description: "Calm reflective pop track about life and moments"
  },
  {
    title: "Namo Namo",
    artist: "Amit Trivedi",
    album: "Kedarnath",
    genre: "Classical Fusion",
    year: 2018,
    duration: "5:18",
    rating: 9.5,
    description: "Spiritual fusion song invoking divine energy"
  },
  {
    title: "Banjaara",
    artist: "Mohit Chauhan",
    album: "Ek Villain",
    genre: "Pop Rock",
    year: 2014,
    duration: "5:00",
    rating: 8.9,
    description: "Soothing pop-rock track with deep lyrical emotion"
  },
  {
    title: "Udd Gaye",
    artist: "Ritviz",
    album: "Ved",
    genre: "Electronic",
    year: 2017,
    duration: "3:15",
    rating: 9.3,
    description: "Desi electronic fusion with catchy beats and Hindi lyrics"
  },
  {
    title: "Liggi",
    artist: "Ritviz",
    album: "Ved",
    genre: "Electronic",
    year: 2019,
    duration: "3:08",
    rating: 9.1,
    description: "Energetic electronic anthem celebrating independence"
  },
  {
    title: "The Humma Song",
    artist: "Badshah, Jubin Nautiyal, Shashaa Tirupati",
    album: "OK Jaanu",
    genre: "Electronic",
    year: 2017,
    duration: "3:50",
    rating: 8.4,
    description: "Remixed electronic version of a 90s classic"
  },
  {
    title: "Mirchi",
    artist: "DIVINE, Stylo G, MC Altaf",
    album: "Punya Paap",
    genre: "Hip Hop",
    year: 2020,
    duration: "3:15",
    rating: 9.0,
    description: "Hard-hitting Indian hip hop with global sound"
  },
  {
    title: "Sher Aaya Sher",
    artist: "DIVINE",
    album: "Gully Boy",
    genre: "Hip Hop",
    year: 2019,
    duration: "3:12",
    rating: 9.4,
    description: "Powerful rap anthem from the Indian street hip hop scene"
  },
  {
    title: "Apna Time Aayega",
    artist: "Ranveer Singh, DIVINE",
    album: "Gully Boy",
    genre: "Hip Hop",
    year: 2019,
    duration: "2:20",
    rating: 9.8,
    description: "Revolutionary Indian rap song symbolizing self-belief"
  },
  {
    title: "Riha",
    artist: "Anuv Jain",
    album: "Single",
    genre: "Indie Pop",
    year: 2019,
    duration: "4:15",
    rating: 9.0,
    description: "Heartfelt indie pop song about letting go"
  },
  {
    title: "Baarishein",
    artist: "Anuv Jain",
    album: "Single",
    genre: "Pop",
    year: 2018,
    duration: "3:42",
    rating: 9.1,
    description: "Soft romantic pop track about memories and longing"
  },
  {
    title: "Alag Aasmaan",
    artist: "Anuv Jain",
    album: "Single",
    genre: "Indie Pop",
    year: 2020,
    duration: "3:54",
    rating: 9.0,
    description: "Relaxing indie pop tune about finding your own sky"
  },
  {
    title: "Vaaste",
    artist: "Dhvani Bhanushali, Nikhil D’Souza",
    album: "Single",
    genre: "Pop",
    year: 2019,
    duration: "3:46",
    rating: 8.9,
    description: "Romantic pop single that became an internet sensation"
  },
  {
    title: "Shayad",
    artist: "Arijit Singh",
    album: "Love Aaj Kal",
    genre: "Pop",
    year: 2020,
    duration: "4:07",
    rating: 9.2,
    description: "Melancholic pop number with deep emotions"
  },
  {
    title: "Manike Mage Hithe",
    artist: "Yohani",
    album: "Single",
    genre: "Pop",
    year: 2021,
    duration: "3:38",
    rating: 9.0,
    description: "Viral pop sensation blending Sinhala and Hindi lyrics"
  },
  {
    title: "Doobey",
    artist: "Lothika",
    album: "Gehraiyaan",
    genre: "Electronic",
    year: 2022,
    duration: "3:57",
    rating: 8.8,
    description: "Dreamy electronic pop song about falling in love"
  }
]



async function addSongs() {
  try {
    console.log('Adding songs...')
    
    for (const song of Songs) {
      const existingSong = await Music.findOne({ 
        title: song.title, 
        artist: song.artist 
      })
      
      if (!existingSong) {
        const newSong = new Music(song)
        await newSong.save()
        console.log(`Added: ${song.title} by ${song.artist}`)
      } else {
        console.log(`Skipped (already exists): ${song.title} by ${song.artist}`)
      }
    }
    
    console.log(' songs processed successfully!')
    
    // Display summary
    const totalSongs = await Music.countDocuments()
    const songs = await Music.countDocuments({ genre: 'songs' })

    
    console.log(`\nDatabase Summary:`)
    console.log(`Total songs: ${totalSongs}`)
    
  } catch (error) {
    console.error('Error adding songs:', error)
  } finally {
    mongoose.connection.close()
  }
}

addSongs()