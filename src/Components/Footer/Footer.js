import {useState, useEffect} from "react";
import FooterField from "./FooterField";
import FooterList from "./FooterList";
 
 export default function Footer() {
   //
   const [comments, setComments] = useState([]);
   const [commentText, setCommentText] = useState("");
   // we create two user states -- one for updating our list of submitted comments
   //and the otehr for clearing the "Your comment" field once a comment has been submitted
 
   const handleCommentSubmit = (event) => {
     event.preventDefault(); //we prevent the default behavior of the submit button (since we're not sending the submission to a server)
     const newComment = { text: commentText, date: new Date().toISOString() };
     // we create a newComment object containing the submitted comment and the data it was submitted
     setComments([...comments, newComment]);
     // we push (spread?) the newComment into the comments user state
     setCommentText("");
     // we clear the commentText user state, which clears the submission text field
   };
   //
   return (
       <div className="App">
       <FooterField
         handleCommentSubmit={handleCommentSubmit}
         commentText={commentText}
         setCommentText={setCommentText}
       />
       <FooterList
         comments={comments}
       />
     </div>
   );
};