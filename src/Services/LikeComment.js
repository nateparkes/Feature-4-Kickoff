import Parse from 'parse';

export const likeComment = async (commentId) => {
  const Comment = Parse.Object.extend("Comment");
  const query = new Parse.Query(Comment);

  try {
    const comment = await query.get(commentId);
    comment.increment("likes");
    const updatedComment = await comment.save();
    return updatedComment;
  } catch (error) {
    console.error("Error liking comment:", error);
    throw error;
  }
};
