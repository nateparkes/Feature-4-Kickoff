import Parse from 'parse';

export const fetchCommentedMovies = async () => {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    console.log("Not pulling commented movies data; user is not logged in.");
    return [];
  }

  const Comment = Parse.Object.extend('Comment');
  const query = new Parse.Query(Comment);
  query.equalTo('user', currentUser);
  query.include('movie'); // Include the movie object

  try {
    const results = await query.find();
    const commentedMovies = results.map(result => result.get('movie'));
    console.log(`Commented movies for user ${currentUser.id}: `, commentedMovies);
    return commentedMovies.map(movie => movie.id);
  } catch (error) {
    console.error(`Error getting commented movies:`, error);
    return [];
  }
};
