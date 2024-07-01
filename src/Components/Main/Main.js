import React, { useState, useEffect } from "react";
import { getAllMovies } from "../../Services/GetMoviesService";
import { addCommentForMovie } from "../../Services/AddComment";
import getComments from "../../Services/GetComments";
import MainList from "./MainList";

const Main = () => {
  const [movies, setMovies] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [sortKey, setSortKey] = useState("rotten_tomatoes_rating");

  // Fetch movies on component mount
  useEffect(() => {
    getAllMovies().then((movies) => {
      setMovies(movies);
    });
  }, []);

  // Handle movie selection
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    getComments(movie.id).then((comments) => {
      setComments(comments);
    });
  };

  // Handle adding a new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (selectedMovie) {
      addCommentForMovie(selectedMovie.id, name, comment).then((newComment) => {
        setComments([...comments, newComment]);
        setName("");
        setComment("");
      });
    }
  };

  // Handle sorting change
  const handleSortChange = (e) => {
    setSortKey(e.target.value);
    const sortedMovies = [...movies].sort((a, b) => {
      if (e.target.value === "rotten_tomatoes_rating") {
        return b.get("rotten_tomatoes_rating") - a.get("rotten_tomatoes_rating");
      } else {
        return b.get("total_domestic_box_office") - a.get("total_domestic_box_office");
      }
    });
    setMovies(sortedMovies);
  };

  return (
    <div>
      <h2>  Movies from 1999</h2>
      <label>
            Sort by:
        <select value={sortKey} onChange={handleSortChange}>
          <option value="rotten_tomatoes_rating">Rating</option>
          <option value="total_domestic_box_office">Box Office</option>
        </select>
      </label>
      <MainList movies={movies} onSelect={handleMovieSelect} />
      {selectedMovie && (
        <>
          <h2>Comments for {selectedMovie.get("title")}</h2>
          <form onSubmit={handleAddComment}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Add Comment</button>
          </form>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                <p>{comment.get("body")}</p>
                <small>{comment.get("author")}</small>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Main;
