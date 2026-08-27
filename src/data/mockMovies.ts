import { Movie, Review, NotificationItem, UserProfile } from '../types';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Inception',
    type: 'movie',
    year: 2010,
    releaseDate: '2010-07-16',
    duration: '2h 28m',
    rating: 8.8,
    communityVotes: 24500,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    moods: ['Mind-Bending', 'Adrenaline', 'Philosophical'],
    director: 'Christopher Nolan',
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Dom Cobb' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur' },
      { name: 'Elliot Page', role: 'Ariadne' },
      { name: 'Tom Hardy', role: 'Eames' },
      { name: 'Ken Watanabe', role: 'Saito' }
    ],
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'YoHD9XEInc0',
    streamingOn: [
      { name: 'Netflix', logo: 'N' },
      { name: 'Max', logo: 'MAX' },
      { name: 'Prime Video', logo: 'PRIME' }
    ],
    similarIds: ['m2', 'm5', 'm10', 'm14'],
    featured: true,
    matchScore: 98,
    reasonForRecommendation: 'Matches your taste for intricate plotlines and high-concept science fiction.'
  },
  {
    id: 'm2',
    title: 'Interstellar',
    type: 'movie',
    year: 2014,
    releaseDate: '2014-11-07',
    duration: '2h 49m',
    rating: 8.7,
    communityVotes: 21800,
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    moods: ['Mind-Bending', 'Emotional', 'Epic'],
    director: 'Christopher Nolan',
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper' },
      { name: 'Anne Hathaway', role: 'Brand' },
      { name: 'Jessica Chastain', role: 'Murph' },
      { name: 'Michael Caine', role: 'Professor Brand' }
    ],
    overview: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'zSWdZVtXT7E',
    streamingOn: [
      { name: 'Paramount+', logo: 'P+' },
      { name: 'Prime Video', logo: 'PRIME' }
    ],
    similarIds: ['m1', 'm8', 'm15'],
    featured: true,
    matchScore: 96,
    reasonForRecommendation: 'Epic space exploration grounded in emotional father-daughter dynamics.'
  },
  {
    id: 'm3',
    title: 'Severance',
    type: 'series',
    year: 2022,
    releaseDate: '2022-02-18',
    duration: '2 Seasons (19 eps)',
    rating: 8.7,
    communityVotes: 18400,
    genres: ['Sci-Fi', 'Thriller', 'Mystery', 'Drama'],
    moods: ['Mind-Bending', 'Dark Thriller', 'Dystopian'],
    director: 'Ben Stiller, Aoife McArdle',
    cast: [
      { name: 'Adam Scott', role: 'Mark Scout' },
      { name: 'Patricia Arquette', role: 'Harmony Cobel' },
      { name: 'John Turturro', role: 'Irving Bailiff' },
      { name: 'Christopher Walken', role: 'Burt Goodman' },
      { name: 'Britt Lower', role: 'Helly R.' }
    ],
    overview: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.',
    posterUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'xEQP4VVuyrY',
    streamingOn: [
      { name: 'Apple TV+', logo: 'TV+' }
    ],
    upcomingEpisode: {
      season: 2,
      episode: 8,
      title: 'The Overtime Protocol',
      airDate: '2026-09-04',
      alertEnabled: true
    },
    similarIds: ['m1', 'm10', 'm12'],
    featured: true,
    matchScore: 94,
    reasonForRecommendation: 'Psychological mystery with incredible world-building and workplace existentialism.'
  },
  {
    id: 'm4',
    title: 'The Dark Knight',
    type: 'movie',
    year: 2008,
    releaseDate: '2008-07-18',
    duration: '2h 32m',
    rating: 9.0,
    communityVotes: 32000,
    genres: ['Action', 'Crime', 'Drama'],
    moods: ['Dark Thriller', 'Adrenaline', 'Epic'],
    director: 'Christopher Nolan',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman' },
      { name: 'Heath Ledger', role: 'Joker' },
      { name: 'Aaron Eckhart', role: 'Harvey Dent' },
      { name: 'Michael Caine', role: 'Alfred' },
      { name: 'Maggie Gyllenhaal', role: 'Rachel Dawes' }
    ],
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'EXeTwQWrcwY',
    streamingOn: [
      { name: 'Max', logo: 'MAX' },
      { name: 'Netflix', logo: 'N' }
    ],
    similarIds: ['m1', 'm7', 'm11'],
    matchScore: 95
  },
  {
    id: 'm5',
    title: 'Everything Everywhere All at Once',
    type: 'movie',
    year: 2022,
    releaseDate: '2022-04-08',
    duration: '2h 19m',
    rating: 8.8,
    communityVotes: 19500,
    genres: ['Sci-Fi', 'Comedy', 'Adventure', 'Action'],
    moods: ['Mind-Bending', 'Feel-Good', 'Emotional'],
    director: 'Daniel Kwan, Daniel Scheinert',
    cast: [
      { name: 'Michelle Yeoh', role: 'Evelyn Wang' },
      { name: 'Ke Huy Quan', role: 'Waymond Wang' },
      { name: 'Stephanie Hsu', role: 'Joy Wang / Jobu Tupaki' },
      { name: 'Jamie Lee Curtis', role: 'Deirdre Beaubeirdre' }
    ],
    overview: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'wxN1T1uxQ2g',
    streamingOn: [
      { name: 'Netflix', logo: 'N' },
      { name: 'Prime Video', logo: 'PRIME' }
    ],
    similarIds: ['m1', 'm2', 'm9'],
    matchScore: 92
  },
  {
    id: 'm6',
    title: 'Stranger Things',
    type: 'series',
    year: 2016,
    releaseDate: '2016-07-15',
    duration: '5 Seasons (42 eps)',
    rating: 8.7,
    communityVotes: 28900,
    genres: ['Sci-Fi', 'Horror', 'Drama', 'Fantasy'],
    moods: ['Nostalgic', 'Adrenaline', 'Dark Thriller'],
    director: 'The Duffer Brothers',
    cast: [
      { name: 'Millie Bobby Brown', role: 'Eleven' },
      { name: 'Finn Wolfhard', role: 'Mike Wheeler' },
      { name: 'Winona Ryder', role: 'Joyce Byers' },
      { name: 'David Harbour', role: 'Jim Hopper' }
    ],
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    posterUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'b9EkMc79ZSU',
    streamingOn: [
      { name: 'Netflix', logo: 'N' }
    ],
    upcomingEpisode: {
      season: 5,
      episode: 1,
      title: 'The Crawl (Final Season Premiere)',
      airDate: '2026-10-31',
      alertEnabled: true
    },
    similarIds: ['m3', 'm12', 'm16'],
    featured: true,
    matchScore: 91
  },
  {
    id: 'm7',
    title: 'The Batman',
    type: 'movie',
    year: 2022,
    releaseDate: '2022-03-04',
    duration: '2h 56m',
    rating: 7.9,
    communityVotes: 16700,
    genres: ['Crime', 'Drama', 'Mystery', 'Action'],
    moods: ['Dark Thriller', 'Moody', 'Philosophical'],
    director: 'Matt Reeves',
    cast: [
      { name: 'Robert Pattinson', role: 'Bruce Wayne / Batman' },
      { name: 'Zoë Kravitz', role: 'Selina Kyle / Catwoman' },
      { name: 'Paul Dano', role: 'The Riddler' },
      { name: 'Colin Farrell', role: 'Oz Cobb / Penguin' }
    ],
    overview: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'mqqft2x_Aa4',
    streamingOn: [
      { name: 'Max', logo: 'MAX' }
    ],
    similarIds: ['m4', 'm11', 'm13'],
    matchScore: 89
  },
  {
    id: 'm8',
    title: 'Dune: Part Two',
    type: 'movie',
    year: 2024,
    releaseDate: '2024-03-01',
    duration: '2h 46m',
    rating: 8.6,
    communityVotes: 23100,
    genres: ['Sci-Fi', 'Adventure', 'Action', 'Drama'],
    moods: ['Epic', 'Mind-Bending', 'Adrenaline'],
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides' },
      { name: 'Zendaya', role: 'Chani' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica' },
      { name: 'Austin Butler', role: 'Feyd-Rautha Harkonnen' }
    ],
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'Way9Dexny3w',
    streamingOn: [
      { name: 'Max', logo: 'MAX' },
      { name: 'Prime Video', logo: 'PRIME' }
    ],
    similarIds: ['m1', 'm2', 'm15'],
    featured: true,
    matchScore: 97
  },
  {
    id: 'm9',
    title: 'Spider-Man: Across the Spider-Verse',
    type: 'movie',
    year: 2023,
    releaseDate: '2023-06-02',
    duration: '2h 20m',
    rating: 8.7,
    communityVotes: 21000,
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    moods: ['Feel-Good', 'Mind-Bending', 'Adrenaline'],
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales (voice)' },
      { name: 'Hailee Steinfeld', role: 'Gwen Stacy (voice)' },
      { name: 'Oscar Isaac', role: 'Miguel O\'Hara (voice)' },
      { name: 'Daniel Kaluuya', role: 'Hobart Brown / Spider-Punk' }
    ],
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When heroes clash on how to handle a threat, Miles must redefine what it means to be a hero.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'cqGjhVJWtEg',
    streamingOn: [
      { name: 'Netflix', logo: 'N' }
    ],
    similarIds: ['m5', 'm1', 'm14'],
    matchScore: 93
  },
  {
    id: 'm10',
    title: 'The Last of Us',
    type: 'series',
    year: 2023,
    releaseDate: '2023-01-15',
    duration: '2 Seasons (16 eps)',
    rating: 8.8,
    communityVotes: 26400,
    genres: ['Drama', 'Sci-Fi', 'Horror', 'Action'],
    moods: ['Emotional', 'Dark Thriller', 'Post-Apocalyptic'],
    director: 'Craig Mazin, Neil Druckmann',
    cast: [
      { name: 'Pedro Pascal', role: 'Joel Miller' },
      { name: 'Bella Ramsey', role: 'Ellie Williams' },
      { name: 'Gabriel Luna', role: 'Tommy' },
      { name: 'Kaitlyn Dever', role: 'Abby' }
    ],
    overview: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity\'s last hope.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'uLtkt8BonwM',
    streamingOn: [
      { name: 'Max', logo: 'MAX' }
    ],
    upcomingEpisode: {
      season: 2,
      episode: 1,
      title: 'Jackson\'s Winter (Season 2 Premiere)',
      airDate: '2026-09-18',
      alertEnabled: true
    },
    similarIds: ['m3', 'm6', 'm2'],
    featured: true,
    matchScore: 95
  },
  {
    id: 'm11',
    title: 'Parasite',
    type: 'movie',
    year: 2019,
    releaseDate: '2019-10-05',
    duration: '2h 12m',
    rating: 8.5,
    communityVotes: 25700,
    genres: ['Thriller', 'Drama', 'Comedy'],
    moods: ['Dark Thriller', 'Mind-Bending', 'Philosophical'],
    director: 'Bong Joon Ho',
    cast: [
      { name: 'Song Kang-ho', role: 'Kim Ki-taek' },
      { name: 'Lee Sun-kyun', role: 'Park Dong-ik' },
      { name: 'Cho Yeo-jeong', role: 'Park Yeon-gyo' },
      { name: 'Choi Woo-shik', role: 'Kim Ki-woo' }
    ],
    overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: '5xH0hhJ98Xg',
    streamingOn: [
      { name: 'Hulu', logo: 'HULU' },
      { name: 'Max', logo: 'MAX' }
    ],
    similarIds: ['m1', 'm4', 'm7'],
    matchScore: 90
  },
  {
    id: 'm12',
    title: 'Succession',
    type: 'series',
    year: 2018,
    releaseDate: '2018-06-03',
    duration: '4 Seasons (39 eps)',
    rating: 8.9,
    communityVotes: 22100,
    genres: ['Drama'],
    moods: ['Dark Thriller', 'Witty', 'Moody'],
    director: 'Jesse Armstrong',
    cast: [
      { name: 'Brian Cox', role: 'Logan Roy' },
      { name: 'Jeremy Strong', role: 'Kendall Roy' },
      { name: 'Sarah Snook', role: 'Shiv Roy' },
      { name: 'Kieran Culkin', role: 'Roman Roy' },
      { name: 'Matthew Macfadyen', role: 'Tom Wambsgans' }
    ],
    overview: 'The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their aging father steps down from the company.',
    posterUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'OzYxJV_rmE8',
    streamingOn: [
      { name: 'Max', logo: 'MAX' }
    ],
    similarIds: ['m3', 'm11', 'm4'],
    matchScore: 92
  },
  {
    id: 'm13',
    title: 'Oppenheimer',
    type: 'movie',
    year: 2023,
    releaseDate: '2023-07-21',
    duration: '3h 00m',
    rating: 8.9,
    communityVotes: 27800,
    genres: ['Biography', 'Drama', 'History'],
    moods: ['Epic', 'Philosophical', 'Moody'],
    director: 'Christopher Nolan',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer' },
      { name: 'Emily Blunt', role: 'Katherine Oppenheimer' },
      { name: 'Matt Damon', role: 'Leslie Groves' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss' },
      { name: 'Florence Pugh', role: 'Jean Tatlock' }
    ],
    overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'uYPbbksJxIg',
    streamingOn: [
      { name: 'Peacock', logo: 'PEACOCK' },
      { name: 'Prime Video', logo: 'PRIME' }
    ],
    similarIds: ['m1', 'm2', 'm8'],
    matchScore: 93
  },
  {
    id: 'm14',
    title: 'Cyberpunk: Edgerunners',
    type: 'series',
    year: 2022,
    releaseDate: '2022-09-13',
    duration: '1 Season (10 eps)',
    rating: 8.3,
    communityVotes: 14200,
    genres: ['Animation', 'Action', 'Sci-Fi'],
    moods: ['Adrenaline', 'Emotional', 'Dystopian'],
    director: 'Hiroyuki Imaishi',
    cast: [
      { name: 'KENN / Zach Aguilar', role: 'David Martinez' },
      { name: 'Aoi Yuuki / Emi Lo', role: 'Lucy' }
    ],
    overview: 'A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner: a mercenary outlaw.',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'JtqIas3bYhg',
    streamingOn: [
      { name: 'Netflix', logo: 'N' }
    ],
    similarIds: ['m1', 'm9', 'm15'],
    matchScore: 88
  },
  {
    id: 'm15',
    title: 'Blade Runner 2049',
    type: 'movie',
    year: 2017,
    releaseDate: '2017-10-06',
    duration: '2h 44m',
    rating: 8.0,
    communityVotes: 19800,
    genres: ['Sci-Fi', 'Mystery', 'Drama', 'Action'],
    moods: ['Moody', 'Philosophical', 'Mind-Bending'],
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Ryan Gosling', role: 'K' },
      { name: 'Harrison Ford', role: 'Rick Deckard' },
      { name: 'Ana de Armas', role: 'Joi' },
      { name: 'Sylvia Hoeks', role: 'Luv' }
    ],
    overview: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
    posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'gCcx85zbxz4',
    streamingOn: [
      { name: 'Max', logo: 'MAX' },
      { name: 'Hulu', logo: 'HULU' }
    ],
    similarIds: ['m8', 'm1', 'm2'],
    matchScore: 91
  },
  {
    id: 'm16',
    title: 'House of the Dragon',
    type: 'series',
    year: 2022,
    releaseDate: '2022-08-21',
    duration: '3 Seasons (26 eps)',
    rating: 8.4,
    communityVotes: 21300,
    genres: ['Fantasy', 'Drama', 'Action'],
    moods: ['Epic', 'Dark Thriller', 'Moody'],
    director: 'Ryan J. Condal, George R.R. Martin',
    cast: [
      { name: 'Emma D\'Arcy', role: 'Princess Rhaenyra Targaryen' },
      { name: 'Matt Smith', role: 'Prince Daemon Targaryen' },
      { name: 'Olivia Cooke', role: 'Queen Alicent Hightower' }
    ],
    overview: 'An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerYoutubeId: 'DotnJ7tTA34',
    streamingOn: [
      { name: 'Max', logo: 'MAX' }
    ],
    upcomingEpisode: {
      season: 3,
      episode: 1,
      title: 'The Dragon\'s Dance Reckoning',
      airDate: '2026-09-25',
      alertEnabled: true
    },
    similarIds: ['m6', 'm12', 'm8'],
    featured: true,
    matchScore: 92
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    movieId: 'm1',
    userId: 'u2',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 10,
    reviewText: 'Hans Zimmer\'s score paired with the zero-gravity hotel corridor fight makes this one of cinema\'s greatest technical achievements. The emotional core with Mal still breaks my heart every time.',
    createdAt: '2 days ago',
    likes: 342,
    userLiked: false,
    tags: ['Masterpiece', 'Mind-Bending', 'Top Cinematography'],
    hasSpoiler: false
  },
  {
    id: 'r2',
    movieId: 'm1',
    userId: 'u3',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 9,
    reviewText: 'Nolan at his absolute peak. The layered dream architecture never loses clarity despite 4 simultaneous levels of action.',
    createdAt: '1 week ago',
    likes: 129,
    userLiked: true,
    tags: ['Plot Twist', 'Rewatchable'],
    hasSpoiler: false
  },
  {
    id: 'r3',
    movieId: 'm3',
    userId: 'u4',
    userName: 'Devon Clarke',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    rating: 10,
    reviewText: 'The season finale had my heart beating out of my chest. The cinematography and eerie minimalist office design create a suffocating sense of corporate horror.',
    createdAt: '3 days ago',
    likes: 215,
    userLiked: false,
    tags: ['Must Watch', 'Cliffhanger', 'Brilliant Acting'],
    hasSpoiler: false
  },
  {
    id: 'r4',
    movieId: 'm2',
    userId: 'u5',
    userName: 'Aria Chen',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    rating: 10,
    reviewText: 'That docking scene ("It\'s not possible. No, it\'s necessary.") gives me goosebumps without fail. Science fiction that respects physics while honoring love across dimensions.',
    createdAt: '5 days ago',
    likes: 480,
    userLiked: true,
    tags: ['Tearjerker', 'Soundtrack', 'Masterpiece'],
    hasSpoiler: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New Episode Alert!',
    message: 'Severance S02E08 "The Overtime Protocol" airs next Friday on Apple TV+.',
    movieId: 'm3',
    movieTitle: 'Severance',
    moviePoster: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&auto=format&fit=crop&q=80',
    type: 'episode_alert',
    timestamp: '10m ago',
    read: false,
    scheduledAirDate: '2026-09-04'
  },
  {
    id: 'n2',
    title: 'Upcoming Season Premiere',
    message: 'The Last of Us Season 2 Premiere is scheduled for Sept 18. Set your watchlist reminder!',
    movieId: 'm10',
    movieTitle: 'The Last of Us',
    moviePoster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80',
    type: 'release',
    timestamp: '2 hours ago',
    read: false,
    scheduledAirDate: '2026-09-18'
  },
  {
    id: 'n3',
    title: 'Personalized AI Recommendation',
    message: 'Based on your 10/10 rating for Inception, we recommend checking out Dune: Part Two.',
    movieId: 'm8',
    movieTitle: 'Dune: Part Two',
    moviePoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
    type: 'recommendation',
    timestamp: 'Yesterday',
    read: true
  },
  {
    id: 'n4',
    title: 'Community Review Milestone',
    message: 'Your review for Interstellar just reached 450+ helpful upvotes!',
    movieId: 'm2',
    movieTitle: 'Interstellar',
    type: 'community',
    timestamp: '3 days ago',
    read: true
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'u1',
  name: 'Alex Mercer',
  username: 'alex_cinema',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  bio: 'Cinephile & Sci-Fi enthusiast. Always hunting for mind-bending plots, existential thrillers, and Hans Zimmer scores.',
  favoriteGenres: ['Sci-Fi', 'Thriller', 'Drama', 'Action'],
  pinnedFavoriteIds: ['m1', 'm2', 'm3', 'm8'],
  totalWatchHours: 342,
  totalMoviesWatched: 128,
  totalSeriesWatched: 24,
  totalReviewsWritten: 19,
  notificationsEnabled: true,
  customLists: ['Weekend Mind-Benders', 'Hans Zimmer Soundtracks', 'Rainy Day Classics']
};
