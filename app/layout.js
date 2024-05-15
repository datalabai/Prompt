"use client";

import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./globals.css";
import { AuthContextProvider } from "./context/AuthContext";
import { auth } from './firebase';
import { useRouter } from 'next/navigation';
import Sidebar from "./components/Sidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <ToastContainer />
          <section className="relative container">

            <div className="fixed top-0 left-0 h-screen bg-sidebar md:w-72">
              <Sidebar />
            </div>


            <div className="md:pl-64 md:pr-4">
              <Navbar />
              <div className="overflow-y-auto">{children}</div>
            </div>

          </section>
        </AuthContextProvider>
      </body>
    </html>

  );
};


export default RootLayout;
