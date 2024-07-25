import Parse from 'parse';

export const addCommentForMovie = async (objectId, userId, comment) => {
  const Comment = Parse.Object.extend("Comment");
  const newComment = new Comment();

  // Create a pointer to the Movie object
  const Movie = Parse.Object.extend("Movie");
  const moviePointer = new Movie();
  moviePointer.id = objectId;

  // Get the current logged-in user
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("User not logged in");
  }

  // Set the fields for the new comment
  newComment.set("user", currentUser); // Link the comment to the current user
  newComment.set("body", comment);
  newComment.set("movie", moviePointer);

  // Save the new comment to the database
  try {
    const result = await newComment.save();
    return result;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
