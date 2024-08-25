"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserAuth } from "../app/context/AuthContext";
import { addUserToFirestore } from '../app/firebase';
import { ModeToggle } from './themetoggle';
import { ProfileAvator } from './profileavator';

interface NavbarProps {
    title: string;
    links: { label: string; url: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ title, links }) => {
    const [open, setOpen] = useState(false);
    const { user, googleSignIn, logOut } = UserAuth();

    useEffect(() => {
        if (user) {
            addUserToFirestore(user);
        }
    }, [user]);

    const formatDisplayName = (displayName: string) => {
        return displayName
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleSignIn = async () => {
        console.log("Signing in...");
        try {
            await googleSignIn();
            console.log("User signed in successfully.");
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenNavbar = () => {
        setOpen(prev => !prev);
    }

    const handleSignOut = async () => {
        try {
            await logOut();
            console.log("User signed out successfully.");
            setOpen(false); // Close the dropdown menu
        } catch (error) {
            console.log(error);
        }
    };

    const handleViewProfile = () => {
        setOpen(false); // Close the dropdown menu
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-nav-lab shadow">
            <div className="flex mb-2 sm:mb-0 space-x-2 ml-2">
                <Link href="/home" passHref>
                    <span className="text-2xl no-underline text-dlab-blue">
                        <img src="./prompt.png" width={130} height={35} alt="Logo" />
                    </span>
                </Link>
            </div>
            <div className="flex space-x-4">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        className=""
                    >
                        {link.label}
                    </a>
                ))}
            </div>
            <div className="flex items-center space-x-4 pr-2">
                <ModeToggle />
                <div className="self-center relative">
                    {user ? (
                        <div className="flex items-center">
                            <Image
                                src={user.photoURL}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="cursor-pointer rounded-full m-0"
                                onClick={handleOpenNavbar}
                            />
                            {open && (
                                <div className='absolute top-full mt-2 right-0 border rounded bg-nav-lab shadow-lg'>
                                    <div className='flex flex-col'>
                                        <Link href="/profile">
                                            <span onClick={handleViewProfile} className="text-md no-underline ml-2 px-4 py-2 text-dlab-blue focus:outline-none cursor-pointer">
                                                View Profile
                                            </span>
                                        </Link>
                                        <button onClick={handleSignOut} className="text-md no-underline ml-2 px-4 py-2 text-dlab-blue focus:outline-none">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={handleSignIn} className="text-md no-underline ml-2 px-4 py-2 text-dlab-blue focus:outline-none">
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
