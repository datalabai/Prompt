import Link from 'next/link';
import Dhashboard from './components/Dashboard';
import WelcomeSlides from './components/WelcomeSlides';
const Home = () => {
    return (
        <><WelcomeSlides /><div className="flex flex-col items-center justify-center min-h-screen">
            {/* <div className="flex flex-col  w-fit p-2 absolute top-[45%]">
                <h1 className="text-3xl font-bold mb-4 ml-12">Welcome to   <font color="#FF2626">P</font>
                    <font color="#252A34">R</font>
                    <font color="#753422">O</font>
                    <font color="#FFD523">M</font>
                    <font color="#71EFA3">P</font>
                    <font color="#FFCCCC">T</font>
                </h1>
                <p className="text-lg text-gray-600 mb-8">Start Engaging in Channels to interact with Models</p>
            </div> */}
        </div></>
    );
};

export default Home;
