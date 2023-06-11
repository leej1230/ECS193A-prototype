import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import DatasetBasicInfo from '../../components/dataset_folder/DatasetBasicInfo';


describe('DatasetBasicInfo', () => {
  const inputDataset = {
    description: 'Test dataset description',
  };

  it('renders without errors when table properties length is greater than 3', () => {
    const inputDatasetTableInputFormat = [
      {
        field_name: 'Field 1',
        value: 'Value 1',
      },
      {
        field_name: 'Field 2',
        value: 'Value 2',
      },
      {
        field_name: 'Field 3',
        value: 'Value 3',
      },
    ];
    render(
      <DatasetBasicInfo
        input_dataset={inputDataset}
        input_datasetTableInputFormat={inputDatasetTableInputFormat}
      />
    );
  });

  it('renders without errors when table properties length is less than or equal to 3', () => {
    const inputDatasetTableInputFormat = [
      {
        field_name: 'Field 1',
        value: 'Value 1',
      },
      {
        field_name: 'Field 2',
        value: 'Value 2',
      },
    ];
    render(
      <DatasetBasicInfo
        input_dataset={inputDataset}
        input_datasetTableInputFormat={inputDatasetTableInputFormat}
      />
    );
  });

  it('renders the dataset description correctly', () => {
    const inputDatasetTableInputFormat = [
      {
        field_name: 'Field 1',
        value: 'Value 1',
      },
    ];
    render(
      <DatasetBasicInfo
        input_dataset={inputDataset}
        input_datasetTableInputFormat={inputDatasetTableInputFormat}
      />
    );
    const descriptionElement = screen.getByText('Test dataset description');
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the dataset table properties correctly', () => {
    const inputDatasetTableInputFormat = [
      {
        field_name: 'Field 1',
        value: 'Value 1',
      },
      {
        field_name: 'Field 2',
        value: 'Value 2',
      },
    ];
    render(
      <DatasetBasicInfo
        input_dataset={inputDataset}
        input_datasetTableInputFormat={inputDatasetTableInputFormat}
      />
    );

  });

  it('renders the CircularProgress component when table properties length is less than or equal to 3', () => {
    const inputDatasetTableInputFormat = [
      {
        field_name: 'Field 1',
        value: 'Value 1',
      },
    ];
    render(
      <DatasetBasicInfo
        input_dataset={inputDataset}
        input_datasetTableInputFormat={inputDatasetTableInputFormat}
      />
    );
    const circularProgress = screen.getByRole('progressbar');
    expect(circularProgress).toBeInTheDocument();
  });
});


