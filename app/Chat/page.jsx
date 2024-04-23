"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCornerUpLeft, FiThumbsUp } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import { auth } from '../firebase';
import { updateLikesInFirebase } from '../firebase';
import ReplySection from '../components/Reply.jsx'; // Update the path as per your file structure
import { listenForMessages } from '../firebase'; // Update the path as per your file structure
import { addMessageToChannel, addCommentToMessage, getAllMessagesFromChannel, getAllCommentsFromMessage } from '../firebase';
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Chat = () => {
    const searchParams = useSearchParams();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [user, setUser] = useState('');
    const [type, setType] = useState('');
    const messagesEndRef = useRef(null);
    const [showReplySection, setShowReplySection] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null); // Track which message is being replied to
    const [likedMessages, setLikedMessages] = useState(new Set());
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageLoad = () => {
        // Handle image loading completion if needed
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            setUser(user); // Update user state based on authentication status
        });

        return () => unsubscribeAuth(); // Clean up the listener when the component unmounts
    }, []);

    useEffect(() => {
        const search = searchParams.get('type');
        setType(search || '');    
        setUser(auth.currentUser);
        // Load initial messages from Firebase
        const loadMessages = async () => {
            const fetchedMessages = await getAllMessagesFromChannel(search || '');
            setMessages(fetchedMessages);
        };
    
        loadMessages();
        console.log('Messages loaded successfully.');
    
        // Start listening for real-time messages
        const unsubscribeMessages = listenForMessages(search || '', (realtimeMessages) => {
            setMessages(realtimeMessages);
        });
    
        // Clean up the listener when the component unmounts
        return () => unsubscribeMessages();
    }, [searchParams]);
    

    const handleSendMessage = async () => {
        if (inputValue.trim() !== '') {
            if (selectedMessage !== null) {
                await addCommentToMessage(type, selectedMessage.id, { text: inputValue, user: 'user' });
                setShowReplySection(false); // Hide the reply section after sending the message
                setSelectedMessage(null); // Clear the selected message state
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
                await addMessageToChannel(type,{text:inputValue});
            }
            setInputValue('');
        }
    };
    

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents default behavior (form submission) on Enter key
            handleSendMessage();
        }
    };

    const handleLike = async (message) => {
        // Check if the message ID is already in the likedMessages set
        const isLiked = likedMessages.has(message.id);
    
        // Update like count locally and in Firebase
        const updatedLikesCount = isLiked ? message.likes - 1 : message.likes + 1;
        await updateLikesInFirebase(message.channelId, message.id, updatedLikesCount);
    
        // Update the message in the messages state array with the new like count
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === message.id ? { ...msg, likes: updatedLikesCount } : msg
            )
        );
    
        // Update likedMessages set based on like/unlike action
        setLikedMessages((prevLikedMessages) => {
            const newLikedMessages = new Set(prevLikedMessages);
            if (isLiked) {
                newLikedMessages.delete(message.id); // Remove from likedMessages if unliked
            } else {
                newLikedMessages.add(message.id); // Add to likedMessages if liked
            }
            return newLikedMessages;
        });
    };
    

    const handleReply = (message) => {
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

    // useEffect(() => {
    //     const fetchAndSetImage = async (message) => {
    //         const imageUrl = await fetchImageForMessage(message);
    //         if (imageUrl) {
    //             message.imageUrl = imageUrl;
    //             setMessages((prevMessages) =>
    //                 prevMessages.map((msg) =>
    //                     msg.id === message.id ? { ...msg, imageUrl: imageUrl } : msg
    //                 )
    //             );
    //         }
    //     };

    //     messages.forEach((message) => {
    //         if (!message.imageUrl) {
    //             fetchAndSetImage(message);
    //         }
    //     });
    // }, [messages]);

    return (
        <div className={`flex flex-col h-[700px]  ${showReplySection ? 'w-[50rem]' : ''} ml-72`} style={{ marginTop: '68px' }}>
            {/* Header */}
            {user ? (
                <React.Fragment>
                    <div className="p-4 bg-white border	border-slate-300	">
                        <h2 className="text-lg font-semibold text-gray-800"># {type}</h2>
                    </div>

                    {/* Messages display area */}
                    <div className="flex-grow overflow-y-auto ">
                        {messages.map((message, index) => (
                            <div key={message.id} className="flex flex-col border	border-slate-300">
                                {/* Display date with border */}
                                {/* {index === 0 || formatDate(new Date(message.timestamp)) !== formatDate(new Date(messages[index - 1].timestamp)) ? (
                                    <div className="border-b border-gray-300 pb-2 mb-2">
                                        <div className="text-lg text-gray-500 text-center">{formatDate(new Date(message.timestamp))}</div>
                                    </div>
                                ) : null} */}
                                {/* Individual message with time */}
                                <div className={`flex items-start space-x-4`}>
                                    <div className={'flex bg-white rounded-lg p-6 w-full'}>
                                    <img src={message.userPhoto} alt="Profile" className="w-10 h-10 rounded-full" />
                                    <div className="ml-2 bg-white rounded-lg w-full">
                                        
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-gray-800">{message.userName}<span className="post__headerSpecial">@{message.userName}</span></span>
                                            <span className="text-sm text-gray-500">{formatTime(new Date(message.timestamp))}</span>
                                        </div>
                                        <p className="text-gray-800">{message.text}</p>
                                        {message.imageUrl && (
                                            <img src={message.imageUrl} alt="Message Image" width={250} height={250} onLoad={handleImageLoad} />
                                        )}
                                        <div className="flex items-center space-x-4 mt-2 post__footer">
                                            {/* Reply icon */}
                                            <div>
                                            <ChatBubbleOutlineIcon
                                                className="cursor-pointer text-gray-500 hover:text-gray-700"
                                                size={18}
                                                onClick={() => handleReply(message)}  
                                            />
                                            {/* Display the number of replies */}
                                            <span className="text-sm text-gray-500">{message.replies}</span>
                                            </div>
                                            <RepeatIcon fontSize="small" className="chatBubble"/>
                                            {/* Like icon */}
                                            <div>
                                            <FavoriteBorderIcon
                                                className={`cursor-pointer text-gray-500 hover:text-gray-700 ${likedMessages.has(message.id) ? 'text-blue-500' : ''}`}
                                                size={18}
                                                onClick={() => handleLike(message)}
                                            />
                                            {/* Display the number of likes */}
                                            <span className="text-sm text-gray-500">{message.likes}</span>
                                            </div>
                                            <PublishIcon fontSize="small" className="chatBubble"/>
                                        </div>
                                    </div>
                                     </div>   
                                    
                                </div>                
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center p-4 bg-white mb-5">
                        <div className="mr-4 flex-grow">
                            <input 
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="min-w-full border border-gray-300 rounded-xl p-2  resize-none text-black focus:outline-none"
                            />
                            
                        </div>
                        <div className="bg-nav-lab rounded-xl cursor-pointer w-12 text-center">
                            {/* Replace send button with an icon */}
                            <ArrowForwardIcon
                                onClick={handleSendMessage}
                            />
                        </div>
                    </div>

                    {/* Render reply section if showReplySection is true */}
                    {showReplySection && <ReplySection message={selectedMessage} type={type} 
                    setShowReplySection={setShowReplySection}
                    setSelectedMessage={setSelectedMessage}
                    />}
                </React.Fragment>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-lg text-gray-600">
                        Please <span className="font-semibold cursor-pointer text-blue-600">log in</span> to access the chat.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Chat;
