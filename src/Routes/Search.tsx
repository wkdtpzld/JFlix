import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FetchSearchResults } from '../apis/api';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { IForm } from '../Components/Header';
import SearchSlider from '../Components/SearchSlider';
import { Helmet } from 'react-helmet';

const SearchPage = () => {

    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data: MovieData, isLoading: MovingLoading } = useQuery(["SearchData", keyword, "movie"], () => FetchSearchResults(keyword!, "movie"));
    const { register, handleSubmit, setValue } = useForm<IForm>();
    const navigate = useNavigate();

    const Loading = MovingLoading;

    const onValid = (data:IForm) => {
        navigate(`/search?keyword=${data.keyword}`);
        setValue("keyword", "");
    };


    return (
        <>
            <Helmet>
                <title>Search</title>
            </Helmet>
            {keyword === null ? (
                <NotSearchWrap>
                    <span>아무런 검색을 하지 않았습니다.</span>
                    <Search onSubmit={handleSubmit(onValid)}>
                        <Input
                            {...register("keyword", {required: true, minLength: 2})}
                            transition= {{type: "linear"}}
                            placeholder="Search for movie or tv show"
                            autoComplete='off' />
                    </Search>
                </NotSearchWrap>
            ) : (
                <>
                {Loading ? (
                    <div>
                        Loading...
                    </div>
                ) : (
                    <SearchWrap>
                        <SearchTitle>
                            <span>{keyword}</span>
                            (을)를 검색한 결과입니다.
                        </SearchTitle>
                        
                        <SearchSlider data={MovieData} keyword={keyword}/>
                    </SearchWrap>
                )}
                </>
            )}
        </>
    )
}

export default SearchPage;

const NotSearchWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    width: 100%;

    span {
        font-size: 50px;
        font-weight: 800;
    }
`;


const Search = styled.form`
    color: white;
    svg {
        height: 25px;
    };
    display: flex;
    align-items: center;
    position: relative;
`;

const Input = styled(motion.input)`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 500px;
    margin-top: 30px;
    padding: 10px 10px;
    color: white;
    background-color: transparent;
    border: 1px solid ${props => props.theme.white.lighter};
`;

const SearchWrap = styled.div`
    width: 100%;
    height: 100vh;
`;

const SearchTitle = styled.h2`
    display: flex;
    margin: 50px 0px;
    font-size: 40px;
    padding: 60px;
    text-align: center;

    span {
        color: ${props => props.theme.red};
    }

    @media (max-width: 700px) {
        font-size: 25px;
    }
`;