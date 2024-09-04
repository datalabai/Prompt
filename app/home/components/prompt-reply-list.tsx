import { auth, db, doc, getDoc } from '@/app/firebase'; // Import firestore
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MagicWandIcon } from '@radix-ui/react-icons';
import { ArrowDownToLine, ThumbsDown, ThumbsUp, Star, MessageSquare } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const IconWrapper = styled.div`
  color: ""; /* Default color */
  transition: color 0.3s;

  &:hover {
    color: #2463eb /* Color on hover */
  }
`;

// Define types for reply and props
interface Reply {
  id: string;
  photo: string;
  name: string;
  text: string;
  image?: string;
  likes?: string[];
  dislikes?: string[];
  option?: 'prompt' | 'response';
  role?: string;
  replies?: Reply[]; // Add this to support nested replies
}

interface ReplyListProps {
  replies: Reply[];
  itemId: string;
  handleMagicPrompt: (text: string, itemId: string) => void;
  handleLike: (itemId: string, replyId: string) => void;
  handleDislike: (itemId: string, replyId: string) => void;
  Download: (image: string) => void;
  handleReplySubmit: (itemId: string, parentReplyId: string | null | undefined, text: string) => void;
  currentUserId: string; // Add this prop to identify the current user
  postAuthorId: string; // Add this prop to identify the post author
}

const ReplyList: React.FC<ReplyListProps> = ({
  replies,
  itemId,
  handleMagicPrompt,
  handleLike,
  handleDislike,
  Download,
  handleReplySubmit,
  currentUserId,
  postAuthorId
}) => {
  const [replyText, setReplyText] = useState<string>("");
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const capitalizeWords = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase());

  // Sort replies by user name
  const sortedReplies = [...replies].sort((a, b) => a.name.localeCompare(b.name));

  const renderReply = (reply: Reply) => (
    <div key={reply.id} className="flex flex-col mt-2 group">
      <div className="flex">
        <Avatar className="h-8 w-8">
          <AvatarImage src={reply.photo} alt="Avatar" />
          <AvatarFallback>{reply.name.split(" ").map(chunk => chunk[0]).join("")}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col ml-2 w-full">
          <div className="font-semibold flex items-center justify-between">
            <div className="flex items-center">
              <span>{capitalizeWords(reply.name)}</span>
              {reply.role === 'expert' && (
                <Star className="ml-1 h-4 w-4 text-blue-500" fill="currentColor" />
              )}
            </div>
           
            <button 
              className="invisible group-hover:visible"
              onClick={() => {
                setShowReplyInput(true);
                setReplyingTo(reply.id);
              }}
            >
              <MessageSquare className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="line-clamp-2 text-xs flex">{reply.text}
          {reply.option === 'prompt' && (
                <img
                    src="/logo.png" 
                    alt="Logo"
                    onClick={() => handleMagicPrompt(reply.text, reply.id)} 
                    className="w-10 h-10 cursor-pointer" 
                  />
            )}
          </div>
          {reply.image && (
            <>
              <img src={reply.image} alt="Image" width={300} height={550} className="mt-2 mb-2 rounded-lg" />
              <div className="flex gap-9 mt-2">
                <Badge variant="stone">
                  <button onClick={() => handleLike(itemId, reply.id)}>
                    <IconWrapper><ThumbsUp strokeWidth={1.5} className="h-4 w-4 cursor-pointer mr-2" /></IconWrapper>
                  </button>
                  <span>{reply.likes?.length || 0}</span>
                </Badge>
                <Badge variant="stone">
                  <button onClick={() => handleDislike(itemId, reply.id)}>
                    <IconWrapper><ThumbsDown strokeWidth={1.5} className="h-4 w-4 cursor-pointer mr-2" /></IconWrapper>
                  </button>
                  <span>{reply.dislikes?.length || 0}</span>
                </Badge>
                <Badge variant="stone">
                  <IconWrapper><ArrowDownToLine strokeWidth={1.5} className="h-4 w-4 cursor-pointer" onClick={() => Download(reply.image || '')} /></IconWrapper>
                </Badge>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="gap-2 mb-2">
      {sortedReplies.map(reply => renderReply(reply))}
      {showReplyInput && currentUserId && (
        <div className="mt-4">
          <input
            type="text"
            className="w-full border rounded-lg p-2"
            placeholder={`Reply to ${replyingTo ? capitalizeWords(replies.find(r => r.id === replyingTo)?.name || '') : ''}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleReplySubmit(itemId, replyingTo, replyText);
                setReplyText("");
                setShowReplyInput(false);
                setReplyingTo(null);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReplyList;
