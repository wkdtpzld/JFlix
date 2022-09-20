import styled from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import { IGetTvResult } from '../apis/api';
import { useState } from 'react';
import { makeImagePath } from '../utils/util';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';


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

}

const infoVariants = {
        
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
                                            <h4>{tv.title}</h4>
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