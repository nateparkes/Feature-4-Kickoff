import Parse from "parse";

 // Fetch watchlist
 async function fetchWatchlist () {
    const currentUser = Parse.User.current();
    if (!currentUser){
      console.log("Not pulling watchlist data; user is not logged in.")
      return; //if the user isn't logged in, the function ends here
    }
    const Watchlist = Parse.Object.extend("Watchlist"); //creates a local representation of the Watchlist class in the backend
    const query = new Parse.Query(Watchlist); //creates a parse query targeting the Watchlist class
    query.equalTo("user", currentUser); //filters the query to only retrieve results with a "user" property that matches the current user
    query.equalTo("wantToWatch",true);//filters the query to only retrieve results when the "watchToWatch" column is true
    const results = await query.find(); // saves the query results (using await to pause until this is done)
    const WatchlistMap = new Map(); //creates a new map to store the retrieved results
    results.forEach((item) => {
      WatchlistMap.set(item.get("movie").id,item.get("wantToWatch"));
    }); // loops through each each item in the results array, setting the key as the movie's id, and th evalue as the boolean "watchToWatch" value
    return WatchlistMap
  }

   // Handle checkbox change
  //declare function that takes two parameters -- the movie object, and the boolean value of whether the box is already checked
  const toggleWatchlistStatus = async (movie, checked) => {

    //create a representation of the Watchlist class from our backend
    const Watchlist = Parse.Object.extend("Watchlist");

    //creates a query, and adds 2 restraints:
    const query = new Parse.Query(Watchlist);
    query.equalTo("user", Parse.User.current()); //the user property much match the current user
    query.equalTo("movie",movie); //the movie property must match the movie parameter passed to the function

    let watchlistItem = await query.first();//retrieves the first object that meets the restraints (there should only be 1 object possible at most)

    //if there's no data, then we create a new instances of the Watchlist class, add a new item to the representation with a user and movie value
    if (!watchlistItem) {
      watchlistItem = new Watchlist();
      watchlistItem.set("user", Parse.User.current());
      watchlistItem.set("movie",movie);
    }

    watchlistItem.set("wantToWatch", checked); // we set the boolean to true or false, depending on what was passed to the function
    await watchlistItem.save(); //we save the updated item to the backend
  };
  

  export { fetchWatchlist, toggleWatchlistStatus }