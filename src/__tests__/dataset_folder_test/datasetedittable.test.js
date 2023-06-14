import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'; 
import DatasetEditTable from '../../components/dataset_folder/DatasetEditTable.js';


jest.mock('axios');

describe('DatasetEditTable', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: [] });
      });
      
    
      it('renders the table with initial data', async () => {
        const input_together_patient_gene_information = [
          {
            patient_id: '1',
            age: 30,
            diabete: 'No',
            final_diagnosis: 'Healthy',
            gender: 'Male',
            hypercholesterolemia: 'No',
            hypertension: 'No',
            race: 'White',
            ENSG: 3.2
          }
        ];
    
        render(
          <DatasetEditTable input_together_patient_gene_information={input_together_patient_gene_information} />
        );
    
        await waitFor(() => {
            const elementsWithText1 = screen.getAllByText('1');
            expect(elementsWithText1.length).toBeGreaterThan(0);
            const elementsWithText30 = screen.getAllByText('30');
            expect(elementsWithText30.length).toBeGreaterThan(0);
            const elementsWithTextNO = screen.getAllByText('No');
            expect(elementsWithTextNO.length).toBeGreaterThan(0);
            const elementsWithTextHEALTHY = screen.getAllByText('Healthy');
            expect(elementsWithTextHEALTHY.length).toBeGreaterThan(0);
            const elementsWithTextMALE = screen.getAllByText('Male');
            expect(elementsWithTextMALE.length).toBeGreaterThan(0);
            const elementsWithTextWHITE = screen.getAllByText('White');
            expect(elementsWithTextWHITE.length).toBeGreaterThan(0);
            const elementsWithText3_2 = screen.getAllByText('3.2');
            expect(elementsWithText3_2.length).toBeGreaterThan(0);
        });
      });


      it('renders DatasetEditTable component', () => {
        const props = {
          input_together_patient_gene_information: [
            {
              patient_id: "P001",
              age: 35,
              diabete: "No",
              final_diagnosis: "Cancer",
              gender: "Male",
              hypercholesterolemia: "Yes",
              hypertension: "No",
              race: "Asian",
              ENSG: 3.2
            },
            {
              patient_id: "P002",
              age: 42,
              diabete: "Yes",
              final_diagnosis: "Diabetes",
              gender: "Female",
              hypercholesterolemia: "No",
              hypertension: "Yes",
              race: "Caucasian",
              ENSG: 2.8
            }
          ],
          row_type: "patient",
          input_set_together_patient_gene_information: jest.fn()
        };
      
        render(<DatasetEditTable {...props} />);
      
        const tableElement = screen.getByRole('table');
        expect(tableElement).toBeInTheDocument();
      
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(props.input_together_patient_gene_information.length + 2); 
      
        const headerCells = screen.getAllByRole('columnheader');
        expect(headerCells).toHaveLength(Object.keys(props.input_together_patient_gene_information[0]).length * 2);
      });
      


});