import React from 'react';
import { ModeToggle } from './themetoggle';
import { ProfileAvator } from './profileavator';
import Image from 'next/image';


interface NavbarProps {
    title: string;
    links: { label: string; url: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ title, links }) => {
    return (
        <nav className="flex p-4 border-b pl-0 ">
            <div className="container mx-auto flex justify-between items-center">
                <div className=" font-bold text-xl"><img src="./prompt.png" width={130} height={35} alt="Logo" /></div>
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
            </div>
            <div className="pr-2">
            <ModeToggle />
            </div>
            <ProfileAvator />
        </nav>
    );
};

export default Navbar;
