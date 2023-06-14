
import React from "react";
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { useNavigate } from 'react-router-dom';

import './dashboardSidebar.css'

function DashboardSidebar(props) {
    
    const navigate = useNavigate();

    return (
        <SideNav id="side_navigation_menu"
            onSelect={(selected) => {
                if(selected === "home"){
                    navigate('/console');
                } else if (selected === "search_gene"){
                    navigate('/search_genes_page');
                } else if( selected === "search_dataset"){
                    navigate('/search_datasets_page');
                }
                
            }}>
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected={props.input_cur_active}>
                <NavItem eventKey="home">
                    <NavIcon>
                    <a href="/console" style={{ textDecoration: 'None' }}><i className="fa fa-fw fa-home" style={{ fontSize: '1.75em', color: 'white' }} /></a>
                    </NavIcon>
                    <NavText style={{ color: 'white' }}>
                        <a href="/console" style={{ textDecoration: 'None' }}>Home</a>
                    </NavText>
                </NavItem>
                <NavItem eventKey="search_gene">
                    <NavIcon >
                        <a href="/search_genes_page" style={{ textDecoration: 'None' }}><FontAwesomeIcon id="gene_icon" icon={icon({ name: 'dna', style: 'solid' })} /></a>
                    </NavIcon>
                    <NavText style={{ color: 'white' }}>
                        <a href="/search_genes_page" style={{ textDecoration: 'None' }}>Gene Search</a>
                    </NavText>
                </NavItem>
                <NavItem eventKey="search_dataset" >
                    <NavIcon >
                        <a href="/search_datasets_page" style={{ textDecoration: 'None' }}><FontAwesomeIcon id="dataset_search_icon" icon={icon({ name: 'file', style: 'solid' })} /></a>
                    </NavIcon>
                    <NavText style={{ color: 'white' }}>
                        <a href="/search_datasets_page" style={{ textDecoration: 'None' }}>Dataset Search</a>
                    </NavText>
                </NavItem>
            </SideNav.Nav>
        </SideNav>
    )
}

export default DashboardSidebar