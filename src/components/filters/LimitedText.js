import React from 'react';
import "./LimitedText.css";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";

import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../bootstrap_gene_page/css/sb-admin-2.min.css"

{/* Did manual counting of characters */}

function LimitedText(props) {
  return (
        <div >
            <p id="dataset_text_clipping" style={{WebkitLineClamp: props.numLines ? props.numLines : 1}}>{props.text}</p>
        </div>
  );
}

export default LimitedText;