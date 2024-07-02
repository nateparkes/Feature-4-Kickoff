import Parse from "parse";

export const getAllMovies = () => {
    const Movie = Parse.Object.extend("Movie");
    // we create a new subclass of the Parse.Object for the Movie class (saving it in JS as the Movie const)
    const query = new Parse.Query(Movie)
    // we create a new query that will query for all objects of the Movie class.
    return query.find().then((results) => {
        return results;
    });
    }
