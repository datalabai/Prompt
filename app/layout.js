"use client";

import React from "react";
import { AuthContextProvider } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
      <link rel="icon" href="/promt-favicon.png" />
        <AuthContextProvider>
          <ToastContainer />
          <section className="flex h-screen">
          <div className="fixed top-0 left-0 right-0 h-16 bg-white z-10">
                <Navbar />
              </div>
            
            <div className="flex flex-row w-full h-full fixed ">
              <div className="h-full bg-sidebar  w-[16rem]">
              <Sidebar />
            </div>
              <div className="mt-16  w-[90%]">
                {children}
              </div>
            </div>
          </section>
        </AuthContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
