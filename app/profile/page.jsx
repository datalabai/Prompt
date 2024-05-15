"use client";

import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBSpinner } from 'mdb-react-ui-kit'; // Added MDBSpinner
import TransactionCard from './TransactionCard';
import { getProfile } from  '../firebase';

export default function EditButton() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const data = await getProfile();
                setProfileData(data);
            } catch (error) {
                console.error('Error fetching profile data:', error.message);
            } finally {
                setLoading(false); // Update loading state once data is fetched
            }
        };

        fetchProfileData();
    }, []);

    return (
        <div className="gradient-custom-2 mt-7 border-l py-5 h-100" style={{ backgroundColor: '#f8f9fa' }}>
            {loading ? ( // Display loading spinner if data is still loading
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <MDBSpinner grow />
                </div>
            ) : (
                profileData && ( // Render only if profileData is available
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol lg="9" xl="7">
                            <MDBCard>
                                <div className="rounded-top text-white  flex" style={{ backgroundColor: '#618cb7' }}>
                                    <div className="m-5 d-flex flex">
                                        <MDBCardImage src={profileData.photo} alt="Profile Avatar" className="mt-4 mb-2 rounded-full" fluid style={{ width: '150px', zIndex: '1' }} />
                                    </div>
                                    <div className="m-8 ml-0">
                                        <MDBTypography className='text-4xl'>{profileData.name}</MDBTypography>
                                        <MDBCardText className='text-lg'>{profileData.email}</MDBCardText>
                                        <div className="mt-12 text-white">
                                            <div>
                                                <MDBCardText className="small  mb-0">Balance :  {profileData.amount}</MDBCardText>
                                            </div>
                                            <div >
                                                <MDBCardText className="small mb-0">Wallet : {profileData.wallet}</MDBCardText>
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
