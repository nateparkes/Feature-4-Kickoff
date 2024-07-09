export default function FooterChild({
  handleCommentSubmit,
  commentText,
  setCommentText,
  comments,
}) {
  const handleInputChange = (event) => {
    setCommentText(event.target.value);
  };

  return (
      <fieldset id="commentFieldset">
        <legend>Cast your vote:</legend>
        <form id="commentForm" onSubmit={handleCommentSubmit}>
          <label htmlFor="commentText">What's your favorite movie from 1999?</label><br />
          <input
            type="text"
            id="commentText"
            name="commentText"
            value={commentText}
            onChange={handleInputChange}
            required
          /><br />
          <button type="submit">Submit</button><br />
        </form>
      </fieldset>
  );
};

//this component creates the virtual HMTL for the comment submission form
//it also serves as the partent to CommentList, since it's including the CommentList component
//in the html, and passing it the comments array as a prop (which was passed to FooterChild by FooterParent)
