
import React, { useEffect, useState } from 'react';

import { default as ReactSelectDropDown } from 'react-select';

const selectCompare = [
    { value: 0, label: 'None' },
    { value: 1, label: '<' },
    { value: 2, label: '>' },
    { value: 3, label: '=' },
    { value: 4, label: 'between' }
  ];

const NumberFilter = ({onFilter, column, input_patient_information_expanded}) => {
    const [compCode, setCompCode] = useState(0);
    const [input1, setInput1] = useState(0);
    const [input2, setInput2] = useState(0);

    useEffect(() => {
      const filter = () => {
        onFilter(
          { compareValCode: compCode, inputVal1: input1, inputVal2: input2, colName: column.dataField }, input_patient_information_expanded
        );
      }

      async function changedNumberComparison() {

        filter();
      }

      changedNumberComparison()
    }, [compCode, input1, input2])


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
          placeholder="Value (or Min if between)"
          onChange={(e) => { setInput1(e.target.value) }}
        />
        <input
          key="input"
          type="text"
          placeholder="(Max if between selected or not used)"
          onChange={(e) => { setInput2(e.target.value) }}
        />
      </div>
    )

  }
export default NumberFilter