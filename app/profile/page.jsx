"use client";

import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import TransactionCard from './TransactionCard';
import { getProfile } from '../firebase';
import CircularProgress from '@mui/material/CircularProgress';

export default function EditButton() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const data = await getProfile();
                console.log("Profile Data");
                console.log(data);
                if (data) {
                    setProfileData(data);
                    setLoading(false); // Update loading state once data is fetched
                } else {
                    console.error('No profile data found');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error.message);
            }
        };

        if (!profileData) {
            const interval = setInterval(() => {
                fetchProfileData();
            }, 1000); // Fetch data every second

            return () => clearInterval(interval); // Clear interval on component unmount
        }
    }, [profileData]);

    return (
        <div className="gradient-custom-2 mt-7 border-l py-5 h-100" style={{ backgroundColor: '#f8f9fa' }}>
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
                                                <MDBCardText className="small mb-0">Balance: {profileData.amount}</MDBCardText>
                                            </div>
                                            <div>
                                                <MDBCardText className="small mb-0">Wallet: {profileData.wallet}</MDBCardText>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <MDBCardBody className="text-black">
                                    <TransactionCard />
                                </MDBCardBody>
                            </MDBCard>
                            </MDBCol>
                    </MDBRow>
                )
            )}
        </div>
    );
}