//import React from 'react'

import React, {useState} from 'react';

function upload(){
	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		//setIsSelected(true);
	};

	const handleSubmission = () => {
	};

    /*
    post(
			'API URL',
			{
				method: 'POST',
				body: data.csv
			}
		)
			.then((response) => response.csv())
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
        */

	return(
   <div>
			<input type="file" name="file" onChange={changeHandler} />
			<div>
				<button onClick={handleSubmission}>Submit</button>
			</div>
		</div>
	)
}

export default upload

