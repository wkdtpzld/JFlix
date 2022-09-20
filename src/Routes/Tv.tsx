import { Wrapper, Banner } from './Home';
import { useQuery } from 'react-query';
import { FetchTvShows, IGetTvResult, FetchTvVideo, IVideoResult } from '../apis/api';
import { makeImagePath, useWindowDimensions, tvType } from '../utils/util';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import TvSlider from '../Components/TvSlider';
const Tv = () => {

    const { data, isLoading } = useQuery<IGetTvResult>(["tvShows", "onAir"], () => FetchTvShows("on_the_air"));

    const Loading = isLoading;
    const { data: VideoData } = useQuery<IVideoResult>(["tvShows", data?.results[0].id], () => FetchTvVideo(data?.results[0].id!))
    const Teaser = VideoData?.results.find(item => item.type === "Teaser");
    const width = useWindowDimensions();

    return (
        <Wrapper>
            {Loading ? (
                "...Loading"
            ) : (
                <>
                
                <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")} >
                    <VideoContainer>
                        <ReactPlayer 
                            url={`https://www.youtube.com/embed/${Teaser?.key}?showinfo=0&enablejsapi=1&origin=http://localhost:3000` || ""}
                            width={width - 120}
                            height={`650px`}
                            playing={true}
                            controls={false}
                            loop={true}
                            volume={0.3}
                            muted={false}
                        />    
                    </VideoContainer>
                </Banner>
                
                <TvSlider data={data!} type={tvType.on_air} />
                </>
                
            )}
        </Wrapper>
    );
}

export default Tv;

const VideoContainer = styled.div`
    min-width: 100%;
    overflow: hidden;
    opacity: 1;
`;