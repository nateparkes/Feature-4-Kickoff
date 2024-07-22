import React, { useState, useEffect } from "react";
import Parse from "parse";
import { fetchWatchlist , toggleWatchlistStatus } from "../../Services/WatchlistService";
import { fetchAlreadyWatchedList, toggledAlreadyWatched } from "../../Services/AlreadyWatchedService";
import { Button, Checkbox, FormControlLabel } from "@mui/material";

const WatchlistDisplay = () => {
    //create a state for the movies, the user's watchlist, and the already watched movies
    const [watchlist, setWatchlist] = useState(new Map());
    const [alreadyWatchedList, setAlreadyWatchedList] = useState(new Map());
    const [movies, setMovies] = useState([]);
    const [alreadyWatchedMovies, setAlreadyWatchedMovies] = useState([]);

    //fetch the watchlist when the component mounts, using the watchlist service
useEffect(() => {
    async function loadLists() { // declare a new function
        const watchlistMap = await fetchWatchlist(); //store the results of the fetchWatchlist function
        const alreadyWatchedMap = await fetchAlreadyWatchedList(); //store the result of the fetchAlreadyWatchedList function
        setWatchlist(watchlistMap); //update the state with the results fetchWactchlist
        setAlreadyWatchedList(new Map(alreadyWatchedMap.map(id => [id,true])));

        //fetch movie details

        const movieQueries = Array.from(new Set([...watchlistMap.keys(), ...alreadyWatchedMap])).map(id => {
            const Movie = Parse.Object.extend("Movie");
            const query = new Parse.Query(Movie);
            return query.get(id);
          });

        const movieResults = await Promise.all(movieQueries);
        setMovies(movieResults.filter(movie => watchlistMap.has(movie.id))); //update the state with the movies fetched by the fetchWatchlist function (it's an object, so we use .has)
        setAlreadyWatchedMovies(movieResults.filter(movie => alreadyWatchedMap.includes(movie.id))); // update the state with the movies fetched by the fetchAlreadyWatchedList function  (it's an array, so we use .includes)
    }
    loadLists();
}, []);

//handle the checkbox change
 const handleCheckboxChange = async (movie, checked) => { //declare an aysnc function that accepts "movie" and "checked" (boolean) as arguments
    await toggleWatchlistStatus(movie,checked); //await the watchlist data service
    setWatchlist(new Map(watchlist.set(movie.id,checked))); //update the watchlist state with a Map of the results
    if (!checked) {
        setMovies(movies.filter(m => m.id !== movie.id));
    }//if the checkbox is now false (unchecked), we create a new array excluding this movie, and update the state with the array (removing it from the Watchlist)
};

const handleAlreadyWatchedCheckboxChange = async (movie, watched) => {//declare an async function that accepted the "movie" and "watched" status of that movie
    await toggledAlreadyWatched(movie,watched);//we run the function to flip the boolean status of "watched" and await the outcome
    setAlreadyWatchedList(new Map(alreadyWatchedList.set(movie.id, watched)));//creates a new version of the alreadyWatchedList that adds or updates the movie.id key and watched value
    if (watched) {
        setMovies(movies.filter(m => m.id !== movie.id));//if the user marks the movie as watched, we remove it from the watchlist and update the state
        setAlreadyWatchedMovies([...alreadyWatchedMovies, movie]);//then we spread the new movie into the list of already watched movies and update the state
    } else {
        setAlreadyWatchedMovies(alreadyWatchedMovies.filter(m => m.id !== movie.id));//if the box is being unchecked, we remove it from the list of watched movies
    }
};

  return (
    <div className="container">
      <h2>Your Watchlist</h2>
      {movies.length > 0 ? (
        <ul className="list">
          {movies.map((movie) => (
            <li key={movie.id} className="listItem">
              <div className="movieCard">
                <h3 className="title">{movie.get("title")}</h3>
                <Button 
                  className="button"
                  variant="contained"
                  color="primary"
                  component="a"
                  href={movie.get("amazon_link")}
                  target="_blank"
                  rel="noopener noreferrer">
                    Watch now
                </Button>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={watchlist.get(movie.id) || false}
                      onChange={(e) => handleCheckboxChange(movie, e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Keep in Watchlist"
                />
                <FormControlLabel
                  control={
                    <Checkbox   
                    checked={alreadyWatchedList.get(movie.id) || false}
                    onChange={(e) => handleAlreadyWatchedCheckboxChange(movie, e.target.checked)}
                    color="primary"
                  />
                  }
                  label="I've watched this"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No movies in your watchlist</p>
      )}
            <h2>Already Watched</h2>
      {alreadyWatchedMovies.length > 0 ? (
        <ul className="list">
          {alreadyWatchedMovies.map((movie) => (
            <li key={movie.id} className="listItem">
              <div className="movieCard">
                <h3 className="title">{movie.get("title")}</h3>
                <FormControlLabel
                  control={
                    <Checkbox   
                    checked={alreadyWatchedList.get(movie.id) || false}
                    onChange={(e) => handleAlreadyWatchedCheckboxChange(movie, e.target.checked)}
                    color="primary"
                  />
                  }
                  label="I've watched this"
                />
                                <Button 
                  className="button"
                  variant="contained"
                  color="primary"
                  component="a"
                  href={movie.get("amazon_link")}
                  target="_blank"
                  rel="noopener noreferrer">
                    Watch again
                </Button>

              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No movies watched yet</p>
      )}
    </div>
  );
};

export default WatchlistDisplay;