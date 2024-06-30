export default function FooterList({ comments }) {
    return (
        <div>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                <p>{comment.text}</p>
                <small>{new Date(comment.date).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      );
    };