import Parse from "parse";

async function fetchAlreadyWatchedList() {

    //first, check if the user is authenticated; if not, end the function
    const currentUser = Parse.User.current();
    if (!currentUser) {
        console.log("Not pulling already watched data; user not logged in")
        return [];
    }
const Watchlist = Parse.Object.extend("Watchlist"); // create a representation of the backend watchlist
const query = new Parse.Query(Watchlist); // create a new query for the representation
query.equalTo("user",currentUser); //filter only for items that have the current user as a pointer
query.equalTo("watched",true); //filter only for items that have "watched" as true
const results = await query.find();
return results.map(item => item.get("movie").id);
} // await the results of the query, and then map them to an array

const toggledAlreadyWatched = async (movie,watched) => {
    const Watchlist = Parse.Object.extend("Watchlist"); // create a representation of the backend watchlist
    const query = new Parse.Query(Watchlist); //create a new query
    query.equalTo("user",Parse.User.current()); //filter only for items that have the current user as a pointer
    query.equalTo("movie",movie) //filter only for the movie that was passed to the function

    let watchlistItem = await query.first(); //wait for the query to find the first instance; there should only be one
    if (!watchlistItem) {
        watchlistItem = new Watchlist();
        watchlistItem.set("user",Parse.User.current());
        watchlistItem.set("movie",movie);
    } // if the query finds nothing, create a new entry in the Watchlist data class, with the current movie and user as pointers

    watchlistItem.set("watched",watched);//set the value of the "watched" property to match the boolean passed to the function
    await watchlistItem.save();//save this update to the backend
};

export { fetchAlreadyWatchedList, toggledAlreadyWatched };