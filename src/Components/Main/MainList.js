import React from "react";
import { useNavigate } from "react-router-dom";
import './MainList.css';
import WatchlistCheckbox from "./WatchlistCheckbox";
import { Button } from "@mui/material";

const MainList = ({ movies, onSelect, onCheckboxChange, watchlist }) => {
  const navigate = useNavigate(); // for programmatic navigation

  return (
    <div className="container">
      {movies.length > 0 ? ( // Check if there are any movies to display
        <ul className="list">  {/* Unordered list with CSS class 'list' */}
          {movies.map((movie) => ( // Loop through the movies array
            <li key={movie.id} className="listItem">
              <div className="movieCard"> {/* Div for movie card with CSS class 'movieCard' */}
                <h3 className="title">{movie.get("title")}</h3>
                <p className="rating">{movie.get("rotten_tomatoes_rating")}% on Rotten Tomatoes</p>
                <p className="boxOffice">${movie.get("total_domestic_box_office").toLocaleString()} domestic box office total</p>
                <div className="buttonContainer">
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
                <Button className="button" variant="contained" onClick={() => navigate("/comments", { state: { selectedMovie: { id: movie.id, title: movie.get("title") } } })}>View Comments</Button>
                </div>
                <WatchlistCheckbox // adding Watchlist checkbox, will be null if user isn't logged in
                  movie={movie}
                  onCheckboxChange={onCheckboxChange}
                  watchlist={watchlist}
                />
              </div>{/*  Button to navigate to comments page */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No movies available</p> // Message to display if there are no movies
      )}
    </div>
  );
};

export default MainList;
