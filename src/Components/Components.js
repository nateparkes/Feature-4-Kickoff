import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Main from "./Main/Main";
import Comments from "./Comments/Comments";
import Footer from "./Footer/Footer";

const Components = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Main</Link> {/* Link to navigate to the Main component */}
            </li>
            <li>
              <Link to="/comments">Comments</Link> {/* Link to navigate to the Comments component */}
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Main />} /> {/* Route for the Main component */}
          <Route path="/comments" element={<Comments />} /> {/* Route for the Comments component */}
        </Routes>
        <Footer /> {/* Footer component, displayed on all pages */}
      </div>
    </Router>
  );
};

export default Components;
