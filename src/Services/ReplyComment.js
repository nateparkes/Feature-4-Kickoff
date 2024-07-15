import Parse from 'parse';

export const replyToComment = async (commentId, author, reply) => {
  const Comment = Parse.Object.extend("Comment");
  const query = new Parse.Query(Comment);

  try {
    const comment = await query.get(commentId);

    // Create a new Reply object
    const Reply = Parse.Object.extend("Reply");
    const newReply = new Reply();

    // Set the fields for the new reply
    newReply.set("author", author);
    newReply.set("body", reply);
    newReply.set("comment", comment);

    // Save the new reply to the database
    const savedReply = await newReply.save();

    // Add the reply to the comment's replies relation
    const relation = comment.relation("replies");
    relation.add(savedReply);
    await comment.save();

    return savedReply;
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw error;
  }
};
