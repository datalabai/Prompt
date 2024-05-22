import { auth } from '../firebase';
import { listenForComments, addCommentToMessage } from '../firebase';
import { useState,useEffect,useRef } from 'react';
import { FiSend, FiCornerUpLeft, FiThumbsUp } from 'react-icons/fi';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import PublishIcon from "@mui/icons-material/Publish";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { updateLikesInFirebase } from '../firebase';
import { addLiketoComment,addDisLiketoComment } from '../firebase';
import { toast } from 'react-toastify';


const ReplySection = ({ message ,type,setShowReplySection,setSelectedMessage}) => {
    const [comments, setComments] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [likes,setLikes]=useState(message.likes);
    const commentsEndRef = useRef(null); // Ref for scrolling to end of comments
    const [likedMessages, setLikedMessages] = useState(new Set());


    useEffect(() => {
        const unsubscribeComments = listenForComments(type, message.id, (newComments) => {
            // Append new comments to the existing comments array
            setComments(newComments);
        });

        return () => unsubscribeComments(); // Clean up the listener
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
        // Update the dislike count for the comment in Firebase
       const value= await addDisLiketoComment(type, message.id, comment.id);

        // Update the local state with the new like count
        setComments((prevComments) =>
            prevComments.map((cmt) =>
                cmt.id === comment.id ? { ...cmt, dislikes: value} : cmt
            )
        );
    };


    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleLike = async (message) => {
        // Update the like count in Firebase
        const value= await updateLikesInFirebase(type,message.id);
        setLikes(value);
    };

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const generatePrompt=async(text)=>{
            const newComment = {
                text: text,
                sender: auth.currentUser.displayName,
                userPhoto: auth.currentUser.photoURL,
                imageUrl: './load-32_128.gif',
                date: Date.now(),
                likes: 0,
            };

            setComments((prevComments) => [...prevComments,newComment]);
            const response=await addCommentToMessage(type, message.id, newComment,true);
            if(response!="100")
            {
                toast.success('0.01 Sol deducted from wallet', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            else
            {
                toast.warning('Not Enough Sol', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                const unsubscribeComments = listenForComments(type, message.id, (newComments) => {
                    // Append new comments to the existing comments array
                    setComments(newComments);
                });
            }
            setInputValue('');       
    }
    
    const handleAddComment = async (commentText) => {
        if (commentText.trim() !== '') {
            const newComment = {
                text: commentText,
                sender: auth.currentUser.displayName,
                userPhoto: auth.currentUser.photoURL,
                date: Date.now(),
                likes: 0,
            };

            setComments((prevComments) => [...prevComments,newComment]);
            const response=await addCommentToMessage(type, message.id, newComment,false);
            console.log(response);
            setInputValue('');
        }
    };

return (
    <div className="fixed top-15  h-full min-w-[36rem] bg-white z-10  overflow-y-auto box  ml-[37.9rem]">
        <div className="flex justify-between items-center border-b-2 p-3">
            <h3 className="text-lg font-semibold text-gray-800 ">Replying to:</h3>
            <button
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                    setShowReplySection(false);
                    setSelectedMessage(null);
                }}
            >
                <DisabledByDefaultRoundedIcon color="primary" fontSize='large' />
            </button>
        </div>
        <div className="bg-white-200 rounded-lg p-3 mb-4 max-w-lg">
            <div className="flex items-start space-x-4">
                <img src={message.userPhoto} alt="Profile" className="w-10 h-10 rounded-full" />
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">{message.userName}</span>
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
                            onClick={() => handleReply(message)}
                        />
                        {/* Display the number of replies */}
                        <span className="text-sm text-gray-500 ml-0.5">{message.replies}</span>
                    </div>
                    <RepeatIcon fontSize="small" className="chatBubble" />
                    {/* Like icon */}
                    <div>
                        <FavoriteBorderIcon
                            className={`cursor-pointer text-gray-500 hover:text-gray-700 ${likedMessages.has(message.id) ? 'text-blue-500' : ''}`}
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
        {/* Comments section with scrollbar */}
        <div className="bg-white-100 rounded-lg p-3 mb-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Suggest a prompt</h4>
            <div className="space-y-2">
                {comments.map((comment, index) => (
                    <div key={index} className="flex items-start">
                        <img src={comment.userPhoto} alt="Profile" className="w-8 h-8 rounded-full" />
                        <div className="rounded-lg p-2 ml-2 w-full">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">{comment.sender}</span>
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
                                <AutoFixHighIcon className="cursor-pointer text-gray-500 hover:text-gray-700"
                                    size={16} onClick={()=>generatePrompt(comment.text)}/>
                            </div>
                        </div>
                    </div>
                ))} 
                <div ref={commentsEndRef} /> {/* Ref for scrolling to end */}
            </div>
        </div>
        {/* Comment input */}
        <div className="flex items-center mt-4 mb-28 p-2 ">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Suggest a prompt..."
                className="border border-gray-300 rounded-md p-2 w-full resize-none text-black focus:outline-none"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleAddComment(e.target.value);
                    }
                }}
            />
        </div>
    </div>
);
};

export default ReplySection;