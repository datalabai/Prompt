// components/Home.js
import Link from 'next/link';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex flex-col  w-fit p-2 absolute top-[45%]">
                <h1 className="text-3xl font-bold mb-4 ml-12">Welcome to Datalab AI</h1>
                <p className="text-lg text-gray-600 mb-8">Start Engaging in Channels to interact with Models</p>
            </div>
        </div>
    );
};

export default Home;
