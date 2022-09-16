import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils/util";

interface RouterState {
    state: string[];
}

const MovieDetail = () => {

    const { state } = useLocation() as RouterState; 

    return (
        <Wrapper>
            {state 
            ?
            <ImgBox>
                <Cover style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), transparent), url(${makeImagePath(state[0], "w500" || "")})`}} />
                <Title>{state[1]}</Title>
                <OverView>{state[2]}</OverView>
            </ImgBox> : 
            null}
        </Wrapper>  
    )
}   

export default MovieDetail;

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