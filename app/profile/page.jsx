"use client";
import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';

import TransactionCard from './TransactionCard';
export default function EditButton() {
    return (
        <div className="gradient-custom-2 mt-7 border-l" style={{ backgroundColor: '#f8f9fa' }}>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="9" xl="7">
                        <MDBCard>
                            <div className="rounded-top text-white  flex" style={{ backgroundColor: '#618cb7' }}>
                                <div className="m-5 d-flex flex">
                                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                                        alt="Generic placeholder image" className="mt-4 mb-2 rounded-full" fluid style={{ width: '150px', zIndex: '1' }} />

                                </div>
                                <div className="m-8 ml-0">
                                    <MDBTypography >Shiva Sankar</MDBTypography>
                                    <MDBCardText>Shiva.pabbu@gmail.com</MDBCardText>

                                    <div className="mt-12 text-white">
                                        <div className=" ">
                                            <div>

                                                <MDBCardText className="small  mb-0">Balance : $ 253 </MDBCardText>
                                            </div>
                                            <div >

                                                <MDBCardText className="small mb-0">Prompts Generated : 1026</MDBCardText>
                                            </div>
                                            <div>

                                                <MDBCardText className="small mb-0">Rewards Earned : $ 478</MDBCardText>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <MDBCardBody className="text-black">
                                    <TransactionCard/>

                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}