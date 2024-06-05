import Link from 'next/link';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FlutterDashOutlinedIcon from '@mui/icons-material/FlutterDashOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import ImageIcon from '@mui/icons-material/Image';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';

const Sidebar = () => {
    const [user, setUser] = useState('');
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setUser(user); // Update user state based on authentication status
        });

        return () => unsubscribeAuth(); // Clean up the listener when the component unmounts
    }, []);

    const items = [
        { label: 'Expert', href: '/Chat?type=Expert', icon: <AssuredWorkloadOutlinedIcon />},
        { label: 'Memes', href: '/Chat?type=Memes', icon: <FlutterDashOutlinedIcon /> },
        { label: 'Logos', href: '/Chat?type=Logos', icon: <BusinessOutlinedIcon  /> },
        { label: 'Images', href: '/Chat?type=Images', icon: <ImageIcon  /> },
        { label: 'Resumes', href: '/Chat?type=Resumes', icon: <AssignmentOutlinedIcon  /> },
        { label: 'Texts', href: '/Chat?type=Texts', icon: <FormatListBulletedOutlinedIcon  /> },
    ];

    return (
        <div className="mt-16 bg-white h-full border-r-2 w-[16rem]" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="flex flex-col p-4 space-y-2">
                <Link href="/Chat?type=Home">
                    <div className='flex items-center p-3 rounded-lg hover:bg-sky-100 transition duration-300 ease-in-out'>
                        <HomeOutlinedIcon  />
                        <span className="text-xl text-black-400 ml-4">General</span>
                    </div>
                </Link>
                {user ? (
                    <Link href="/Chat?type=Private">
                        <div className='flex items-center p-3 rounded-lg hover:bg-sky-100 transition duration-300 ease-in-out'>
                            <LockOutlinedIcon  />
                            <span className="text-xl text-black-400 ml-4">Private</span>
                        </div>
                    </Link>
                ) : ''}
                {items.map((item, index) => (
                    <Link key={index} href={item.href}>
                        <div className='flex items-center p-3 rounded-lg hover:bg-sky-100 transition duration-300 ease-in-out'>
                            {item.icon}
                            <span className="text-xl text-black-400 ml-4">{item.label}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
