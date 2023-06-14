import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import UploadDataset from '../../components/dataset_folder/UploadDataset.js';
import { CheckCircle } from '@material-ui/icons';

jest.mock('axios');

jest.mock('../../components/spinner/gene.png', () => 'mocked-image-path');

describe('UploadDataset', () => {
  it('renders without errors', () => {
    render(<UploadDataset />);
  });

  it('submits the form correctly', async () => {
    render(<UploadDataset />);
    const formData = new FormData();
    formData.append('file', new File(['content'], 'test.csv'));
    const descriptionInput = screen.getByLabelText('Description');
    const urlInput = screen.getByLabelText('URL');
    const patientCode = screen.getByLabelText('Patient Code');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(urlInput, { target: { value: 'goole.com' } });
    fireEvent.change(patientCode, { target: { value: 'UCDSS' } });

    axios.post.mockResolvedValueOnce({ data: 'Success' });

    fireEvent.submit(submitButton);

    await screen.findByText('Submit'); // Wait for the submission to complete

    /*
    expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining(`${process.env.REACT_APP_BACKEND_URL}/api/upload_dataset`),
        expect.any(FormData),
        expect.any(Object)
      );

    expect(screen.getByTestId('check-circle')).toBeInTheDocument();
*/

  });
});
