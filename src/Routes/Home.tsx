import { useQuery } from "react-query";
import styled from "styled-components";
import { FetchGetMovies, IGetMoviesResult } from '../apis/api';
import { makeImagePath, types } from '../utils/util';
import Slider from "../Components/Slider";

const Home = () => {
    
    const { data: OnAirMoviesData, isLoading: OnAirLoading } = useQuery<IGetMoviesResult>(["movie", "nowPlaying"], () => FetchGetMovies("now_playing"));
    const { data: PopularMoviesData, isLoading: PopularLoading } = useQuery<IGetMoviesResult>(["movie", "popular"], () => FetchGetMovies("popular"));
    const { data: TopLatedData, isLoading: TopLatedLoading } = useQuery<IGetMoviesResult>(["movie", "top_rated"], () => FetchGetMovies("top_rated"));
    const { data: UpcomingData, isLoading: UpcomingLoading } = useQuery<IGetMoviesResult>(["movie", "upcoming"], () => FetchGetMovies("upcoming"));

    const Loading = OnAirLoading || PopularLoading || TopLatedLoading || UpcomingLoading

    return (
        <Wrapper>
            {Loading ? (
                <Loader>Loading</Loader>
            ) : (
                <>
                <Banner bgPhoto={makeImagePath(OnAirMoviesData?.results[0].backdrop_path || "")} >
                    <Title>{OnAirMoviesData?.results[0].title}</Title>
                    <Overview>{OnAirMoviesData?.results[0].overview}</Overview>
                </Banner>
                
                <Slider type={types.now} data={OnAirMoviesData!} />
                <Slider type={types.popular} data={PopularMoviesData!} />
                <Slider type={types.top} data={TopLatedData!} />
                <Slider type={types.upcoming} data={UpcomingData!} />
                </>
            )}
        </Wrapper>
    );
}

export default Home;

export const Wrapper = styled.div`
    background: black;
    overflow-x: hidden;
`;

export const Loader = styled.div`
    height: 20vh;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Banner = styled.div<{bgPhoto:string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(${props => props.bgPhoto});
    background-size: cover;
`

export const Title = styled.h2`
    font-size: 60px;
    margin-bottom: 20px;

    @media (max-width: 750px) {
        
    }
`;

export const Overview = styled.p`
    font-size: 36px;
    width: 50%;

    @media (max-width: 750px) {
        width: 90%;
        text-overflow: ellipsis;
    }
`;