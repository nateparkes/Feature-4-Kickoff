import Parse from 'parse';

// Main function to get movie recommendations for a user
export const getRecommendations = async (userId) => {
  try {
    console.log(`Fetching recommendations for user: ${userId}`);
    const userMovies = await getUserMovies(userId);
    const popularMovies = await getComprehensiveRankedMovies();

    // Filter out the movies the user has already commented on or liked
    const recommendedMovies = popularMovies.filter(movie => !userMovies.includes(movie.id));

    console.log(`Recommendations fetched:`, recommendedMovies);
    return recommendedMovies.length > 0 ? recommendedMovies[0] : null;
  } catch (error) {
    console.error(`Error fetching recommendations:`, error);
    return null;
  }
};

// Helper function to get the list of movies a user has interacted with
const getUserMovies = async (userId) => {
  try {
    const likedMovies = await getLikedMovies(userId);
    const commentedMovies = await getCommentedMovies(userId);

    const allMovies = [...likedMovies, ...commentedMovies];
    const uniqueMovies = [...new Set(allMovies.map(movie => movie.id))];
    console.log(`User interacted movies: `, uniqueMovies);
    return uniqueMovies;
  } catch (error) {
    console.error(`Error getting user movies:`, error);
    return [];
  }
};

// Helper function to get the list of movies a user has liked
const getLikedMovies = async (userId) => {
  try {
    const Like = Parse.Object.extend('Like');
    const query = new Parse.Query(Like);
    query.equalTo('user', Parse.User.createWithoutData(userId));
    query.include('movie');
    const results = await query.find();
    const likedMovies = results.map(result => result.get('movie'));
    console.log(`Liked movies for user ${userId}: `, likedMovies);
    return likedMovies;
  } catch (error) {
    console.error(`Error getting liked movies:`, error);
    return [];
  }
};

// Helper function to get the list of movies a user has commented on
const getCommentedMovies = async (userId) => {
  try {
    const Comment = Parse.Object.extend('Comment');
    const query = new Parse.Query(Comment);
    query.equalTo('user', Parse.User.createWithoutData(userId));
    query.include('movie');
    const results = await query.find();
    const commentedMovies = results.map(result => result.get('movie'));
    console.log(`Commented movies for user ${userId}: `, commentedMovies);
    return commentedMovies;
  } catch (error) {
    console.error(`Error getting commented movies:`, error);
    return [];
  }
};

// Helper function to get popular movies based on box office, likes, comments, and Rotten Tomato rate
export const getComprehensiveRankedMovies = async () => {
  try {
    const Movie = Parse.Object.extend('Movie');
    const query = new Parse.Query(Movie);

    query.descending('boxOffice');
    const boxOfficeResults = await query.find();

    query.descending('likes');
    const likesResults = await query.find();

    query.descending('comments');
    const commentsResults = await query.find();

    query.descending('rottenTomatoRate');
    const rottenTomatoResults = await query.find();

    const movieRanks = {};

    // Assign ranks based on each criterion
    boxOfficeResults.forEach((movie, index) => {
      if (!movieRanks[movie.id]) movieRanks[movie.id] = 0;
      movieRanks[movie.id] += index + 1;
    });

    likesResults.forEach((movie, index) => {
      if (!movieRanks[movie.id]) movieRanks[movie.id] = 0;
      movieRanks[movie.id] += index + 1;
    });

    commentsResults.forEach((movie, index) => {
      if (!movieRanks[movie.id]) movieRanks[movie.id] = 0;
      movieRanks[movie.id] += index + 1;
    });

    rottenTomatoResults.forEach((movie, index) => {
      if (!movieRanks[movie.id]) movieRanks[movie.id] = 0;
      movieRanks[movie.id] += index + 1;
    });

    // Sort movies by their total rank
    const sortedMovieIds = Object.keys(movieRanks).sort((a, b) => movieRanks[a] - movieRanks[b]);

    const sortedMovies = [];
    for (const id of sortedMovieIds) {
      const movie = await new Parse.Query(Movie).get(id);
      sortedMovies.push(movie);
    }

    console.log(`Popular movies from database: `, sortedMovies);
    return sortedMovies;
  } catch (error) {
    console.error(`Error getting popular movies:`, error);
    return [];
  }
};
