
import React, { useEffect, useState } from 'react';

import { default as ReactSelectDropDown } from 'react-select';

const selectCompare = [
    { value: 0, label: 'None' },
    { value: 1, label: 'check equal' },
  ];

const StringFilter = ({onFilter, column, input_patient_information_expanded}) => {
    const [compCode, setCompCode] = useState(0);
    const [ input_str , setInputStr ] = useState("");

    useEffect(() => {
      const filter = () => {
        onFilter(
          { compareValCode: compCode, inputVal1: input_str }, input_patient_information_expanded
        );
      }

      async function changedTextComparison() {

        filter();
      }

      changedTextComparison()
    }, [compCode, input_str])


    return (
      <div>
        <ReactSelectDropDown options={selectCompare}
          displayValue="label"
          showCheckbox
          onChange={(e) => { setCompCode(e.value) }}
          closeOnSelect={false}
        />

        <input
          key="input"
          type="text"
          placeholder="Value"
          onChange={(e) => { setInputStr(e.target.value) }}
        />
        
      </div>
    )

  }
export default StringFilter