import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { FetchGetMovies, IGetMoviesResult } from '../apis/api';
import { makeImagePath } from '../utils/util';
import { useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import MovieDetail from "./MovieDetail";

const Home = () => {
    
    const offset = 6;
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:movieId");
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movie", "nowPlaying"], FetchGetMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => { 
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            
            setIndex(prev => prev === maxIndex ? 0 : prev + 1);
        }
    }

    const toggleLeaving = () => {
        setLeaving(prev => !prev);
    }

    const onOverlayClick = () => {
        navigate(-1);
    }

    const rowVariants = {
        hidden: {
            x: window.outerWidth - 10
        },
        visible: {
            x: 0
        },
        exit: {
            x: -window.outerWidth + 10
        }
    }

    const boxVariants = {
        normal: {
            scale: 1
        },
        hover: {
            scale: 1.3,
            y: -50,
            transition: {
                delay: 0.5,
                duration: 0.3,
                type: "tween"
            }
        }

    }

    const infoVariants = {
        hover: {
            opacity: 1,
            transition: {
                delay: 0.5,
                duration: 0.3,
                type: "tween"
            }
        }
    }

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading</Loader>
            ) : (
                <>
                <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")} onClick={increaseIndex}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
                <BigCategory>
                    <Category>Popular Movie</Category>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row key={index} variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{type: "tween", duration: 1}}>
                                {data?.results
                                    .slice(1)
                                    .slice(offset * index, offset * index + offset)
                                    .map(movie => 
                                        <Link to={`/movies/${movie.id}`} state={[movie.backdrop_path, movie.title, movie.overview]} key={movie.id}>
                                            <Box
                                                layoutId={movie.id + ""}
                                                variants={boxVariants}
                                                key={movie.id}
                                                transition={{type: "tween"}}
                                                initial="normal"
                                                whileHover="hover"
                                                bgPhoto={makeImagePath(movie.backdrop_path, "w500" || "")}
                                            >
                                                <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                                </Info>
                                            </Box>
                                        </Link>
                                        )}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                </BigCategory>
                <BigCategory>
                    <Category>Temp Category</Category>
                    
                </BigCategory>
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

const Slider = styled.div`
    margin-top: 40px;
`;

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    margin-bottom: 5px;
    position: absolute;
    width: 100%;

    
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
    background-color: white;
    height: 200px;
    font-size: 66px;
    background-image: url(${props => props.bgPhoto});
    background-position: center;
    cursor: pointer;

    &:first-child {
        transform-origin: center left;
    }

    &:last-child {
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 20px;
    background-color: ${props => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;

    h4 {
        text-align: center;
        font-size: 18px;
    }
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

const Category = styled.div`
  font-size: 50px;
  font-weight: bold;
  padding: 0px 60px;
`;

const BigCategory = styled.div`
    height: 350px;
`