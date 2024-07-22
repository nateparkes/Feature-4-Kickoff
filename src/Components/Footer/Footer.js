import { useState, useEffect } from "react";
import FooterField from "./FooterField";
import FooterList from "./FooterList";
import Parse from 'parse';
import { getRecommendations, getComprehensiveRankedMovies } from '../../Services/RecommendationService';

export default function Footer() {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const currentUser = Parse.User.current();

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const newComment = { text: commentText, date: new Date().toISOString() };
    setComments([...comments, newComment]);
    setCommentText("");
  };

  useEffect(() => {
    if (currentUser) {
      console.log(`Fetching recommendation for current user: ${currentUser.id}`);
      getRecommendations(currentUser.id).then((movie) => {
        console.log(`Movie fetched:`, movie);
        setRecommendation(movie);
      }).catch(error => {
        console.error(`Error fetching recommendation:`, error);
      });
    } else {
      console.log(`Fetching popular movie for guest user`);
      getComprehensiveRankedMovies().then((movies) => {
        console.log(`Popular movies fetched:`, movies);
        setRecommendation(movies.length > 0 ? movies[0] : null);
      }).catch(error => {
        console.error(`Error fetching popular movies:`, error);
      });
    }
  }, [currentUser]);

  return (
    <div className="App">
      <hr />
      {recommendation && (
        <div>
          <h3>{currentUser ? `${currentUser.get('firstName')}, Movie You May Like` : "Movie You May Like"}</h3>
          <button
            onClick={() => window.open(recommendation.get('amazon_link'), '_blank', 'noopener,noreferrer')}
            className="button"
          >
            {recommendation.get('title')}
          </button>
        </div>
      )}

      <FooterField
        handleCommentSubmit={handleCommentSubmit}
        commentText={commentText}
        setCommentText={setCommentText}
      />
      <FooterList comments={comments} />
    </div>
  );
}
