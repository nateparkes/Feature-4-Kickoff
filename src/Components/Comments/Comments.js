import React, { useState, useEffect } from "react";
import { addCommentForMovie } from "../../Services/AddComment";
import getComments from "../../Services/GetComments";
import { getAllMovies } from "../../Services/GetMoviesService";
import { likeComment } from "../../Services/LikeComment"; // Import the like comment service
import { replyToComment } from "../../Services/ReplyComment"; // Import the reply comment service
import { useLocation, useNavigate } from "react-router-dom";
import Parse from 'parse'; // needed this to get the logged in user's username
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';


const Comments = () => {
  const location = useLocation(); // to access the current location and its state
  const navigate = useNavigate(); // for programmatic navigation
  const { selectedMovie } = location.state || {}; // Destructuring selectedMovie from location state, with a fallback to an empty object

  const [comments, setComments] = useState([]); // State to hold the list of comments
  const [name, setName] = useState(""); // State to hold the name input value
  const [comment, setComment] = useState(""); // State to hold the comment input value
  const [reply, setReply] = useState(""); // State to hold the reply input value
  const [movies, setMovies] = useState([]); // State to hold the list of all movies
  const [likedComments, setLikedComments] = useState([]); // State to hold liked comments
  const [replyingTo, setReplyingTo] = useState(null); // State to hold the comment being replied to
  const [replies, setReplies] = useState({}); // State to hold replies for each comment

  // Set the name user state to match the currently logged in user
  useEffect(() => {
    const currentUser = Parse.User.current();
    if (currentUser) {
      setName(currentUser.get('firstName'));
      loadUserLikes(currentUser.id);
    }
  }, []);

  // Fetch comments on component mount if selectedMovie is defined
  useEffect(() => {
    if (selectedMovie) {
      // Fetch comments for the selected movie
      getComments(selectedMovie.id).then((comments) => {
        setComments(comments); // Update the comments state with the fetched comments
        comments.forEach(comment => fetchReplies(comment.id));
      });
    } else {
      // Fetch all movies if no movie is selected
      getAllMovies().then((movies) => {
        setMovies(movies); // Update the movies state with the fetched movies
      });
    }
  }, [selectedMovie]);

  // Load user likes for the current user
  const loadUserLikes = async (userId) => {
    const Like = Parse.Object.extend("Like");
    const query = new Parse.Query(Like);
    query.equalTo("user", Parse.User.createWithoutData(userId));
    query.include("comment");

    try {
      const results = await query.find();
      setLikedComments(results.map(like => like.get("comment").id));
    } catch (error) {
      console.error("Error loading user likes:", error);
    }
  };

  // Function to fetch replies for a comment
  const fetchReplies = async (commentId) => {
    const Comment = Parse.Object.extend("Comment");
    const commentQuery = new Parse.Query(Comment);
    const comment = await commentQuery.get(commentId);
    const relation = comment.relation("replies");
    const fetchedReplies = await relation.query().find();
    setReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: fetchedReplies,
    }));
  };

  // Function to handle the like action
  const handleLike = async (commentId) => {
    const currentUser = Parse.User.current();
    if (!currentUser) return;

    try {
      const updatedComment = await likeComment(commentId, currentUser.id);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
      setLikedComments((prevLikedComments) =>
        prevLikedComments.includes(commentId)
          ? prevLikedComments.filter((id) => id !== commentId)
          : [...prevLikedComments, commentId]
      );
    } catch (error) {
      console.error("Error liking comment:", error);

    }
  };

  // Function to handle the reply action
  const handleReply = async (event) => {
    event.preventDefault();
    if (!replyingTo) return;

    try {
      await replyToComment(replyingTo.id, name, reply);
      // Fetch the updated comments after adding a reply
      await fetchReplies(replyingTo.id);
      setReply(""); // Clear the reply input field
      setReplyingTo(null); // Reset the replyingTo state
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };

  const handleAddComment = async (event) => {
    event.preventDefault();
    try {
      await addCommentForMovie(selectedMovie.id, name, comment);
      // Fetch the updated comments after adding a new one
      const updatedComments = await getComments(selectedMovie.id);
      setComments(updatedComments);
      setComment(""); // Clear the comment input field
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleToggleReply = (comment) => {
    setReplyingTo(replyingTo?.id === comment.id ? null : comment);
    setReply(""); // Clear the reply input field when selecting a new comment to reply to
  };

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
            <button onClick={() => handleLike(comment.id)}>
              <FontAwesomeIcon icon={likedComments.includes(comment.id) ? faSolidHeart : faRegularHeart} />
              {comment.get("likes") || 0}
            </button>
            <button onClick={() => handleToggleReply(comment)}>
              Reply
            </button>
            {replyingTo && replyingTo.id === comment.id && (
              <form onSubmit={handleReply}>
                <input
                  type="text"
                  placeholder="Your reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)} // Update the reply state on input change
                />
                <button type="submit">Add Reply</button>
              </form>
            )}
            <ul>
              {replies[comment.id]?.map((reply) => (
                <li key={reply.id}>
                  <p>{reply.get("body")}</p>
                  <small>{reply.get("author")}</small>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
