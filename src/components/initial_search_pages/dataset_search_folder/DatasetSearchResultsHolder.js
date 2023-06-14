
import React, { useEffect, useState } from "react";

import { clone } from "ramda";
import axios from "axios";
import Select from "react-select";


import DatasetSampleList from "./DatasetSampleList";

import './DatasetSearchResultsHolder.css';

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../../bootstrap_gene_page/css/sb-admin-2.min.css";

function DatasetSearchResultsHolder(props) {

    const [listPage, setListPage] = useState(1);
    const [isMounted, setIsMounted] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [lastPage, setLastPage] = useState(1);
    const [numPerPage, setNumPerPage] = useState({value: 5, label: "5"});
    const [selectChanged, setSelectChanged] = useState(false);

    const [search_result_loaded, set_search_result_loaded] = useState(false);

    const options_select = [{value: 5, label: "5"},{value: 10, label: "10"},{value: 15, label: "15"}]

    const handleSelect = async (selected) => {
      setNumPerPage(selected);
      setListPage(1);
      setSelectChanged(true);
    };

    //   Url to search  by keywords: 'api/dataset_search/search/<str:search_word>/<str:page_id>'
    const handleSearch = async (cur_page) => {
      try {
        let search_input_for_url = clone(props.input_search_keyword)

        if (search_input_for_url === "") {
          search_input_for_url = " ";
        }

        console.log("look at page size and cur page: ", cur_page, " size: ", numPerPage);

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL
          }/api/dataset_search/${search_input_for_url}/${cur_page.toString()}/${numPerPage.value.toString()}`
        );
        setSearchResult(response.data.datasets);

        console.log("search dataset results: ");
        console.log(response.data);

        console.log("total num pages: ")
        console.log(response.data.total_pages);

        setLastPage( response.data.total_pages )

        setHasSearched(true);

        set_search_result_loaded(true);

      } catch (error) {
        console.error(error);
      }
      console.log("cur page: ", cur_page)

      props.setPerformSearch(false);
    };

    useEffect(() => {
        console.log("perform search is true");
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

  useEffect(() => {
    console.log("select has changed");
    if(selectChanged == true){
      handleSearch(1);
      setSelectChanged(false);
    }
  }, [numPerPage, selectChanged]);

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
                <div id="searchResultsHolder">
                    <DatasetSampleList resultList={searchResult} input_search_loaded={ (search_result_loaded && hasSearched) || (!hasSearched) } />
                </div>
                    
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
                        {listPage > 1 ? <div className="float-left page_change_btn">
                        <button class="btn btn-primary" onClick={handleDecrementPage}>Prev Page</button>
                        </div> : <div></div>}
                    </div>
                    )}
                    {searchResult.length > 0 && (
                    <div>
                        {listPage > 1 ? <div className="float-left page_change_btn">
                        <button class="btn btn-primary" onClick={handleDecrementPage}>Prev Page</button>
                        </div> : <div></div>}
                        <Select className="float-right"
                            options={options_select}
                            isLoading={!options_select}
                            closeMenuOnSelect={true}
                            onChange={handleSelect}
                            value={numPerPage}
                            name={"page_size"}
                          />
                        {listPage < lastPage ? 
                          <div className="float-right page_change_btn" >
                            <button class="btn btn-primary" onClick={handleIncrementPage}>Next Page</button>
                          </div>
                          : <div></div>
                        }
                    </div>
                    )}
            
            </>
    )
}

export default DatasetSearchResultsHolder;
