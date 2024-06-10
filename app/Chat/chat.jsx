"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCornerUpLeft, FiThumbsUp } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import { auth } from '../firebase';
import { updateLikesInFirebase, listenForMessages, addMessageToChannel, addCommentToMessage, getAllMessagesFromChannel } from '../firebase';
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { toast } from 'react-toastify';
import ReplySection from '../components/Reply';

const Chat = () => {
    const searchParams = useSearchParams();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [user, setUser] = useState('');
    const [type, setType] = useState('');
    const messagesEndRef = useRef(null);
    const [showReplySection, setShowReplySection] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [likedMessages, setLikedMessages] = useState(new Set());
    const [imageLoading, setImageLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [selectedMenuOption, setSelectedMenuOption] = useState('chat');

    const handleImageLoad = () => {};

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleMenuClick = () => {
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (showReplySection) {
            setShowReplySection(false);
            setSelectedMessage(null);
        }
    }, [type]);

    useEffect(() => {
        const search = searchParams.get('type');
        setType(search || '');
        setUser(auth.currentUser);

        const loadMessages = async () => {
            const fetchedMessages = await getAllMessagesFromChannel(search || '');
            setMessages(fetchedMessages);
        };

        loadMessages();
        console.log('Messages loaded successfully.');

        const unsubscribeMessages = listenForMessages(search || '', (realtimeMessages) => {
            setMessages(realtimeMessages);
        });

        return () => unsubscribeMessages();
    }, [searchParams]);

    const handleSendMessage = async () => {
        if (inputValue.trim() !== '') {
            if (selectedMessage !== null) {
                await addCommentToMessage(type, selectedMessage.id, { text: inputValue, user: 'user' });
                setShowReplySection(false);
                setSelectedMessage(null);
            } else if (selectedMenuOption === 'prompt') {
                const userName = auth.currentUser.displayName;
                const userPhoto = auth.currentUser.photoURL;
                const newMessage = {
                    text: inputValue,
                    userName: userName,
                    userPhoto: userPhoto,
                    imageUrl: './load-32_128.gif',
                    replies: 0,
                    likes: 0,
                    timestamp: Date.now(),
                };

                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setInputValue('');
                toast.success('Transaction in progress', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                const response = await addMessageToChannel(type, { text: inputValue }, true);
                if (response.type === 'success') {
                    toast.success('1.10 USDC deducted from wallet', {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    toast.info('1 For Model Fee & 0.10 for Platform Fee', {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else if (response.type === 'error') {
                    toast.error(response.message, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.warning('Insufficient Funds', {
                        position: 'top-right',
                        autoClose: 10000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                const unsubscribeMessages = listenForMessages(type || '', (realtimeMessages) => {
                    setMessages(realtimeMessages);
                });
            } else {
                const userName = auth.currentUser.displayName;
                const userPhoto = auth.currentUser.photoURL;
                const newMessage = {
                    text: inputValue,
                    userName: userName,
                    userPhoto: userPhoto,
                    replies: 0,
                    likes: 0,
                    timestamp: Date.now(),
                };

                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setInputValue('');
                const response = await addMessageToChannel(type, { text: inputValue }, false);
                console.log(response);
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMenuOptionClick = (option) => {
        setSelectedMenuOption(option);
        setShowMenu(false);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleLike = async (message) => {
        if (!likedMessages.has(message.id)) {
            setLikedMessages((prevLikedMessages) => new Set([...prevLikedMessages, message.id]));
            const likes = await updateLikesInFirebase(type, message.id);
            message.likes = likes;
            setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === message.id ? { ...msg, likes } : msg)));
            setLikedMessages((prevLikedMessages) => {
                const newLikedMessages = new Set(prevLikedMessages);
                newLikedMessages.delete(message.id);
                return newLikedMessages;
            });
        }
    };

    const handleReply = (message) => {
        console.log('Replying to message:', message);
        setShowReplySection(true);
        setSelectedMessage(message);
    };

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (date) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className=" flex flex-row h-full w-full">
            <div className={`flex flex-col h-full w-1/2 border-r-2`}>
                {user ? (
                    <React.Fragment>
                        <div className={`flex space-x-4 p-4 bg-white border-b`}>
                            <h2 className="text-lg font-semibold text-gray-800"># {type}</h2>
                            <h1 className='items-center mt-1 text-sm text-gray-600'>-</h1>
                            <h1 className='items-center mt-1 text-sm text-gray-600'>This is a {type} channel , users can generate images</h1>
                        </div>

                        <div className="flex-grow overflow-y-auto max-w-auto">
                            {messages.map((message, index) => (
                                <div key={message.id} className="flex flex-col border-slate-300 border-b">
                                    <div className={`flex items-start space-x-4`}>
                                        <div className={'flex bg-white rounded-lg p-6 w-full'}>
                                            <img src={message.userPhoto} alt="Profile" className="w-10 h-10 rounded-full" />
                                            <div className="ml-2 bg-white rounded-lg w-full">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-800">
                                                        {message.userName.charAt(0).toUpperCase() + message.userName.slice(1)}
                                                    </span>
                                                    <span className="text-sm text-gray-500">{formatTime(new Date(message.timestamp))}</span>
                                                </div>
                                                <p className="text-gray-800 ">{message.text}</p>
                                                {message.imageUrl && (
                                                    <img className="rounded-lg mt-2" src={message.imageUrl} alt="Message Image" width={450} height={350} onLoad={handleImageLoad} />
                                                )}
                                                {type !== 'Private' && (
                                                    
                                                    
                                                <div className="flex items-center space-x-4 mt-2 post__footer">
                                                    <div>
                                                        <ChatBubbleOutlineIcon
                                                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                                                            size={18}
                                                            onClick={() => handleReply(message)}
                                                        />
                                                        <span className="text-sm text-gray-500 ml-0.5">{message.replies}</span>
                                                    </div>
                                                    <RepeatIcon fontSize="small" className="chatBubble" />
                                                    <div>
                                                        <FavoriteBorderIcon
                                                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                                                            size={18}
                                                            onClick={() => handleLike(message)}
                                                        />
                                                        <span className="text-sm text-gray-500 ml-0.5">{message.likes}</span>
                                                    </div>
                                                    <PublishIcon fontSize="small" className="chatBubble" />
                                                </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="flex items-center p-4 bg-white">
                            <div className='mr-2 relative'>
                                {showMenu && (
                                    <div className="absolute bottom-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left" onClick={() => handleMenuOptionClick('prompt')}>
                                            <AutoFixHighIcon color="primary" />
                                        </button>
                                        <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left" onClick={() => handleMenuOptionClick('chat')}>
                                            <ChatBubbleOutlineIcon color="primary" />
                                        </button>
                                    </div>
                                )}
                                <AddCircleOutlineIcon
                                    fontSize="large"
                                    color="primary"
                                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                                    size={24}
                                    onClick={handleMenuClick}
                                />
                            </div>

                            <div className="mr-4 flex-grow relative">
                                <div className="flex items-center border border-gray-300 rounded-lg p-2 space-x-2">
                                    {selectedMenuOption === 'prompt' && (
                                        <div className="flex items-center space-x-2">
                                            <AutoFixHighIcon color="primary" />
                                        </div>
                                    )}
                                    {selectedMenuOption === 'chat' && (
                                        <div className="flex items-center space-x-2">
                                            <ChatBubbleOutlineIcon color="primary" className='items-center mt-1' />
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        {...(selectedMenuOption === 'prompt' && { placeholder: 'Type your prompt...' })}
                                        {...(selectedMenuOption === 'chat' && { placeholder: 'Type your message...' })}
                                        className="flex-grow bg-transparent outline-none"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendMessage(e.target.value);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-lg text-gray-600">
                            Please <span className="font-semibold cursor-pointer text-blue-600">log in</span> to access the chat.
                        </p>
                    </div>
                )}
            </div>
            {showReplySection && (
                <div className={`flex flex-col h-full w-1/2 mt-0 border-r-2 `}>
                    <ReplySection 
                        message={selectedMessage} 
                        type={type}
                        setShowReplySection={setShowReplySection}
                        setSelectedMessage={setSelectedMessage}
                    />
                </div>
            )}
        </div>
    );
};

export default Chat;
