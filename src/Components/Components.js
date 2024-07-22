import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom"; // add Navigate

import AuthModule from "./Auth/Auth.js";
import AuthRegister from "./Auth/AuthRegister";
import AuthLogin from "./Auth/AuthLogin";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.js";
//importing the "ProtectedRoute" component created for Feature 5

import Main from "./Main/Main";
import Comments from "./Comments/Comments";
//Comments and Watchlist will be our "protected" Components
import Footer from "./Footer/Footer";
import WatchlistDisplay from "./Watchlist/WatchlistDisplay.js";

const Components = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">See movie list</Link> {/* Link to navigate to the Main component */}
            </li>
            <li>
              <Link to="/comments">See movie comments</Link> {/* Link to navigate to the Comments component */}
            </li>
            <li>
              <Link to="/watchlist">See your Watchlist</Link> {/* Link to navigate to the WatchlistDisplay component */}
            </li>
            <li>
              <Link to="/auth/login">Login to your user account</Link> {/* Link to navigate to the AuthLogin component */}
            </li>
            <li>
              <Link to="/auth/register">Register new user account</Link> {/* Link to navigate to the AuthRegister component */}
            </li>
            {/* Future feature ideas: add an element that shows an authenticated user their username in the nav bar, add a "log-out" capability*/}
          </ul>
        </nav>
        <Routes>
          <Route path="/auth" element={<AuthModule />} />
          <Route path="/auth/register" element={<AuthRegister />} />
          <Route path="/auth/login" element={<AuthLogin />} />
          <Route path="/" element={<Main />} /> {/* Route for the Main component */}
          <Route 
            path="/comments" 
            element={<ProtectedRoute path="/comments" element={Comments}/>} /> {/* Route for the Comments component */}
          <Route 
            path="/watchlist" 
            element={<ProtectedRoute path="/watchlist" element={WatchlistDisplay}/>} />
          <Route path="*" element={<Navigate to="/auth" replace />} /> {/* Set /auth as a default path */}
        </Routes>
        <Footer /> {/* Footer component, displayed on all pages */}
      </div>
    </Router>
  );
};

export default Components;
