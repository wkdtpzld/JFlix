import { useQuery } from "react-query";
import styled from "styled-components";
import { FetchGetMovies, IGetMoviesResult, FetchPopularMV } from '../apis/api';
import { makeImagePath, types } from '../utils/util';
import Slider from "../Components/Home/Slider";

const Home = () => {
    
    const { data: OnAirMoviesData, isLoading: OnAirLoading } = useQuery<IGetMoviesResult>(["movie", "nowPlaying"], FetchGetMovies);
    const { data: PopularMoviesData, isLoading: PopularLoading } = useQuery <IGetMoviesResult>(["movie", "popular"], FetchPopularMV);

    const Loading = OnAirLoading || PopularLoading

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
                
                <Slider data={OnAirMoviesData!} type={types.now} />
                <Slider data={PopularMoviesData!} type={types.popular} />
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