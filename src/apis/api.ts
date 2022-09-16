import axios from "axios";

const API_KEY = "f912cc6e1cd5ae9a60b76fd5c9d6a098";
const BASE_PATH = "https://api.themoviedb.org/3"

interface IMovie {
    adult: boolean
    backdrop_path: string
    id: number
    overview: string
    poster_path: string
    title: string
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    },
    page: number,
    results: IMovie[],
    total_pages: number,
    total_results: number
}


export function FetchGetMovies() {
    return axios.get(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`)
        .then(res => res.data)
        .catch(error => console.log(error.message))
}