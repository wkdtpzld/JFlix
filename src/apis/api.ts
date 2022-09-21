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

interface ITv {
    backdrop_path: string
    poster_path: string
    id: number
    overview: string
    name: string
}

interface IVideo {
    id: string,
    site: string,
    key: string,
    type: string
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

export interface IGetDetailMovie {
    adult: boolean,
    backdrop_path: string,
    genres: {
        id: number,
        name: string
    }[],
    original_title: string,
    overview: string,
    vote_average: number
}

export interface IGetDetailTv {
    adult: boolean,
    genres: {
        id: number,
        name: string
    }[],
    hompage: string
}

export interface IGetTvResult {
    page: number,
    results: ITv[],
    total_pages: number,
    total_results: number
}

export interface IVideoResult {
    id: number,
    results: IVideo[]
}

export function FetchGetMovies(type:string) {
    return axios.get(`${BASE_PATH}/movie/${type}?api_key=${API_KEY}&language=en-US&page=1&region=kr`)
        .then(res => res.data)
        .catch(error => console.log(error.message));
}

export function FetchMovieDetail(id:number) {
    return axios.get(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}`)
        .then(res => res.data)
        .catch(error => console.log(error.message));
}

export function FetchTvShows(type:string) {
    return axios.get(`${BASE_PATH}/tv/${type}?api_key=${API_KEY}&language=en-US&region=jp`)
        .then(res => res.data)
        .catch(error => console.log(error.message));
}

export function FetchTvVideo(id: number) {
    return axios.get(`${BASE_PATH}/tv/${id}/videos?api_key=${API_KEY}`)
        .then(res => res.data)
        .catch(error => console.log(error.message));
}

export function FetchMovieVideo(id: number) {
    return axios.get(`${BASE_PATH}/movie/${id}/videos?api_key=${API_KEY}`)
        .then(res => res.data)
        .catch(error => console.log(error.message));
}

export function FetchTvDetail(id: number) {
    return axios.get(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}`)
        .then(res => res.data)
        .catch(error => console.log(error.message))
}

export function FetchSearchResults(keyword: string, type: string) {
    return axios.get(`${BASE_PATH}/search/${type}?api_key=${API_KEY}&query=${keyword}`)
        .then(res => res.data);
}