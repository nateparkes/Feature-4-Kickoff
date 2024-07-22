import React from "react";
import Parse from "parse";
import { Checkbox, FormControlLabel } from "@mui/material";

const WatchlistCheckbox = ({ movie, onCheckboxChange, watchlist }) => { //this function expects to be passed the movie in question, the function for what to do when the checkbox is clicked, and the watchlist
    const currentUser = Parse.User.current();
    if (!currentUser) {
        return null;
    } // if the user isn't logged in or authenticated, the function stops here and the checkbox isn't shown

    const boxChecked = watchlist.get(movie.id) || false; //the boxChecked const is true if watchlist.get(movie.id) exists (the movie is already on the watchlist), or it is set to false; this makes false the default

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={boxChecked}
                    onChange={(e) => onCheckboxChange(movie, e.target.checked)}
                    color="primary" 
                />
            }
            label="Add to Watchlist"
        />
    );
};

export default WatchlistCheckbox;