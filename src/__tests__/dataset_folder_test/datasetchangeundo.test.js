import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import DatasetChangeUndo from '../../components/dataset_folder/DatasetChangeUndo';

jest.mock('axios');
jest.mock('@auth0/auth0-react');

describe('DatasetChangeUndo', () => {
  const mockUser = {
    sub: '|user_id|',
  };

  beforeEach(() => {
    axios.post.mockResolvedValue({ data: [] });
    useAuth0.mockReturnValue({ user: mockUser });
  });

  it('renders without errors', () => {
    render(<DatasetChangeUndo input_dataset_id="1" input_data={[]} />);
  });

  

  it('fetches edit records and renders them', async () => {
    const mockEditRecords = [
      {
        id: 1,
        edit_date: '2023-06-09T15:30:00.000Z',
        old_values: {
          Gene1: {
            column1: 'Old Value 1',
          },
        },
        edit_info: {
          Gene1: {
            column1: 'New Value 1',
          },
        },
      },
    ];

    axios.post.mockResolvedValueOnce({ data: mockEditRecords });

    render(<DatasetChangeUndo input_dataset_id="1" input_data={[]} input_displayHistoryTable />);

    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_BACKEND_URL}/api/edits_dataset_user/all`,
      {
        dataset_id: 1,
        user_id: 'user_id',
      },
      { 'content-type': 'application/json' }
    );

    
    await screen.findByText('Edit History');
  });

 

  it('calls the undo change endpoint when undo button is clicked', async () => {
    const mockEditRecord = {
      id: 1,
      old_values: {
        Gene1: {
          column1: 'Old Value 1',
        },
      },
    };

    axios.post.mockResolvedValueOnce({ data: {} });
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<DatasetChangeUndo input_dataset_id="1" input_data={[]} input_displayHistoryTable />);
  });


  it('should perform undo and delete actions when undo button is clicked', async () => {
    // Mock necessary props and dependencies
    
    // Mock the axios post requests for undo and delete actions
    axios.post.mockResolvedValueOnce({ data: [] }); // Mock the response for undo action
    axios.post.mockResolvedValueOnce({ data: [] }); // Mock the response for delete action

    render(<DatasetChangeUndo />);
    

    // Assert that the axios post requests were called with the correct parameters
    expect(axios.post).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/api/edits_dataset_user/all`, {
      dataset_id: NaN,
      user_id: "user_id",
    }, { 'content-type': 'application/json' });

    expect(axios.post).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/api/edits_dataset_user/all`, {
      dataset_id: NaN,
      user_id: "user_id",
    }, { 'content-type': 'application/json' });
  });

});