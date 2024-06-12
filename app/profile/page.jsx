"use client";

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, NavLink } from 'react-router-dom'; // Import BrowserRouter or Router and NavLink
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { MDBCardBody, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent, MDBTabPane } from 'mdbreact';
import classNames from 'classnames';
import TransactionCard from './TransactionCard';
import RewardsCard from './RewardsCard';
import { getProfile } from '../firebase';
import CircularProgress from '@mui/material/CircularProgress';

export default function EditButton() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("transaction");

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const data = await getProfile();
                if (data) {
                    setProfileData(data);
                    setLoading(false);
                } else {
                    console.error('No profile data found');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error.message);
                setLoading(false);
            }
        };

        if (!profileData) {
            fetchProfileData();
        }
    }, [profileData]);

    return (
        <div className="gradient-custom-2 border-l h-full overflow-y-auto" style={{ backgroundColor: '#f8f9fa' }}>
            {loading ? (
                <CircularProgress color='secondary' className='mt-40 ml-[50%] items-center' />
            ) : (
                profileData && (
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol lg="9" xl="7">
                            <MDBCard>
                                <div className="rounded-top text-white flex" style={{ backgroundColor: '#618cb7' }}>
                                    <div className="m-5 d-flex flex">
                                        <MDBCardImage src={profileData.photo} alt="Profile Avatar" className="mt-4 mb-2 rounded-full" fluid style={{ width: '150px', zIndex: '1' }} />
                                    </div>
                                    <div className="m-8 ml-0">
                                        <MDBTypography className='text-4xl'>{profileData.name}</MDBTypography>
                                        <MDBCardText className='text-lg'>{profileData.email}</MDBCardText>
                                        <div className="mt-12 text-white">
                                            <div>
                                                <MDBCardText className="small mb-0">Balance: {profileData.usdc} USDC</MDBCardText>
                                            </div>
                                            <div>
                                                <MDBCardText className="small mb-0">Wallet: {profileData.wallet}</MDBCardText>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Router>
                                    <MDBCardBody className="p-4">
                                        <MDBNav tabs className="flex bg-gray-100 p-2">
                                            <MDBNavItem>
                                                <NavLink to="#" className={classNames('mr-2', 'px-4', 'py-2', 'cursor-pointer', { 'bg-gray-200': activeTab === 'transaction' })} onClick={() => toggleTab("transaction")}>
                                                    Transactions
                                                </NavLink>
                                            </MDBNavItem>
                                            <MDBNavItem>
                                                <NavLink to="#" className={classNames('mr-2', 'px-4', 'py-2', 'cursor-pointer', { 'bg-gray-200': activeTab === 'rewards' })} onClick={() => toggleTab("rewards")}>
                                                    Rewards
                                                </NavLink>
                                            </MDBNavItem>
                                        </MDBNav>
                                        <MDBTabContent activeItem={activeTab}>
                                            <MDBTabPane tabId="transaction">
                                                {activeTab === 'transaction' && (
                                                    <TransactionCard />
                                                )}
                                            </MDBTabPane>
                                            <MDBTabPane tabId="rewards">
                                                {activeTab === 'rewards' && (
                                                    <RewardsCard />
                                                )}
                                            </MDBTabPane>
                                        </MDBTabContent>
                                    </MDBCardBody>
                                </Router>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                )
            )}
        </div>
    );
}
