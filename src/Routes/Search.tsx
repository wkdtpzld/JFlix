import { useLocation } from "react-router-dom";

const Search = () => {

    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");

    console.log(keyword);
    
    

    return (
        <div>

        </div>
    )
}

export default Search;