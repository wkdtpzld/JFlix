import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../../utils/util";
import { indexAtom, LeavingAtom } from "../../recoil/atoms";
import { useRecoilState } from "recoil";
import { IGetMoviesResult } from "../../apis/api";
import { Link } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

interface IProps {
    data: IGetMoviesResult
}

const PopularMovies = ({data}:IProps) => {

    const offset = 6;
    const [leaving, setLeaving] = useRecoilState(LeavingAtom);
    const [index, setIndex] = useRecoilState(indexAtom);

    const [arrow, setArrow] = useState(false);

    const totalMovies = data.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;

    const toggleLeaving = () => {
        setLeaving(prev => !prev);
    };

    const increaseIndex = () => { 
        
        if (data) {
            if (leaving) return;
            toggleLeaving();

            setArrow(true);
            setIndex(prev => prev === maxIndex ? 0 : prev + 1);
            
        }
    };

    const decreaseIndex = () => { 
        
        if (data) {
            if (leaving) return;
            toggleLeaving();
            setArrow(false);
            setIndex(prev => prev === 0 ? maxIndex : prev - 1);
        }
    };  


    const rowVariants = {

        hidden: (arrow:boolean) => ({
            x: arrow ? window.innerWidth : -window.innerWidth    
        }),
        visible: {
            x: 0
        },

        exit: (arrow:boolean) => ({
            x: !arrow ? window.innerWidth : -window.innerWidth    
        })
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
        <BigCategory>
        <Category>Popular Movie</Category>
        <Slider>
            
            <IncreaseBox onClick={increaseIndex}>
                <FaArrowRight size={50}/>
            </IncreaseBox>
            <DecreaseBox onClick={decreaseIndex}>
                <FaArrowLeft size={50} />
            </DecreaseBox>
            
            <AnimatePresence onExitComplete={toggleLeaving} custom={arrow} initial={true} >
                <Row key={index} variants={rowVariants} exit="exit" initial="hidden" animate="visible" transition={{type: "tween", duration: 1}} custom={arrow} >
                    {data?.results
                        .slice(1)
                        .slice(offset * index, offset * index + offset)
                        .map(movie => {
                            return (
                                <Box
                                    layoutId={movie.id + ""}
                                    variants={boxVariants}
                                    key={movie.title}
                                    transition={{type: "tween"}}
                                    initial="normal"
                                    whileHover="hover"
                                    bgPhoto={makeImagePath(movie.backdrop_path, "w500" || "")}
                                >
                                    <Link 
                                        to={`/movies/${movie.id}`} state={[movie.backdrop_path, movie.title, movie.overview]}
                                        key={movie.id}>
                                        <Info variants={infoVariants}>
                                        <h4>{movie.title}</h4>
                                        </Info>
                                    </Link>

                                </Box>
                            )
                        })}
                </Row>
            </AnimatePresence>
        </Slider>
        </BigCategory>
        
    )
}

export default PopularMovies;

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