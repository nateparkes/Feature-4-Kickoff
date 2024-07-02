import Parse from "parse";
//import Parse so we have the parse object and its methods

const getComments = (objectId) => {
    // we declare a function that takes the argument "objectID" -- this should be equal to the objectId of the movie the user has clicked on

    const Comment = Parse.Object.extend("Comment");
    const query = new Parse.Query(Comment);

    //create a new subclass of the parse object, and create a new instance of Parse.query for the comment class in back4app

    const Movie = Parse.Object.extend("Movie");
    //since we want to filter specifically for objects that contain a pointer to a Movie class objectID, we create a subclass of the Parse object for the Movie class

    const moviePointer = new Movie();
    // we create a new instance of the Movie class using a Parse method, and save it as "moviePointer"

    moviePointer.id = objectId;
    //we set the moviePoint's id attribute to the objectId argument supplied to the function

    query.equalTo("movie", moviePointer);
    // we set the value of the "equalTo" attribute of the query variable, setting a condition to the query, where we only query for objects that have a "movie" attribute equal to the ObjectId passed to the function

    return query.find().then((results) => {
        return results;
    });
};

export default getComments;