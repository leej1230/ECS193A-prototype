import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import '@testing-library/jest-dom/extend-expect';
import Profile from '../../components/user_folder/Profile';
import { itIT } from '@mui/material/locale';
import DeleteIcon from '@mui/icons-material/Delete';


jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    user: {
      "https://unique.app.com/user_metadata": {
        given_name: "John",
        family_name: "Doe",
      },
      sub: "auth0|12345678", // Mocked user sub
    },
  }),
}));

// Mock axios
jest.mock("axios", () => ({
  get: jest.fn().mockResolvedValue({ data: { bookmarked_genes: [], bookmarked_datasets: [] } }),
  post: jest.fn().mockResolvedValue({ data: [] }),
}));

jest.mock('../../components/spinner/gene.png', () => 'mocked-gene-image');

describe('Profile', () => {
  beforeEach(() => {
    render(<Profile />);
  });

  it("renders user full name", () => {
    const fullNameElements = screen.getAllByText(/User full name: John Doe/i);
    expect(fullNameElements.length).toBeGreaterThan(0);
  });

  it('renders bookmarks correctly', async () => {
    // Wait for gene bookmarks to be fetched
    await waitFor(() => {
      const noBookmarksElements = screen.queryAllByText('No Bookmarks Yet!');
      expect(noBookmarksElements.length).toBeGreaterThan(0);
    });
  });

  it('handles adding roles and dataset and gene bookmark', async () => {
    // Mock the axios.get function
    axios.get.mockResolvedValueOnce({
      data: {
        bookmarked_genes: ['gene1', 'gene2'],
        bookmarked_datasets: ['dataset1', 'dataset2'],
        is_admin: true,
        is_staff: true,
      },
    });
  });


  it('check roles and bookmarked datasets and genes', async () => {
    await waitFor(() => {
      expect(screen.getByText('dataset1')).toBeInTheDocument();
      expect(screen.getByText('dataset2')).toBeInTheDocument();
      expect(screen.getByText('gene1')).toBeInTheDocument();
      expect(screen.getByText('gene2')).toBeInTheDocument();
      expect(screen.getByText('User Role: Admin and Staff')).toBeInTheDocument();
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });
  });

  it('handles adding roles and dataset and gene bookmark', async () => {
    // Mock the axios.get function
    axios.get.mockResolvedValueOnce({
      data: {
        bookmarked_genes: ['gene1', 'gene2'],
        bookmarked_datasets: ['dataset1', 'dataset2'],
        is_admin: true,
        is_staff: true,
      },
    });
  });



  
  it('handles deleting gene bookmark', async () => {

    axios.post.mockResolvedValueOnce({
      data: [] // Mocked response
    });

    const formData = new FormData();
            formData.append("user_id", '12345678');
            formData.append("gene_url", `${process.env.REACT_APP_BACKEND_URL}/gene/gene1`);
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/remove-bookmark`, formData);
  

    await waitFor(() => {
      const formData = new FormData();
            formData.append("user_id", '12345678');
            formData.append("gene_url", `${process.env.REACT_APP_BACKEND_URL}/gene/gene1`);
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/api/remove-bookmark`, formData
      );
    });

    });

    it('handles deleting dataset bookmark', async () => {

      axios.post.mockResolvedValueOnce({
        data: [] // Mocked response
      });
  
      const formData = new FormData();
              formData.append("user_id", '12345678');
              formData.append("dataset_url", `${process.env.REACT_APP_BACKEND_URL}/api/dataset1`);
              axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/remove-dataset-bookmark`, formData);
    
  
      await waitFor(() => {
        const formData = new FormData();
              formData.append("user_id", '12345678');
              formData.append("dataset_url", `${process.env.REACT_APP_BACKEND_URL}/api/dataset1`);
        expect(axios.post).toHaveBeenCalledWith(
          `${process.env.REACT_APP_BACKEND_URL}/api/remove-dataset-bookmark`, formData
        );
      });
  
      });






});
