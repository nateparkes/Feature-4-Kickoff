import React from "react";
import Parse from "parse";

const WatchlistCheckbox = ({ movie, onCheckboxChange, watchlist }) => { //this function expects to be passed the movie in question, the function for what to do when the checkbox is clicked, and the watchlist
    const currentUser = Parse.User.current();
    if (!currentUser) {
        return null;
    } // if the user isn't logged in or authenticated, the function stops here and the checkbox isn't shown

    const boxChecked = watchlist.get(movie.id) || false; //the boxChecked const is true if watchlist.get(movie.id) exists (the movie is already on the watchlist), or it is set to false; this makes false the default

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={boxChecked} // box is checked if movie is already on the Watchlist, else it is unchecked (false)
                    onChange={(e) => onCheckboxChange(movie, e.target.checked)} //this runs the handleCheckboxChange function from Main.js, passing it the movie, and the true/false status of the target (the checkbox)
                />
                Add to Watchlist
            </label>
        </div>
    )
}

export default WatchlistCheckbox;