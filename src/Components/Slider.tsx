import styled from 'styled-components';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from 'react';
import { IGetMoviesResult, FetchMovieDetail, IGetDetailMovie } from '../apis/api';
import { makeImagePath, Ratings } from '../utils/util';
import { useNavigate, useMatch } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useQuery } from 'react-query';

const rowVariants = {

    hidden: (arrow: boolean) => ({
        x: arrow ? window.innerWidth : -window.innerWidth
    }),

    visible: {
        x: 0
    },

    exit: (arrow: boolean) => ({
        x: arrow ? -window.innerWidth : window.innerWidth
    })
};

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
};

const Slider = ({type, data}:{type: string, data: IGetMoviesResult}) => {

    const offset = 6;
    const [leaving, setLeaving] = useState(false);
    const [arrow, setArrow] = useState(false);
    const [index, setIndex] = useState(0);

    const totalMovies = data.results.length;
    const maxIndex = Math.floor(totalMovies / offset) - 1;

    const increaseIndex = () => {
        if (data) {
            navigate(`/`);
            if (leaving) return;
            toggleLeaving();
            setArrow(() => true);
            setIndex(prev => prev === maxIndex ? 0 : prev + 1);
            
        }
    }

    const decreaseIndex = () => {
        if (data) {
            navigate(`/`);
            if (leaving) return;
            toggleLeaving();
            setArrow(() => false);
            setIndex(prev => prev === 0 ? maxIndex : prev - 1);
            
        }
    }

    const toggleLeaving = () => {
        setLeaving(prev => !prev);
    }

    const navigate = useNavigate();

    const onBoxClicked = (id:number, type:string) => {
        navigate(`/movies/${type}/${id}`);
    }

    const bigMovieMatch = useMatch(`/movies/${type}/:movieId`)
    const clickedMovie = bigMovieMatch?.params.movieId &&
        data.results.find(movie => movie.id + "" === bigMovieMatch.params.movieId);

    const { data: clickedMovieDetail } = useQuery<IGetDetailMovie>([bigMovieMatch?.params.movieId, "detail"]
        , () => FetchMovieDetail(+bigMovieMatch?.params.movieId!));
    
    return (
        <>
        <SliderWrap>
            <Category>
                {type}
            </Category>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={arrow}>
                <Row key={type + index} variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} custom={arrow} >
                    {data.results.slice(offset * index, offset * index + offset)
                        .map((movie) => (
                            <>
                            <Box bgphoto={
                                movie.backdrop_path || movie.poster_path !== null
                                    ? makeImagePath(movie.backdrop_path || movie.poster_path, "w500")
                                    : "https://ang-projects.com/public/uploads/contents/testi-no-image.png"} 
                                    variants={boxVariants}
                                    initial="normal"
                                    whileHover="hover"
                                    transition={{
                                        type: "tween"
                                    }}
                                    layoutId={type + movie.id}
                                    key={type + movie.id}
                                    onClick={() => onBoxClicked(movie.id, type)}>
                                    <Info variants={infoVariants}>
                                        <h4>{movie.title}</h4>
                                    </Info>
                            </Box>
                            </>
                    ))}
                </Row>
            </AnimatePresence>
            <IncreaseBox onClick={increaseIndex}>
                <FaArrowRight size={50} />
            </IncreaseBox>
            <DecreaseBox onClick={decreaseIndex}>
                <FaArrowLeft size={50} />
            </DecreaseBox>
        </SliderWrap>
        
        <AnimatePresence>
            {bigMovieMatch ? (
                <>
                <Overlay
                    onClick={() => navigate("/")}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
                <BigMovie
                    layoutId={type + bigMovieMatch.params.movieId}
                >
                    {clickedMovie && (
                        <>
                            <BigCover bgPhoto={makeImagePath(clickedMovie.backdrop_path || clickedMovie.poster_path, "w500")}>
                                <BigTitle>
                                    {clickedMovie.title}
                                </BigTitle>
                            </BigCover>
                                <BigInfo>
                                    <Adult adult={clickedMovieDetail?.adult}>
                                        {clickedMovieDetail?.adult ? 19 : "All"}
                                    </Adult>
                                    {type === "upcoming" ||
                                        (clickedMovieDetail?.vote_average as number) === 0.0 ? (
                                            <div>Not Rated</div>
                                        ) : (
                                            <Ratings rating={clickedMovieDetail?.vote_average as number} />
                                        )
                                    }
                            </BigInfo>
                            <BigOverView>{clickedMovie.overview}</BigOverView>
                                <BigSubInfo>
                                    <div>
                                        <span>Geners</span>
                                            {clickedMovieDetail?.genres.map(data => (
                                            <span> {data.name} </span>
                                            ))}
                                    </div>
                            </BigSubInfo>
                        </>
                    )}
                </BigMovie>
                </>
            ) : null}
        </AnimatePresence>
        </>
    )
}

export default Slider;

const SliderWrap = styled.div`
    position: relative;
    height: 200px;
    margin-bottom: 80px;
    top: -100px;
`;

const Category = styled.h2`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
    margin-left: 10px;
    color: ${props => props.theme.white.lighter};
    text-transform: uppercase;
`

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    margin-bottom: 10px;
    position: absolute;
    width: 100%;
`

const Box = styled(motion.div)<{bgphoto : string}>`
    background-color: white;
    height: 200px;
    background-size: cover;
    background-position: center center;
    background-image: url(${props => props.bgphoto});
    &:first-child {
        transform-origin: center left;
    }

    &:last-child {
        transform-origin: center right;
    }

    cursor: pointer;
`

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${props => props.theme.black.darker};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;

    h4 {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
    }
`;

const IncreaseBox = styled.div`
    position: absolute;
    right: 5px;
    top: 100px;
    z-index: 100;
    padding: 20px;
    cursor: pointer;
`

const DecreaseBox = styled.div`
    position: absolute;
    left: 5px;
    top: 100px;
    z-index: 100;
    padding: 20px;
    cursor: pointer;
`
const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    opacity: 0;
    z-index: 3;
`;

const BigMovie = styled(motion.div)`
    position: fixed;
    width: 45vw;
    height: 85vh;
    top: 100px;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${props => props.theme.black.lighter};
    border-radius: 15px;
    overflow-x: hidden;
    overflow-y: scroll;
    z-index: 101;

    ::-webkit-scrollbar {
        display: none;
    }

    @media (max-width: 800px) {
        width: 90vw;
    }
`;

const BigCover = styled.div<{ bgPhoto: string }>`
    width: 100%;
    height: 450px;
    background-size: cover;
    background-image: linear-gradient(transparent, black),
        url(${(props) => props.bgPhoto});
    background-position: center center;
    position: relative;

`;

const BigTitle = styled.h3`
    color: ${props => props.theme.white.lighter};
    padding: 18px 20px;
    font-size: 50px;
    font-weight: 800;
    position: absolute;
    bottom: -0px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    line-height: 130%;
`

const BigInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 20px;
`

const BigOverView = styled.div`
    padding: 20px;
    color: ${props => props.theme.white.lighter};
    font-size: 20px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
`
const BigSubInfo = styled.div`
    margin: 0px 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-bottom: 20px;
    font-size: 20px;
    font-weight: 600;

    div {
        span {
            &:first-child {
                color: ${props => props.theme.red}
            }
        }
    }
`

const Adult = styled.div<{ adult: boolean | undefined }>`
    background-color: ${props => props.adult? props.theme.red : "#4668d8"};
    color: ${props => props.theme.white.lighter};
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 30px;
    border-radius: 15px;
    font-weight: 700;
    margin-left: 20px;
    margin-right: 10px;
`