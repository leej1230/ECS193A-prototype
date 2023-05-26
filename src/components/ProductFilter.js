import React from 'react';
import Multiselect from "multiselect-react-dropdown";

function ProductFilter(props) {

    const filter = (selectedList, selectedItem) => {
      props.onFilter(
        selectedList.map(x => [x.value])
      );
    }
  
    return (
      <Multiselect options={props.optionsInput}
        displayValue="label"
        showCheckbox
        closeOnSelect={false}
        onSelect={filter}
        onRemove={filter} />
    )
  
  }

export default ProductFilter;