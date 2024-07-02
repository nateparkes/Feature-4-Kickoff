import React from "react";
import { useNavigate } from "react-router-dom";
import './MainList.css';

const MainList = ({ movies, onSelect }) => {
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
                <a href={movie.get("amazon_link")} className="button" target="_blank" rel="noopener noreferrer">Watch now</a>
                <button className="button" onClick={() => navigate("/comments", { state: { selectedMovie: { id: movie.id, title: movie.get("title") } } })}>View Comments</button>
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
