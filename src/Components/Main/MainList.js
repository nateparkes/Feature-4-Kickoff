import {useState, useEffect} from "react";
import { getAllLessons } from "../../Services/LearnService";
import { getAllMovies } from "../../Services/GetMoviesService";

const MainList = () => {
    const [lessons, setLessons] = useState([]);
    const [movies, setMovies] = useState([]);

    useEffect(()=>{
        getAllLessons().then((lessons) => {
            setLessons(lessons);
        })
    },[]);

    useEffect(()=>{
        getAllMovies().then((movies)=> {
            setMovies(movies);
        })
    },[]);

    return(
        <div>
            <hr />
            This is part 1 of the main list parent component: Lessons!
            <div>
                { lessons.length > 0 && (
                    <ul>
                        {lessons.map((lesson) => (
                            <div>
                                <span>
                                    <li key={lesson.objectId}>{lesson.get("name")}</li>
                                </span>
                            </div>
                        ))}
                    </ul>
                ) }
            </div>
            <hr />
            This is part 2 of the main list parent component: Movies from 1999!
            <div>
                { movies.length > 0 && (
                    <ul>
                        {movies.map((movie) => (
                            <div>
                                <span>
                                    <li key={movie.objectId}>{movie.get("title")} has a {movie.get("rotten_tomatoes_rating")}% fresh rating on RT</li>
                                </span>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default MainList;
