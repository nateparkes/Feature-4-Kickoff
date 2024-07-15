import { useState, useEffect } from "react";
import FooterField from "./FooterField";
import FooterList from "./FooterList";
import Parse from 'parse';
import { getRecommendations } from '../../Services/RecommendationService';

export default function Footer() {
  // State to hold the list of comments
  const [comments, setComments] = useState([]);
  // State to hold the text of a new comment being typed
  const [commentText, setCommentText] = useState("");
  // State to hold the list of recommended movies
  const [recommendations, setRecommendations] = useState([]);
  // Get the current logged-in user
  const currentUser = Parse.User.current();

  // Function to handle the submission of a new comment
  const handleCommentSubmit = (event) => {
    event.preventDefault(); // Prevent default behavior of the submit button
    const newComment = { text: commentText, date: new Date().toISOString() }; // Create a new comment object
    setComments([...comments, newComment]); // Add new comment to the list of comments
    setCommentText(""); // Clear the comment input field
  };

  // useEffect hook to fetch recommendations when the component mounts and when the current user changes
  useEffect(() => {
    if (currentUser) {
      // Fetch recommendations for the current user
      getRecommendations(currentUser.id).then((movies) => {
        setRecommendations(movies); // Update the recommendations state
      });
    }
  }, [currentUser]);

  return (
    <div className="App">
      <hr />
      {/* Component to handle the comment submission form */}
      <FooterField
        handleCommentSubmit={handleCommentSubmit}
        commentText={commentText}
        setCommentText={setCommentText}
      />
      {/* Component to display the list of comments */}
      <FooterList comments={comments} />
      {/* Display the list of recommended movies if there are any */}
      {recommendations.length > 0 && (
        <div>
          <h3>Movies You May Like</h3>
          <ul>
            {recommendations.map((movie) => (
              <li key={movie.id}>
                {/* Button to open the Amazon link for the recommended movie */}
                <button
                  onClick={() => window.open(movie.get('amazon_link'), '_blank', 'noopener,noreferrer')}
                  className="button"
                >
                  {movie.get('title')} {/* Display the movie title on the button */}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
