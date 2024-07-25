import Parse from 'parse';
import { fetchWatchlist } from './WatchlistService';
import { fetchAlreadyWatchedList } from './AlreadyWatchedService';
import { fetchLikedMovies } from './LikedMovieListService';
import { fetchCommentedMovies } from './CommentedMovieListService';

// Main function to get movie recommendations for a user
export const getRecommendations = async (userId) => {
  try {
    console.log(`Fetching recommendations for user: ${userId}`);
    const likedMovies = await fetchLikedMovies();
    console.log(`Liked movies:`, likedMovies);
    const commentedMovies = await fetchCommentedMovies();
    console.log(`Commented movies:`, commentedMovies);
    const watchlist = await fetchWatchlist();
    console.log(`Watchlist:`, watchlist);
    const alreadyWatchedList = await fetchAlreadyWatchedList();
    console.log(`Already watched movies:`, alreadyWatchedList);
    const popularMovies = await getComprehensiveRankedMovies();
    console.log(`Popular movies:`, popularMovies);

    // Combine watchlist and already watched list
    const excludedMovies = new Set([...likedMovies, ...commentedMovies, ...Array.from(watchlist.keys()), ...alreadyWatchedList]);
    console.log(`Excluded movies:`, excludedMovies);

    // Filter out the movies the user has already commented on, liked, is in watchlist, or already watched
    const recommendedMovies = popularMovies.filter(movie => !excludedMovies.has(movie.id));
    console.log(`Recommended movies:`, recommendedMovies);

    return recommendedMovies.length > 0 ? recommendedMovies[0] : null;
  } catch (error) {
    console.error(`Error fetching recommendations:`, error);
    return null;
  }
};

// Helper function to get popular movies based on box office, likes, comments, and Rotten Tomato rate
export const getComprehensiveRankedMovies = async () => {
  try {
    const Movie = Parse.Object.extend('Movie');
    const query = new Parse.Query(Movie);

    query.descending('boxOffice');
    const boxOfficeResults = await query.find();
    console.log(`Box Office Results:`, boxOfficeResults);

    query.descending('likes');
    const likesResults = await query.find();
    console.log(`Likes Results:`, likesResults);

    query.descending('comments');
    const commentsResults = await query.find();
    console.log(`Comments Results:`, commentsResults);

    query.descending('rottenTomatoRate');
    const rottenTomatoResults = await query.find();
    console.log(`Rotten Tomato Rate Results:`, rottenTomatoResults);

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
    console.log(`Sorted Movie IDs:`, sortedMovieIds);

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
