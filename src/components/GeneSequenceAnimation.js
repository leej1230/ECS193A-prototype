
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

import './GeneSequenceAnimation.css'

function breakUpCode(code_str) {
    let list_str_code = []
    for (var i = 0; i < code_str.length; i += 5) {
      let temp_str = "";
      if (i + 5 < code_str.length) {
        temp_str = code_str.substring(i, i + 5);
      } else {
        temp_str = code_str.substring(i, code_str.length);
      }
      list_str_code.push(temp_str);
    }
  
    return list_str_code;
  }
  
  function getColor(index_group) {
    if (index_group % 4 == 0) {
      // purple shade
      return '#f2a2f5'
    } else if (index_group % 4 == 1) {
      // red shade
      return '#f56464';
    } else if (index_group % 4 == 2) {
      // green shade
      return '#9ff595';
    } else {
      // blue shade
      return '#84a8f0';
    }
  }

function GeneSequenceAnimation(props){

    const [gene_code_info, set_gene_code_info] = useState({ code: ["mrna"] });

    useEffect(() => {
        async function fetchSeqName() {
    
          const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/seq/names`);
          console.log(resp);
          console.log("seq names");
          var data_code = resp.data;
          if (data_code.code.length > 1) {
            // remove 'mrna' initial
            data_code.code = data_code.code.slice(1, data_code.code.length);
            // remove blanks at end
            while (data_code.code.length > 1 && data_code.code[data_code.code.length - 1] == "") {
              data_code.code.pop();
            }
          }
          set_gene_code_info(data_code);
          console.log(data_code);
        }
        fetchSeqName()
      }, []);

    return(
        <div class="col-xl" id="gene_animation">
            <TableContainer style={{ width: '100%', height: '500px', overflow: 'scroll' }}>

            <Table style={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Code</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {
                    gene_code_info.code.map(function (item, row_i) {
                    return <TableRow key={row_i}>
                        <TableCell>
                        
                        <div className="codeRow" >{breakUpCode(item).map(function (code_str, i) {
                            return <div className="codeCard" style={{ backgroundColor: getColor(i) }}>
                            {code_str}
                            </div>
                        })}</div>

                        </TableCell>
                        
                    </TableRow>

                    })
                }
                </TableBody>
            </Table>

            </TableContainer>

        </div>
    )
}

export default GeneSequenceAnimation