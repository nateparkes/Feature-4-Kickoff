import Parse from "parse";

export const getAllMovies = () => {
    const Movie = Parse.Object.extend("Movie");
    const query = new Parse.Query(Movie)
    return query.find().then((results) => {
        return results;
    });
    }
