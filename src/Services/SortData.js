export default function SortData(movies, key) {
    // Check if the input is an array
    if (!Array.isArray(movies)) {
      console.error("Data provided to SortData is not an array:", movies);
      return movies;
    }
  
    // sort the movies by the titles in alphabetical order
    // or sort the movies by rotten_tomatoes_rating in descending order
    return [...movies].sort((a, b) => {
      if (key === "title") {
        return a.title.localeCompare(b.title);
      }
      //localeCompare: compare two strings in a locale-sensitive manner
      if (key === "rating") {
        return b.rotten_tomatoes_rating - a.rotten_tomatoes_rating;
      }
      return 0;
    });
  }
  //When b is greater than a, b - a is positive, so b comes before a.
  //When b is less than a, b - a is negative, so a comes before b.
  //When b and a are equal, b - a is zero, so their order remains unchanged.
  