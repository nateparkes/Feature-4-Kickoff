import Parse from "parse";

export const addCommentForMovie = (objectId, name, comment) => {
    const Comment = Parse.Object.extend("Comment");
    const newComment = new Comment();

    // Create a pointer to the Movie object
    const Movie = Parse.Object.extend("Movie");
    const moviePointer = new Movie();
    moviePointer.id = ObjectId;

    // Set the fields for the new comment
    newComment.set("author", name);
    newComment.set("body", comment);
    newComment.set("movie", moviePointer);

    // Save the new comment to the database
    return newComment.save().then(
        (result) => {
            // The new comment has been saved successfully
            return result;
        },
        (error) => {
            // There was an error saving the new comment
            throw error;
        }
    );
};