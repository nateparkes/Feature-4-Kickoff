import React, { useState, useEffect } from "react";
import { getAllMovies } from "../../Services/GetMoviesService";
import MainList from "./MainList";
import { useNavigate } from "react-router-dom";

const Main = () => {
//manage the state of movies, selectedMovie, and sortKey
  const [movies, setMovies] = useState([]); //State to hold the list of movies
  const [selectedMovie, setSelectedMovie] = useState(null); //// State to hold the currently selected movie
  const [sortKey, setSortKey] = useState("rotten_tomatoes_rating"); // State to hold the current sorting key
  const navigate = useNavigate(); // for programmatic navigation

  // Fetch movies on component mount
  useEffect(() => {
    getAllMovies().then((movies) => {
      setMovies(movies);
    });
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

  return (
    <div>
      <h2>Movies from 1999</h2>
      <label>
        Sort by:
        <select value={sortKey} onChange={handleSortChange}> {/* Dropdown to select sorting key */}
          <option value="rotten_tomatoes_rating">Rating</option>
          <option value="total_domestic_box_office">Box Office</option>
        </select>
      </label>
      <MainList movies={movies} onSelect={handleMovieSelect} /> {/* Render the MainList component with movies and onSelect handler */}
      {selectedMovie && (
        <div>
          <button onClick={() => navigate("/comments", { state: { selectedMovie } })}>
            View All Comments
          </button> {/* Button to navigate to the comments page with the selected movie data */}
        </div>
      )}
    </div>
  );
};

export default Main;
