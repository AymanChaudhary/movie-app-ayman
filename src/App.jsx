import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [SearchTerm, setSearchTerm] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [MovieList, setMovieList] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endPoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      if (data.Response === "false") {
        setErrorMessage(data.Error || "Failed to fetch movies.");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("An error occurred while fetching movies.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="../public/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without The Hassle
          </h1>
          <Search SearchTerm={SearchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All movies</h2>
          {IsLoading ? (
            <Spinner />
          ) : ErrorMessage ? (
            <p className="text-red-500">{ErrorMessage}</p>
          ) : <ul>
              {
                MovieList.map((movie) => (
                  <p key={movie.id} className="text-white">{movie.title}</p>
                ))
              }
            </ul>}
        </section>
      </div>
    </main>
  );
};

export default App;
