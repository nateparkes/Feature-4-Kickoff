import React, { useState, useEffect } from "react";
import { getAllMovies } from "../../Services/GetMoviesService";
import MainList from "./MainList";
import { useNavigate } from "react-router-dom";
import { fetchWatchlist, toggleWatchlistStatus } from "../../Services/WatchlistService";
import { Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const Main = () => {
//manage the state of movies, selectedMovie, and sortKey
  const [movies, setMovies] = useState([]); //State to hold the list of movies
  const [selectedMovie, setSelectedMovie] = useState(null); //// State to hold the currently selected movie
  const [sortKey, setSortKey] = useState("rotten_tomatoes_rating"); // State to hold the current sorting key
  const [watchlist, setWatchlist] = useState(new Map()); //creates empty Map to hold watchlist data
  const navigate = useNavigate(); // for programmatic navigation

  // Fetch movies on component mount
  useEffect(() => {
    getAllMovies().then((movies) => {
      setMovies(movies);
    });
    fetchWatchlist();
  }, []);

  // Handle movie selection
  const handleMovieSelect = (movie) => {
    const movieData = {
      id: movie.id,
      title: movie.get("title"),
      rotten_tomatoes_rating: movie.get("rotten_tomatoes_rating"),
      total_domestic_box_office: movie.get("total_domestic_box_office"),
    };
    setSelectedMovie(movieData);// Update the selectedMovie state with the selected movie data
  };

  // Handle sorting change
  const handleSortChange = (e) => {
    setSortKey(e.target.value);
    // Sort the movies array based on the selected sort key
    const sortedMovies = [...movies].sort((a, b) => {
      if (e.target.value === "rotten_tomatoes_rating") {
        return b.get("rotten_tomatoes_rating") - a.get("rotten_tomatoes_rating");
      } else {
        return b.get("total_domestic_box_office") - a.get("total_domestic_box_office");
      }
    });
    setMovies(sortedMovies);// Update the movies state with the sorted movies
  };

  // Handle checkbox change
  const handleCheckboxChange = async (movie, checked) => { //declare an aysnc function that accepts "movie" and "checked" (boolean) as arguments
    await toggleWatchlistStatus(movie,checked); //await the watchlist data service
    setWatchlist(new Map(watchlist.set(movie.id,checked))); //update the watchlist state with a Map of the results
  };
 

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <h2 style={{ margin: 10 }}>Movies from 1999</h2>
        <FormControl variant="outlined" sx={{ minWidth: 120, marginBottom: 2 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortKey}
            onChange={handleSortChange}
            label="Sort by"
          >
            <MenuItem value="rotten_tomatoes_rating">Rating</MenuItem>
            <MenuItem value="total_domestic_box_office">Box Office</MenuItem>
          </Select>
        </FormControl>
      </div>
      <MainList
        movies={movies}
        onSelect={handleMovieSelect} 
        onCheckboxChange={handleCheckboxChange}
        watchlist={watchlist}
        /> {/* Render the MainList component with movies and onSelect handler */}
      {selectedMovie && (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/comments", { state: { selectedMovie } })}>
            View All Comments
          </Button> {/* Button to navigate to the comments page with the selected movie data */}
        </div>
      )}
    </div>
  );
};

export default Main;
