
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import { clone } from "ramda";
import axios from "axios";

import { useAuth0 } from "@auth0/auth0-react";

import SampleList from "./SampleList";

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../../bootstrap_gene_page/css/sb-admin-2.min.css";


function GeneSearchResultsHolder(props) {

    const [listPage, setListPage] = useState(1);
    const [isMounted, setIsMounted] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [lastPage, setLastPage] = useState(1);

    const { user } = useAuth0();

    //   Url to search gene by keywords: 'api/gene/search/<str:search_word>/<str:page_id>'
    const handleSearch = async (cur_page) => {
      try {
        let search_input_for_url = clone(props.input_search_keyword)

        if (search_input_for_url === "") {
          search_input_for_url = " ";
        }
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL
          }/api/gene_search/${search_input_for_url}/${cur_page.toString()}`
        );
        setSearchResult(response.data.genes);

        console.log("search gene results: ");
        console.log(response.data);

        console.log("total num pages: ")
        console.log(response.data.total_pages);

        setLastPage( response.data.total_pages )

        setHasSearched(true);
      } catch (error) {
        console.error(error);
      }
      console.log("cur page: ", cur_page)

      props.setPerformSearch(false);
    };

    useEffect(() => {
      if(props.performSearch == true){
        handleSearch(listPage);
      }
    }, [props.performSearch]);

    useEffect(() => {
        if (isMounted) {
          //handleSearch();
        } else {
          setIsMounted(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [listPage, props.input_search_keyword]);

  const handleIncrementPage = async () => {
    if( listPage < lastPage ){
      setListPage(listPage + 1);
      handleSearch(listPage + 1);
    }
    // console.log(listPage)
  }

  const handleDecrementPage = () => {
    if (listPage > 1) {
      setListPage(listPage - 1);
      handleSearch(listPage - 1);
    }
    // console.log(listPage)
  }

    return (
        <>
            <SampleList resultList={searchResult} />
                        {!hasSearched && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '100%', maxWidth: '100%' }}>
                            Start Searching!
                        </div>
                        )}
                        {hasSearched && searchResult.length === 0 && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '100%', maxWidth: '100%' }}>
                            No results
                            </div>
                            {listPage > 1 ? <div className="float-left">
                            <button onClick={handleDecrementPage}>Prev Page</button>
                            </div> : <div></div>}
                        </div>
                        )}
                        {searchResult.length > 0 && (
                        <div>
                            {listPage > 1 ? <div className="float-left">
                            <button onClick={handleDecrementPage}>Prev Page</button>
                            </div> : <div></div>}
                            {listPage < lastPage ? 
                              <div className="float-right">
                              <button onClick={handleIncrementPage}>Next Page</button>
                              </div>
                              : <div></div>
                            }
                        </div>
                        )}
        </>
    )
}

export default GeneSearchResultsHolder;
