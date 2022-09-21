import { Wrapper, Banner } from './Home';
import { useQuery } from 'react-query';
import { FetchTvShows, IGetTvResult, FetchTvVideo, IVideoResult } from '../apis/api';
import { makeImagePath, useWindowDimensions, tvType } from '../utils/util';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import TvSlider from '../Components/TvSlider';
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilValue } from 'recoil';
import { TvMovieAtom } from '../recoil/atoms';
import { useState } from 'react';
import { Helmet } from 'react-helmet';


const VideoVariants = {
    normal: {
        opacity: 1
    },
    hover: {
        opacity: 0,
        transition: {
            delay: 1
        }
    },

    exit: {
        opacity: 1
    }
}

const Tv = () => {

    const { data: OnAirData, isLoading: OnAirLoading } = useQuery<IGetTvResult>(["tvShows", "onAir"], () => FetchTvShows("on_the_air"));
    const { data: PopularData, isLoading: PopularLoading } = useQuery<IGetTvResult>(["tvShows", "popular"], () => FetchTvShows("popular"));
    const { data: TopRateData, isLoading: TopRateLoading } = useQuery<IGetTvResult>(["tvShows", "top_rated"], () => FetchTvShows("top_rated"));
    const { data: VideoData, isLoading: VideoLoading } = useQuery<IVideoResult>(["tvShows", OnAirData?.results[0].id], () => FetchTvVideo(OnAirData?.results[0].id!))
    
    const Loading = OnAirLoading || VideoLoading || PopularLoading || TopRateLoading;
    const Teaser = VideoData?.results.find(item => item.type === "Teaser");
    const width = useWindowDimensions();
    const homeVideo = useRecoilValue(TvMovieAtom);
    const [isMute, setIsMute] = useState(false);

    return (
        <>
        <Helmet>
            <title>Tv Show</title>
        </Helmet>
        <Wrapper>
            {Loading ? (
                "...Loading"
            ) : (
                <>
                
                <Banner bgPhoto={makeImagePath(OnAirData?.results[0].backdrop_path || "")} >
                    <VideoContainer variants={VideoVariants} initial="normal" whileHover="hover" exit="exit">
                        <AnimatePresence>
                            <ReactPlayer 
                                url={`https://www.youtube.com/embed/${Teaser?.key}?showinfo=0&enablejsapi=1&origin=http://localhost:3000` || ""}
                                width={width - 120}
                                height={width / 2.3}
                                playing={homeVideo}
                                controls={false}
                                loop={true}
                                volume={0.3}
                                muted={isMute}
                                style={{pointerEvents: 'none'}}
                            />    
                        </AnimatePresence>
                    </VideoContainer>
                    <MuteBox onClick={() => setIsMute(prev => !prev)}>{isMute ? "Mute" : "Sound On"}</MuteBox>
                </Banner>
                
                <TvSlider data={OnAirData!} type={tvType.on_air} />
                <TvSlider data={PopularData!} type={tvType.popular} />
                <TvSlider data={TopRateData!} type={tvType.top_rated} />
                </>
                
            )}
        </Wrapper>
        </>
        
    );
}

export default Tv;

const VideoContainer = styled(motion.div)`
    min-width: 100%;
    overflow: hidden;
    opacity: 1;
`;

const MuteBox = styled.div`
    width: 100px;
    height: 30px;
    background-color: ${props => props.theme.white.lighter};
    display: flex;
    align-items: center ;
    justify-content: center;
    margin-left: auto;
    border-radius: 20px;
    margin-top: 50px;
    text-align: center;
    color: ${props => props.theme.black.darker};
    font-weight: 700;
    cursor: pointer;
    -ms-user-select: none; 
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
`;