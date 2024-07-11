import React, { useState, useEffect } from "react";
import { addCommentForMovie } from "../../Services/AddComment";
import getComments from "../../Services/GetComments";
import { getAllMovies } from "../../Services/GetMoviesService";
import { useLocation, useNavigate } from "react-router-dom";
import Parse from 'parse'; // needed this to get the logged in user's username

const Comments = () => {
  const location = useLocation(); //to access the current location and its state
  const navigate = useNavigate(); //for programmatic navigation
  const { selectedMovie } = location.state || {}; // Destructuring selectedMovie from location state, with a fallback to an empty object

  const [comments, setComments] = useState([]); // State to hold the list of comments
  const [name, setName] = useState(""); // State to hold the name input value
  const [comment, setComment] = useState("");// State to hold the comment input value
  const [movies, setMovies] = useState([]);// State to hold the list of all movies

  //New for feature 6; let's set the name userstate to match the currently logged in user
  useEffect(() => {
    const currentUser = Parse.User.current();
    // we declare new variable "currentUser" and set it's value to the currently logged in user (using Parse function)
    if (currentUser) { //check to see if currentUser was successfully set (Parse.User.current() was not false or null)
      setName(currentUser.get('username'));
    }
  },[]);


  // Fetch comments on component mount if selectedMovie is defined
  useEffect(() => {
    if (selectedMovie) {
     // Fetch comments for the selected movie
      getComments(selectedMovie.id).then((comments) => {
        setComments(comments);// Update the comments state with the fetched comments
      });
    } else {
     // Fetch all movies if no movie is selected
      getAllMovies().then((movies) => {
        setMovies(movies);// Update the movies state with the fetched movies
      });
    }
  }, [selectedMovie]); // Dependency array includes selectedMovie to refetch comments when it changes

  // Handle adding a new comment
  const handleAddComment = (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (selectedMovie) { // Add a comment for the selected movie
      addCommentForMovie(selectedMovie.id, name, comment).then((newComment) => {
        setComments([...comments, newComment]); // Update the comments state with the new comment
        // setName(""); // Reset the name input // Deleted for Feature 6 becuase the name should stay as username
        setComment("");// Reset the comment input
      });
    }
  };

// If no movie is selected, render a list of all movies to select from
  if (!selectedMovie) {
    return (
      <div>
        <h2>Select a movie to view comments</h2>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              <button onClick={() => navigate("/comments", { state: { selectedMovie: { id: movie.id, title: movie.get("title") } } })}>
                {movie.get("title")}
              </button> {/* Button to navigate to comments page with selected movie*/}
            </li>
          ))}
        </ul>
      </div>
    );
  }

// If a movie is selected, render the comments section for that movie
  return (
    <div>
      <h2>Comments for {selectedMovie.title}</h2> {/* Header displaying the selected movie's title */}
      <form onSubmit={handleAddComment}>
        {/* eliminated this input for Feature 6
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update the name state on input change
        /> */}
        <h2></h2>
        <input
          type="text"
          placeholder="Your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)} // Update the comment state on input change
        />
        <button type="submit">Add Comment</button>
      </form>
      <ul> {/* Display the comments */}
        {comments.map((comment, index) => (
          <li key={index}>
            <p>{comment.get("body")}</p>
            <small>{comment.get("author")}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
