import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { IGetMoviesResult, IGetDetailMovie, FetchMovieDetail, IVideoResult, FetchMovieVideo } from '../apis/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { makeImagePath, useWindowDimensions } from '../utils/util';
import ReactPlayer from 'react-player';
import { BigTvBackToHome, BigTvContent, BigTvCover, BigTvOverview, BigTvShow } from './TvSlider';
import { FaRegWindowClose } from 'react-icons/fa';
import { useQuery } from 'react-query';

const rowVariants = {

    hidden: {
        scale: 1
    },
    end: {
        transition: {
            duration: 1,
            delayChildren: 0.5,
            staggerChildren: 0.15,
            scale: 1
        }
    }
};

const boxVariants = {
    normal: {
        scale: 1
    },
    hover: {
        scale: 1.1,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween"
        }
    },
    hidden: {
        scale: 0
    },
    end: {
        scale: 1
    }
}

const infoVariants = {
    normal: {
        opacity: 0
    },
    visible: {
        opacity: 1
    }
}

const SearchSlider = ({ data, keyword }: { data: IGetMoviesResult, keyword: string }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const movieId = new URLSearchParams(location.search).get("movieId");
    const clickedMovie = data.results.find(item => item.id + "" === movieId);
    const width = useWindowDimensions();

    const { data: clickedMovieDetail } = useQuery<IGetDetailMovie>([movieId, "searchDetailMovie"]
        , () => FetchMovieDetail(+movieId!));
    
    const { data: clicekdMovieVideo } = useQuery<IVideoResult>(["searchDetailVideo", movieId], () => FetchMovieVideo(+movieId!))

    return (
        <>
        <SliderWrap>
            <Row variants={rowVariants} initial="hidden" animate="end" >
                {data.results.map(item => (
                    <Box bgphoto={item.backdrop_path || item.poster_path !== null
                        ? makeImagePath(item.backdrop_path || item.poster_path, "w500")
                        : "https://ang-projects.com/public/uploads/contents/testi-no-image.png"}
                        variants={boxVariants}
                        key={item.id}
                        layoutId={item.id + ""}
                    >
                        <Info variants={infoVariants} initial="normal" whileHover="visible" onClick={() => navigate(`/search?keyword=${keyword}&movieId=${item.id}`)}>
                            <Title>{item.title}</Title>
                        </Info>
                    </Box>
                ))
                }
            </Row>
        </SliderWrap>
        <AnimatePresence>
            {movieId ? (
                <>
                <Overlay
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => { 
                        navigate(`/search?keyword=${keyword}`);
                    }}
                />
                {clickedMovie && (
                    <BigTvShow layoutId={movieId} bgPhoto={makeImagePath(clickedMovie?.backdrop_path || clickedMovie?.poster_path || "")} >
                        <BigTvCover bgPhoto={makeImagePath(clickedMovie?.poster_path || "")} />
                        <BigTvContent>
                            <BigTvBackToHome onClick={() => { 
                                                navigate(`/search?keyword=${keyword}`);
                                            }}>
                                <FaRegWindowClose size={40} color="white" />
                            </BigTvBackToHome>
                                <BigTvOverview>
                                    <div>
                                        <h1>{clickedMovie.title}</h1>
                                        <h3>{clickedMovie.overview}</h3>
                                        <span style={{ color: "#72d19d" }}>Geners</span>
                                        {clickedMovieDetail?.genres.map(item => (
                                            <span>{item.name}</span>
                                        ))}
                                    </div>
                                    <ReactPlayer
                                        url={`https://www.youtube.com/embed/${clicekdMovieVideo?.results[0]?.key}?showinfo=0&enablejsapi=1&origin=http://localhost:3000`}
                                        width={width / 2.5}
                                        height={'300px'}
                                        volume={0.3}
                                        playing={true}
                                        loop={true}
                                        style={{pointerEvents: 'none'}}
                                    >
                                    </ReactPlayer>
                                </BigTvOverview>
                                
                                
                        </BigTvContent>
                    </BigTvShow>    
                )}
                </>
                
            ) : null }
        </AnimatePresence>
        </>
        
    )
}

export default SearchSlider;

const SliderWrap = styled.div`
    position: relative;
    height: 500px;
    margin-bottom: 80px;
    top: 0px;
`;

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 20px;
    margin-bottom: 10px;
    position: absolute;
    width: 100%;
    overflow: hidden;
`

const Box = styled(motion.div)<{bgphoto : string}>`
    background-color: white;
    height: 400px;
    border-radius: 15px;
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
    position: relative;
`

const Info = styled(motion.div)`
    opacity: 0;
    position: relative;
    height: 100%;
    background: rgba(0,0,0,0.4);
    
`

const Title = styled.h2`
    
    font-size: 25px;
    font-weight: 800;
    text-align: center;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    right: 0;
    left: 0;
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
