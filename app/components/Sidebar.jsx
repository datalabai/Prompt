import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaugh, faPalette, faImage, faFileAlt, faFont } from '@fortawesome/free-solid-svg-icons';
import HomeIcon from "@mui/icons-material/Home";
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import RedditIcon from '@mui/icons-material/Reddit';
import ImageIcon from '@mui/icons-material/Image';
import ListAltIcon from "@mui/icons-material/ListAlt";
import AssignmentIcon from '@mui/icons-material/Assignment';

const Sidebar = () => {
    const items = [
        { label: 'Memes', href: '/Chat?type=Memes', icon: faLaugh },
        { label: 'Logos', href: '/Chat?type=Logos', icon: faPalette },
        { label: 'Images', href: '/Chat?type=Images', icon: faImage },
        { label: 'Resumes', href: '/Chat?type=Resumes', icon: faFileAlt },
        { label: 'Texts', href: '/Chat?type=Texts', icon: faFont },
    ];

    return (
        <div className="w-72 mt-16 bg-white h-full fixed shadow-md opacity-100" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="flex flex-col p-4 space-y-2">
                
                    <Link  href="/Chat?type=Memes" >
                        <div className='flex items-center p-3 rounded-lg hover:bg-sky-100 transition duration-300 ease-in-out'>
                            <FlutterDashIcon/>
                            <span className="text-lg  text-black-400 ml-4">Memes</span>
                        </div>
                    </Link>
                    <Link  href="/Chat?type=Logos" >
                        <div className='flex items-center p-3 rounded-lg hover:bg-sky-100 transition duration-300 ease-in-out'>
                            <RedditIcon/>
                            <span className="text-lg  text-black-400 ml-4">Logos</span>
                        </div>
                    </Link>
                    <Link  href="/Chat?type=Images" >
                        <div className='flex items-center p-3 rounded-lg hover:bg-sky-100 transition duration-300 ease-in-out'>
                            <ImageIcon/>
                            <span className="text-lg  text-black-400 ml-4">Images</span>
                        </div>
                    </Link>
                    <Link  href="/Chat?type=Resumes" >
                        <div className='flex items-center p-3 rounded-lg hover:bg-sky-100 transition duration-300 ease-in-out'>
                            <AssignmentIcon/>
                            <span className="text-lg  text-black-400 ml-4">Resumes</span>
                        </div>
                    </Link>
                    <Link  href="/Chat?type=Texts" >
                        <div className='flex items-center p-3 rounded hover:bg-sky-100 transition duration-300 ease-in-out'>
                            <ListAltIcon/>
                            <span className="text-lg  text-black-400 ml-4">Texts</span>
                        </div>
                    </Link>
                
            </div>
        </div>
    );
};

export default Sidebar;
