"use client";

import { auth } from '../firebase';
import { listenForComments, addCommentToMessage, updateLikesInFirebase, addLiketoComment, addDisLiketoComment ,updateComment} from '../firebase';
import { useState, useEffect, useRef } from 'react';
import { FiSend, FiCornerUpLeft, FiThumbsUp } from 'react-icons/fi';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import PublishIcon from "@mui/icons-material/Publish";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { toast } from 'react-toastify';
import { Divider } from '@mui/material';

const ReplySection = ({ message, type, setShowReplySection, setSelectedMessage }) => {
    const [comments, setComments] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [likes, setLikes] = useState(message.likes);
    const commentsEndRef = useRef(null); // Ref for scrolling to end of comments

    useEffect(() => {
        const unsubscribeComments = listenForComments(type, message.id, (newComments) => {
            setComments(newComments);
        });

        return () => unsubscribeComments();
    }, [type, message.id]);

    const addLike = async (comment) => {
        const value = await addLiketoComment(type, message.id, comment.id);
        setComments((prevComments) =>
            prevComments.map((cmt) =>
                cmt.id === comment.id ? { ...cmt, likes: value } : cmt
            )
        );
    };

    const addDislike = async (comment) => {
        const value = await addDisLiketoComment(type, message.id, comment.id);
        setComments((prevComments) =>
            prevComments.map((cmt) =>
                cmt.id === comment.id ? { ...cmt, dislikes: value } : cmt
            )
        );
    };

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleLike = async (message) => {
        const value = await updateLikesInFirebase(type, message.id);
        setLikes(value);
    };

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const generatePrompt = async (text,id,uid,CImg) => {
        const newComment = {
            text: text,
            sender: auth.currentUser.displayName,
            userPhoto: auth.currentUser.photoURL,
            imageUrl: './load-32_128.gif',
            date: Date.now(),
            likes: 0,
            uid: auth.currentUser.uid,
        };
        setComments((prevComments) => [...prevComments, newComment]);
        toast.success('Transaction in progress', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        await updateComment(type, message.id,id,CImg);
        const response = await addCommentToMessage(type, message.id, newComment, true);
        if (response.type != 'normal') {
            if (response.type == 'warning') {
                toast.warning(response.message, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            if (response.type == 'error') {
                toast.error(response.message, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            }
            if (response.type == 'success') {
                toast.success(response.message, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                toast.success('Comment added', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        setInputValue('');
        const unsubscribeComments = listenForComments(type, message.id, (newComments) => {
            setComments(newComments);
        });
    };

    const handleAddComment = async (commentText) => {
        if (commentText.trim() !== '') {
            const newComment = {
                text: commentText,
                sender: auth.currentUser.displayName,
                userPhoto: auth.currentUser.photoURL,
                date: Date.now(),
                likes: 0,
                uid: auth.currentUser.uid,
                CImg:0
            };

            setComments((prevComments) => [...prevComments, newComment]);
            const response = await addCommentToMessage(type, message.id, newComment, false);
            if (response.type == 'normal') {
                toast.success('Comment added', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error(response.message, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            setInputValue('');
            const unsubscribeComments = listenForComments(type, message.id, (newComments) => {
                setComments(newComments);
            });
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header with close button */}
            <div className="flex justify-between items-center border-b-2 p-3 mt-2">
                <h3 className="text-lg font-semibold text-gray-800"># thread</h3>
                <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                        setShowReplySection(false);
                        setSelectedMessage(null);
                    }}
                >
                    <DisabledByDefaultRoundedIcon color="primary" fontSize="large" />
                </button>
            </div>
            <div className="flex flex-col flex-grow overflow-y-auto">
                {/* Message to reply to */}
                <div className="">
                    <div className="bg-white-200 rounded-lg p-3 mb-4">
                        <div className="flex items-start space-x-1">
                            <img src={message.userPhoto} alt="Profile" className="w-10 h-10 rounded-full" />
                            <div className="flex flex-col w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-gray-800 mr-4">{message.userName.charAt(0).toUpperCase() + message.userName.slice(1)}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">{formatTime(new Date(message.timestamp))}</span>
                                </div>
                                <p className="text-gray-800">{message.text}</p>
                                {message.imageUrl && (
                                    <img className="mt-2" src={message.imageUrl} alt="Message" width={250} height={250} />
                                )}
                                <div className="flex items-center space-x-4 mt-2 post__footer">
                                    {/* Reply icon */}
                                    <div>
                                        <ChatBubbleOutlineIcon
                                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                                            size={18}
                                        />
                                        {/* Display the number of replies */}
                                        <span className="text-sm text-gray-500 ml-0.5">{message.replies}</span>
                                    </div>
                                    <RepeatIcon fontSize="small" className="chatBubble" />
                                    {/* Like icon */}
                                    <div>
                                        <FavoriteBorderIcon
                                            className={`cursor-pointer text-gray-500 hover:text-gray-700`}
                                            size={18}
                                            onClick={() => handleLike(message)}
                                        />
                                        {/* Display the number of likes */}
                                        <span className="text-sm text-gray-500 ml-0.5">{likes}</span>
                                    </div>
                                    <PublishIcon fontSize="small" className="chatBubble" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    {/* Comments section with scrollbar */}
                    <div className="bg-white-100 rounded-lg  mb-4 overflow-y-auto flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 p-3">Comments</h3>
                        {comments.map((comment, index) => (
                            <div key={index}>
                                <div className="flex items-start space-x-2 p-3 ">
                                    <img
                                        src={comment.userPhoto}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex flex-col flex-grow">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-gray-800">{comment.sender.charAt(0).toUpperCase() + comment.sender.slice(1)}</span>
                                            <span className="text-sm text-gray-500">{formatTime(new Date(comment.date))}</span>
                                        </div>
                                        <p className="text-gray-800">{comment.text}</p>
                                        {comment.imageUrl && (
                                            <img className="mt-2" src={comment.imageUrl} alt="Message" width={250} height={250} />
                                        )}
                                          <div className="flex items-center space-x-3 mt-2 post__footer">
                                            <div>
                                                <ThumbUpIcon
                                                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                                                    size={16}
                                                    onClick={() => addLike(comment)}
                                                />
                                                <span className="text-sm text-gray-500 ml-0.5 mr-8">{comment.likes}</span>
                                            </div>
                                            <div>
                                                <ThumbDownIcon
                                                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                                                    size={16}
                                                    onClick={() => addDislike(comment)}
                                                />
                                                <span className="text-sm text-gray-500 ml-0.5 mr-8">{comment.dislikes}</span>
                                            </div>
                                            {auth.currentUser.displayName === comment.sender ? (
                                            <AutoFixHighIcon className="cursor-pointer text-gray-400"
                                                size={16}  />
                                            ):
                                            <AutoFixHighIcon className="cursor-pointer text-gray-500 hover:text-gray-700"
                                                size={16}  onClick={() => generatePrompt(comment.text,comment.id,comment.uid,comment.CImg)} />
                                        }
                                        </div>
                                    </div>
                                </div>
                                {index < comments.length - 1 && <Divider />} {/* Add a divider between comments */}
                            </div>
                        ))}
                        <div ref={commentsEndRef} /> {/* Ref for scrolling to end of comments */}
                    </div>
                </div>
            </div>
            {/* Input field for new comment */}
            <Divider />
            <div className="flex items-center p-3 mb-3 ">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-grow px-3 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a comment..."
                />
                <button
                    onClick={() => handleAddComment(inputValue)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg flex items-center"
                >
                    <FiSend className="mr-1" />
                    Send
                </button>
            </div>
        </div>
    );
};

export default ReplySection;
