import React from 'react';
import { queryByLabelText, render , screen} from '@testing-library/react';
import GenePage from '../../components/gene_folder/GenePage';
import '@testing-library/jest-dom/extend-expect';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faDna, faFile } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faDna, faFile);

jest.mock('@fortawesome/fontawesome-svg-core/import.macro', () => ({
    icon: ({ name }) => ({ iconName: name, prefix: 'fas' }),
}));

describe('GenePage', () => {
    let getByText;

    beforeEach(() => {
        ({ queryByLabelText } = render(<GenePage />));
    });

    it('renders home link', () => {
        expect(queryByLabelText('Name:')).toBeInTheDocument();

    });

    
});

/*
const homeLink = getByText('Home');
expect(homeLink).toBeInTheDocument();
*/