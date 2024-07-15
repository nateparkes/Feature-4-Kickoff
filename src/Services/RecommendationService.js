import Parse from 'parse';

// Main function to get movie recommendations for a user
export const getRecommendations = async (userId) => {
  // Get the user object
  const user = await getUser(userId);

  // Get the list of movies the user has interacted with (watched, liked, commented)
  const userMovies = await getUserMovies(user);

  let recommendedMovies = [];
  if (userMovies.length > 0) {
    // Get other users who have interacted with the same movies
    const otherUsers = await getOtherUsers(userId, userMovies);
    // Get recommended movies based on other users' interactions
    recommendedMovies = await getRecommendedMovies(user, otherUsers, userMovies);
  }

  // If no recommendations based on user activity, get popular movies
  if (recommendedMovies.length === 0) {
    recommendedMovies = await getPopularMovies();
  }

  return recommendedMovies;
};

// Helper function to get a user object by ID
const getUser = async (userId) => {
  const User = Parse.Object.extend('User');
  const query = new Parse.Query(User);
  return await query.get(userId);
};

// Helper function to get the list of movies a user has interacted with
const getUserMovies = async (user) => {
  const likedMovies = await getLikedMovies(user);
  const commentedMovies = await getCommentedMovies(user);

  const allMovies = [...likedMovies, ...commentedMovies];
  return [...new Set(allMovies.map(movie => movie.id))];
};

// Helper function to get the list of movies a user has liked
const getLikedMovies = async (user) => {
  const Like = Parse.Object.extend('Like');
  const query = new Parse.Query(Like);
  query.equalTo('user', user);
  query.include('movie');
  const results = await query.find();
  return results.map(result => result.get('movie'));
};

// Helper function to get the list of movies a user has commented on
const getCommentedMovies = async (user) => {
  const Comment = Parse.Object.extend('Comment');
  const query = new Parse.Query(Comment);
  query.equalTo('user', user);
  query.include('movie');
  const results = await query.find();
  return results.map(result => result.get('movie'));
};

// Helper function to get other users who have interacted with the same movies
const getOtherUsers = async (userId, userMovieIds) => {
  const User = Parse.Object.extend('User');

  const likeQuery = new Parse.Query(Parse.Object.extend('Like'));
  likeQuery.containedIn('movie', userMovieIds.map(id => Parse.Object.extend('Movie').createWithoutData(id)));

  const commentQuery = new Parse.Query(Parse.Object.extend('Comment'));
  commentQuery.containedIn('movie', userMovieIds.map(id => Parse.Object.extend('Movie').createWithoutData(id)));

  const usersFromLikes = await likeQuery.findAll();
  const usersFromComments = await commentQuery.findAll();

  const otherUserIds = [
    ...new Set([
      ...usersFromLikes.map(item => item.get('user').id),
      ...usersFromComments.map(item => item.get('user').id),
    ])
  ].filter(id => id !== userId);

  const otherUsers = await Promise.all(otherUserIds.map(id => new Parse.Query(User).get(id)));
  return otherUsers;
};

// Helper function to get recommended movies based on other users' interactions
const getRecommendedMovies = async (user, otherUsers, userMovieIds) => {
  const recommendedMovies = new Set();
  for (let otherUser of otherUsers) {
    const otherUserMovies = await getUserMovies(otherUser);
    for (let movieId of otherUserMovies) {
      if (!userMovieIds.includes(movieId)) {
        const movie = await new Parse.Query(Parse.Object.extend('Movie')).get(movieId);
        recommendedMovies.add(movie);
      }
    }
  }
  return Array.from(recommendedMovies);
};

// Helper function to get popular movies based on likes and comments
const getPopularMovies = async () => {
  const Movie = Parse.Object.extend('Movie');

  const commentQuery = new Parse.Query(Parse.Object.extend('Comment'));
  commentQuery.include('movie');
  commentQuery.descending('createdAt');

  const likeQuery = new Parse.Query(Parse.Object.extend('Like'));
  likeQuery.include('movie');
  likeQuery.descending('createdAt');

  const [commentedMovies, likedMovies] = await Promise.all([commentQuery.find(), likeQuery.find()]);

  const movieCounts = {};

  commentedMovies.forEach(comment => {
    const movie = comment.get('movie');
    if (movie) {
      const movieId = movie.id;
      if (movieCounts[movieId]) {
        movieCounts[movieId].count++;
      } else {
        movieCounts[movieId] = { movie, count: 1 };
      }
    }
  });

  likedMovies.forEach(like => {
    const movie = like.get('movie');
    if (movie) {
      const movieId = movie.id;
      if (movieCounts[movieId]) {
        movieCounts[movieId].count++;
      } else {
        movieCounts[movieId] = { movie, count: 1 };
      }
    }
  });

  const sortedMovies = Object.values(movieCounts).sort((a, b) => b.count - a.count);
  return sortedMovies.slice(0, 3).map(item => item.movie); // Return top 3 popular movies
};
