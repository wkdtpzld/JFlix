import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { FetchGetMovies, IGetMoviesResult } from '../apis/api';
import { makeImagePath } from '../utils/util';
import { useMatch, useNavigate } from "react-router-dom";
import MovieDetail from "./MovieDetail";
import PopularMovies from "../Components/Home/PopularMovies";

const Home = () => {
    
    const { data: popularData, isLoading } = useQuery<IGetMoviesResult>(["movie", "nowPlaying"], FetchGetMovies);
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:movieId");

    const onOverlayClick = () => {
        navigate(-1);
    }

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading</Loader>
            ) : (
                <>
                <Banner bgPhoto={makeImagePath(popularData?.results[0].backdrop_path || "")} >
                    <Title>{popularData?.results[0].title}</Title>
                    <Overview>{popularData?.results[0].overview}</Overview>
                </Banner>

                <PopularMovies data={popularData!} />
    
                <AnimatePresence>
                    {bigMovieMatch ?
                    <>
                    <Overlay onClick={onOverlayClick} exit={{opacity: 0}} animate={{opacity: 1}} /> 
                    <BigMovieBox layoutId={bigMovieMatch.params.movieId}>
                        <MovieDetail />
                    </BigMovieBox>
                    </> 
                     : null}
                </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;

const Wrapper = styled.div`
    background: black;
    overflow-x: hidden;
    height: 200vh;
`;

const Loader = styled.div`
    height: 20vh;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{bgPhoto:string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)), url(${props => props.bgPhoto});
    background-size: cover;
`

const Title = styled.h2`
    font-size: 60px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 36px;
    width: 50%;
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    opacity: 0;
`;

const BigMovieBox = styled(motion.div)`
    position: fixed;
    width: 40vw;
    height: 80vh;
    top: 100px; 
    left: 0;
    right: 0; 
    margin: 0 auto;
`;