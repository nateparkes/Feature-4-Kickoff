import Parse from 'parse';

// Main function to get movie recommendations for a user
export const getRecommendations = async (userId) => {
  try {
    console.log(`Fetching recommendations for user: ${userId}`);
    const userMovies = await getUserMovies(userId);
    console.log(`User movies: `, userMovies);
    const popularMovies = await getPopularMovies();
    console.log(`Popular movies: `, popularMovies);

    // Filter out the movies the user has already commented on or liked
    const recommendedMovies = popularMovies.filter(movie => !userMovies.includes(movie.id));
    console.log(`Filtered recommendations:`, recommendedMovies);

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
    return results.map(result => result.get('movie'));
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
    return results.map(result => result.get('movie'));
  } catch (error) {
    console.error(`Error getting commented movies:`, error);
    return [];
  }
};

// Helper function to get popular movies based on box office, likes, comments, and Rotten Tomato rate
export const getPopularMovies = async () => {
  try {
    const Movie = Parse.Object.extend('Movie');
    const query = new Parse.Query(Movie);

    query.descending('boxOffice');
    query.addDescending('likes');
    query.addDescending('comments');
    query.addDescending('rottenTomatoRate');

    const results = await query.find();
    console.log(`Popular movies from database: `, results);
    return results;
  } catch (error) {
    console.error(`Error getting popular movies:`, error);
    return [];
  }
};
