import Parse from 'parse';

// Function to like a comment
export const likeComment = async (commentId) => {
  // Define the Comment class
  const Comment = Parse.Object.extend("Comment");
  // Create a query to search for the comment by its ID
  const query = new Parse.Query(Comment);

  try {
    // Fetch the comment object by its ID
    const comment = await query.get(commentId);
    // Increment the "likes" count of the comment
    comment.increment("likes");
    // Save the updated comment object to the database
    const updatedComment = await comment.save();
    // Return the updated comment object
    return updatedComment;
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error liking comment:", error);
    throw error;
  }
};
