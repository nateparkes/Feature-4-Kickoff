import Parse from 'parse';

// Function to toggle like for a comment
export const likeComment = async (commentId, userId) => {
  const Comment = Parse.Object.extend("Comment");
  const Like = Parse.Object.extend("Like");
  const commentQuery = new Parse.Query(Comment);
  const likeQuery = new Parse.Query(Like);

  try {
    const comment = await commentQuery.get(commentId);
    likeQuery.equalTo("comment", comment);
    likeQuery.equalTo("user", Parse.User.createWithoutData(userId));

    const existingLike = await likeQuery.first();

    if (existingLike) {
      // If the user has already liked the comment, remove the like
      await existingLike.destroy();
      comment.increment("likes", -1);
    } else {
      // If the user has not liked the comment, add a like
      const newLike = new Like();
      newLike.set("comment", comment);
      newLike.set("user", Parse.User.createWithoutData(userId));
      await newLike.save();
      comment.increment("likes");
    }

    const updatedComment = await comment.save();
    return updatedComment;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};
