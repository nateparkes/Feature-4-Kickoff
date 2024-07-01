import React from "react";
import './MainList.css';

const MainList = ({ movies, onSelect }) => {
  return (
    <div className="container">
      {movies.length > 0 ? (
        <ul className="list">
          {movies.map((movie) => (
            <li key={movie.id} className="listItem" onClick={() => onSelect(movie)}>
              <div className="movieCard">
                <h3 className="title">{movie.get("title")}</h3>
                <p className="rating">{movie.get("rotten_tomatoes_rating")}% on Rotten Tomatoes</p>
                <p className="boxOffice">${movie.get("total_domestic_box_office").toLocaleString()} domestic box office total</p>
                <a href={movie.get("amazon_link")} className="button" target="_blank" rel="noopener noreferrer">Watch now</a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No movies available</p>
      )}
    </div>
  );
};

export default MainList;
