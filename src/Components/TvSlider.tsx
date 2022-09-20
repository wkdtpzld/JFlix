import styled from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import { IGetTvResult, FetchTvDetail, IGetDetailTv } from '../apis/api';
import { useState } from 'react';
import { makeImagePath } from '../utils/util';
import { useNavigate, useMatch } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft, FaRegWindowClose } from 'react-icons/fa';
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

}

const boxVariants = {
    normal: {
        scale: 1
    },
    hover: {
        scale: 1.3,
        y: '-50px',
        transition: {
            duration: 0.4,
            type: "tween",
            delay: 0.5
        }
    }
}

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            duration: 0.4,
            type: "tween",
            delay: 0.5
        }
    },
}

const TvSlider = ({type, data}:{type: string, data:IGetTvResult}) => {

    const offset = 6;
    const [leaving, setLeaving] = useState(false);
    const [arrow, setArrow] = useState(false);
    const [index, setIndex] = useState(0);
    
    const totalMovies = data.results.length;
    const maxIndex = Math.floor(totalMovies / offset) - 1;


    const toggleLeaving = () => {
        setLeaving(prev => !prev);
    };

    const increaseIndex = () => {
        if (data) {
            navigate(`/tv`);
            if (leaving) return;
            toggleLeaving();
            setArrow(() => true);
            setIndex(prev => prev === maxIndex ? 0 : prev + 1);
            
        }
    };

    const decreaseIndex = () => {
        if (data) {
            navigate(`/tv`);
            if (leaving) return;
            toggleLeaving();
            setArrow(() => false);
            setIndex(prev => prev === 0 ? maxIndex : prev - 1);
            
        }
    };

    const navigate = useNavigate();
    const onBoxClicked = (id: number, type: string) => {
        navigate(`/tv/${type}/${id}`);
    };

    const bigTvMatch = useMatch(`/tv/${type}/:tvId`);
    const clickedTv = data.results.find(item => item.id + "" === bigTvMatch?.params.tvId);

    const { data: clickedTvDetail } = useQuery<IGetDetailTv>(["tvShow", clickedTv?.id], () => FetchTvDetail(+bigTvMatch?.params.tvId!));
    
    console.log(clickedTvDetail);
    

    return (
        <SliderWrap>
            <Category>
                {type}
            </Category>
            <AnimatePresence
                initial={false} onExitComplete={toggleLeaving} custom={arrow}
            >
                <Row key={type + index} variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} custom={arrow} >
                        {data.results.slice(offset * index, offset * index + offset)
                            .map((tv) => (
                                <>
                                <Box bgphoto={
                                    tv.backdrop_path || tv.poster_path !== null
                                        ? makeImagePath(tv.backdrop_path || tv.poster_path, "w500")
                                        : "https://ang-projects.com/public/uploads/contents/testi-no-image.png"} 
                                        variants={boxVariants}
                                        initial="normal"
                                        whileHover="hover"
                                        transition={{
                                            type: "tween"
                                        }}
                                        layoutId={type + tv.id}
                                        key={type + tv.id}
                                        onClick={() => onBoxClicked(tv.id, type)}>
                                        <Info variants={infoVariants}>
                                            <h4>{tv.name}</h4>
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

            <AnimatePresence>
                {bigTvMatch ? (
                    <>
                    <Overlay
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => navigate("/tv")}
                    />
                    {clickedTv && (
                        <BigTvShow layoutId={type + bigTvMatch.params.tvId} bgPhoto={makeImagePath(clickedTv?.backdrop_path || clickedTv?.poster_path || "")} >
                            <BigTvCover bgPhoto={makeImagePath(clickedTv?.poster_path || "")} />
                            <BigTvContent>
                                <BigTvBackToHome onClick={() => navigate("/tv")}>
                                    <FaRegWindowClose size={40} color="white" />
                                </BigTvBackToHome>
                                    <h1>{clickedTv.name}</h1>
                                    <h3>{clickedTv.overview}</h3>
                                    <span style={{ color: "#72d19d" }}>Geners</span>
                                    {clickedTvDetail?.genres.map(item => (
                                        <span>{item.name}</span>
                                    ))}
                                    
                            </BigTvContent>
                        </BigTvShow>    
                    )}
                    </>
                    
                ) : null }
            </AnimatePresence>
        </SliderWrap>
    )
}

export default TvSlider;

const SliderWrap = styled.div`
    position: relative;
    height: 200px;
    margin-bottom: 80px;
    top: -100px;
    margin-top: 80px;
`;

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

const Category = styled.h2`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
    margin-left: 10px;
    color: ${props => props.theme.white.lighter};
    text-transform: uppercase;
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

const BigTvShow = styled(motion.div)<{ bgPhoto: string }>`
    position: fixed;
    width: 95vw;
    height: 90vh;
    top: 80px;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url(${props => props.bgPhoto});
    background-position: center center;
    background-size: cover;
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

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 50px;
`;

const BigTvCover = styled.div<{ bgPhoto: string }>`
    background-image: url(${props => props.bgPhoto});
    background-position: center center;
    background-size: cover;
    width: 70%;
    height: 100%;
    position: relative;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    border-radius: 15px;
`;

const BigTvContent = styled.div`
    color: ${props => props.theme.white.lighter};
    height: 50%;
    text-overflow: ellipsis;

    h1 {
        font-size: 50px;
        font-weight: 800;
        text-shadow: -2px 0px #000, 0px 2px #000, 2px 0px #000, 0px -2px #000;
    }

    h3 {
        padding-top: 20px;
        color: ${props => props.theme.white.lighter};
        font-size: 20px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 70%;
        margin-bottom: 20px;
    }
    
    span {
        font-size: 30px;
        font-weight: 700;
        margin-right: 15px;
    }
`;

const BigTvBackToHome = styled.div`
    position: absolute;
    top: 30px;
    right: 30px;
    width: 50px;
    height: 50px;

    cursor: pointer;
`;