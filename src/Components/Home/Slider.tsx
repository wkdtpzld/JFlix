import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from '../../utils/util';
import { IGetMoviesResult } from "../../apis/api";
import { useMatch, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

interface IProps {
    data: IGetMoviesResult
    type: string
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
};

    
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


const NowPlayingMovies = ({data, type}:IProps) => {

    // Slider 애니메이션 관련 변수
    const offset = 6;
    const [leaving, setLeaving] = useState(false);
    const [index, setIndex] = useState(0);
    const [arrow, setArrow] = useState(false);
    const totalMovies = data.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;

    // Slider Index 변화 함수들
    const toggleLeaving = () => {
        setLeaving(prev => !prev);
    };

    const increaseIndex = () => { 
        if (data) {
            if (leaving) return;
            toggleLeaving();
            setArrow(() => true);
            setIndex(prev => prev === maxIndex ? 0 : prev + 1);
            
        }
    };
    
    const decreaseIndex = () => { 
        if (data) {
            if (leaving) return;
            toggleLeaving();
            setArrow(() => false);
            setIndex(prev => prev === 0 ? maxIndex : prev - 1);
        }
    };  

    // Navigate 함수들
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:category/:movieId");
    const onBoxClicked = (moviedId: number, category: string) => {
        navigate(`/movies/${category}/${moviedId}`)
    };
    const onOverlayClick = () => {
        navigate(-1);
    };

    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data?.results.find(
            (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

    return (
        <>
            <BigCategory>
                <Category>{type}</Category>
            <Slider>
                <IncreaseBox onClick={increaseIndex}>
                    <FaArrowRight size={50} />
                </IncreaseBox>
                <DecreaseBox onClick={decreaseIndex}>
                    <FaArrowLeft size={50} />
                </DecreaseBox>

                <AnimatePresence
                    onExitComplete={toggleLeaving}
                    custom={arrow}
                    initial={true}
                >
                <Row
                    key={type + index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    custom={arrow}
                >
                    {data?.results
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => {
                        
                        return (
                            <Box
                                layoutId={type + movie.id}
                                key={type + movie.id}
                                variants={boxVariants}
                                onClick={() => onBoxClicked(movie.id, type)}
                                initial="normal"
                                whileHover="hover"
                                transition={{
                                    duration: 0.4,
                                    type: "tween",
                                }} //transition을 props로 넣어줘야 끝날 때도 tween이 적용됨
                                bgPhoto={
                                    movie.backdrop_path || movie.poster_path !== null
                                    ? makeImagePath(
                                        movie.backdrop_path || movie.poster_path,
                                        "w500"
                                        )
                                    : "https://ang-projects.com/public/uploads/contents/testi-no-image.png"
                                }
                                >
                                <Info variants={infoVariants}>
                                    <h4>{movie.title}</h4>
                                </Info>
                            </Box>
                        );
                    })}
                </Row>
                </AnimatePresence>
            </Slider>
            </BigCategory>
            <AnimatePresence>
            {clickedMovie ? (
                <>
                <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
                <BigMovieBox layoutId={bigMovieMatch.params.category! + bigMovieMatch.params.movieId}>
                    <Wrapper>
                    <ImgBox>
                        <Cover
                        style={{
                            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), transparent), 
                                url(${makeImagePath(
                                clickedMovie.backdrop_path ,"w500" || "")})`,}}
                        />
                        <Title>{clickedMovie.title}</Title>
                        <OverView>{clickedMovie.overview}</OverView>
                    </ImgBox>
                    </Wrapper>
                </BigMovieBox>
                </>
            ) : null}
            </AnimatePresence>
        </>
    );
}

export default NowPlayingMovies;

const Category = styled.div`
    font-size: 50px;
    font-weight: bold;
    padding: 0px 60px;
`;

const BigCategory = styled.div`
    height: 350px;
`

const Slider = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
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

    &:first-child{
        transform-origin: center left;
    }

    &:last-child{
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

const IncreaseBox = styled.div`
    position: absolute;
    right: 10px;
    top: 50px;
    z-index: 100;
    padding: 20px;
    cursor: pointer;
`

const DecreaseBox = styled.div`
    position: absolute;
    left: 10px;
    top: 50px;
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
`;

const BigMovieBox = styled(motion.div)`
    position: fixed;
    width: 45vw;
    height: 85vh;
    top: 100px;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${(props) => props.theme.black.lighter};
    border-radius: 15px;
    overflow: hidden;
    z-index: 4;
`;

const Wrapper = styled.div`
    display: flex;
    background-color: ${props => props.theme.black.lighter};
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    overflow: hidden;
`;

const ImgBox = styled.div`
    width: 100%;
    height: 30%;
`;

const Cover = styled.div`
    width: 100%;
    height: 400px;
    background-size: cover;
    background-position: center center;
`;

const Title = styled.h1`
    color: ${props => props.theme.white.lighter};
    padding: 0px 20px;
    font-size: 40px;
    position: relative;
    top: -60px
`

const OverView = styled.div`
    color: ${props => props.theme.white.lighter};
    padding: 0px 20px;
    top: -20px;
    position: relative;
`