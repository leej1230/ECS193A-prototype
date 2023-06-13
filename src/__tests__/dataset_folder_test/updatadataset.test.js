import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'; 
import UpdateDataset from '../../components/dataset_folder/UpdateDataset';


jest.mock('axios');


describe('UpdateDataset', () => {

    it('renders UpdateDataset component without error', () => {
        render(<UpdateDataset />);
      });

      test('should update dataset when form is submitted', async () => {
        render(<UpdateDataset />);

        const selectedFile = new File(['test data'], 'test.csv', { type: 'text/csv' });
        const datasetID = 1;
        const description = 'Updated description';
        const urltoFile = 'http://example.com/file.csv';
    
        axios.post.mockResolvedValueOnce({ data: 'Data updated successfully' });
    
        const fileInput = screen.getByLabelText('Dataset CSV File Update');
        fireEvent.change(fileInput, { target: { files: [selectedFile] } });
    
        const datasetIDInput = screen.getByLabelText('Dataset ID (original, can\'t be updated)');
        fireEvent.change(datasetIDInput, { target: { value: datasetID } });
    
        const descriptionInput = screen.getByLabelText('Description Update');
        fireEvent.change(descriptionInput, { target: { value: description } });
    
        const urlInput = screen.getByLabelText('URL Update');
        fireEvent.change(urlInput, { target: { value: urltoFile } });
    
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
    
        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/update_dataset'), expect.any(FormData), expect.any(Object));
      });

      test('should display error alert when update fails', async () => {

        render(<UpdateDataset />);

        axios.post.mockRejectedValueOnce(new Error('Update failed'));
    
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
    
        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    
      });

});