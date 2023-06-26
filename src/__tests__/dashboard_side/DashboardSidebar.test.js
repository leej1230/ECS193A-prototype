import React from 'react';
import { render } from '@testing-library/react';
import DashboardSidebar from '../../components/dashboard_side/dashboardSidebar';
import '@testing-library/jest-dom/extend-expect';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faDna, faFile } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faDna, faFile);

jest.mock('@fortawesome/fontawesome-svg-core/import.macro', () => ({
    icon: ({ name }) => ({ iconName: name, prefix: 'fas' }),
}));

describe('DashboardSidebar', () => {
    let getByText;

    beforeEach(() => {
        ({ getByText } = render(<DashboardSidebar input_cur_active="home" />));
    });

    it('renders home link', () => {
        const homeLink = getByText('Home');
        expect(homeLink).toBeInTheDocument();

    });

    it('renders gene search link', () => {
        const geneSearchLink = getByText('Gene Search');
        expect(geneSearchLink).toBeInTheDocument();
    });

    it('renders dataset search link', () => {
        const datasetSearchLink = getByText('Dataset Search');
        expect(datasetSearchLink).toBeInTheDocument();

    });

    it('renders everything', () => {
        const homeLink = getByText('Home');
        expect(homeLink).toBeInTheDocument();

        const geneSearchLink = getByText('Gene Search');
        expect(geneSearchLink).toBeInTheDocument();

        const datasetSearchLink = getByText('Dataset Search');
        expect(datasetSearchLink).toBeInTheDocument();
    });
});
