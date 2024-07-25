# Changelog

## [Unreleased]
We discussed adding nav elements to the persistent footer
The "What's your favorite movie?" comment field is saved locally, but it isn't pushed to the back4app database. We could add that feature in the future.
We could add the ability to delete or modify comments, or add additional movies.

## [0.2.0] - 2024-07-01
### Added
* Data is pulled from back4app database using Parse instead of being pulled from local .json file
* added comments data linked to movies using pointers
* added the ability to add new comments to the back4app comments class
* added routing nav elements

### Changed
* styling changed from previous version to support new functionality


## [0.3.0] - 2024-07-07
### Added
* Create a ProtectedRoute component
* Create Auth.js, AuthService.js, AuthForm components
### Changed
* Modify the components.js: allow the user to access comments if checkUser returns true, and will otherwise direct the user to login.

## [0.4.0] - 2024-07-23
### Added for 6 user stories
* Service/LikeComment.js 
* Service/ReplyComment.js
* Service/RecmmendationService.js
* Services/CommentedMovieListServices.js
* Services/LikedMovieListServices.js
* WatchlistCheckbox.js and WatchlistDisplay.js
### Changed
* Components/Comments/Comments.js
* Components/Footer/Footer.js
* components.js
* main.js
* mainList.js
* mainList.css
* styles.css
* Index.css and index.js
