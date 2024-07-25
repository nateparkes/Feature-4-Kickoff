import Parse from 'parse';

export const fetchLikedMovies = async () => {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    console.log("Not pulling liked movies data; user is not logged in.");
    return [];
  }

  const Like = Parse.Object.extend('Like');
  const query = new Parse.Query(Like);
  query.equalTo('user', currentUser);
  query.include('movie'); // Include the movie object

  try {
    const results = await query.find();
    const likedMovies = results.map(result => {
      const movie = result.get('movie');
      console.log(`Fetched movie: `, movie); // Debug log
      return movie;
    });
    console.log(`Liked movies for user ${currentUser.id}: `, likedMovies);
    return likedMovies.map(movie => movie.id);
  } catch (error) {
    console.error(`Error getting liked movies:`, error);
    return [];
  }
};
