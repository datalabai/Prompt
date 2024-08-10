import React, { useState, useRef } from 'react';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';
import { Badge } from "@/components/ui/badge";
import { BadgeEuro, ThumbsDown, ThumbsUp } from 'lucide-react';
import { likePost,dislikePost } from '@/app/firebase';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const IconWrapper = styled.div`
  color: ""; /* Default color */
  transition: color 0.3s;

  &:hover {
    color: #2463eb /* Color on hover */
  }
`;

interface TextsProps {
  generatedText: string;
  post: any;
  category: string;
}

const Texts: React.FC<TextsProps> = ({ generatedText,post,category }) => {
  const [copied, setCopied] = useState(false);
  const textContentRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (textContentRef.current) {
      const textContent = textContentRef.current.innerText;
      navigator.clipboard.writeText(textContent)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); 
        })
        .catch((error) => console.error('Failed to copy: ', error));
    }
  };

  const handlePostLike = async (postId: string) => {
    await likePost(postId, category);
  }

  const handlePostDislike = async (postId: string) => {
    await dislikePost(postId, category);
  }

  return (
    <div className="pt-4 relative">
      <div ref={textContentRef} className="w-fit  text-content whitespace-pre-wrap text-left">
        {generatedText}
      </div>
      <div className="flex gap-8 ml-0">
                        <Badge variant="stone" className='pl-0'>
                          <button onClick={() => handlePostLike(post.id)}>
                          <IconWrapper><ThumbsUp strokeWidth={1.5} className="h-4 w-4 cursor-pointer  mr-2" /></IconWrapper>
                          </button>
                          <span>{post.likes?.length || 0}</span>
                        </Badge>
                        <Badge variant="stone">
                          <button onClick={() => handlePostDislike(post.id)}>
                          <IconWrapper><ThumbsDown strokeWidth={1.5} className="h-4 w-4 cursor-pointer  mr-2" /></IconWrapper>
                          </button>
                          <span>{post.dislikes?.length || 0}</span>
                        </Badge>
                        <Badge variant="stone">
                        <button
        onClick={handleCopy}      >
        <IconWrapper><CopyIcon className="h-4 w-4" /></IconWrapper>
      
      </button>
      {copied && (
          <CheckIcon className="h-6 w-6" />
        )}
      </Badge>
                      </div>
    
    </div>
  );
};

export default Texts;
