import React from "react";
import { useNavigate } from "react-router-dom";
//the useNavigate hook allows us to manipulate the routes to change the component/location being rendered on the app
import { checkUser } from "../Auth/AuthService";
// INTEGRATE NOTE ^ this assumes the name and location of the "check user" that returns TRUE if the user is authenticated

const ProtectedRoute = ({ element: Component, ...rest }) => {
    //we declare the component to accept an element prop (which we destructure as "Component" for clarity) use "...rest" to accept any other number of props.
    console.log("element: ", Component);
    //we log the string "element: " and then log the element prop passed to the function, which is referred to as Component
    const navigate = useNavigate();
    //we delcare an instance of the useNavigate hook, which will allow us to pass a route to "navigate" as a prop
    const notAuthHandler = () => {
        //we declare a new function called "notAuthHandler" which navigate the user to the Auth component if they click the button when denied access
        navigate("/auth");
        //when notAuthHandler is called within the Components.js, it will navigate the user to the /auth route delcared there.
    };
    const mainReturnHandler = () => {
        navigate("/");
        //this function navigates the user to the unprotected main component if they choose not to authenticate
    };
    if (checkUser()) {
        //we call the imported checkUser function as a condition of an if/then statement to only route to protected content if the user is authenticated
        return <Component />;
        //if the user is authenticated, we return the component that was passed to the ProtectedRoute function
    } else {
        return (
            <div>
              <p>You haven't supplied recognized user credentials. To view comments or your Watchlist, you must be logged in to your registered user account.</p>
              <button onClick={notAuthHandler}>Login/register</button><br/>
              <button onClick={mainReturnHandler}>Return to movie list</button>
            </div>
          );
          //if the user tries to access a protected route (comments) without being authenticaated, they are told they need to login or register, and are given the option to either login/register (going to the Auth component) or return to the main list (going to the main component )
    };
};


export default ProtectedRoute;