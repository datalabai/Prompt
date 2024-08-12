import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MagicWandIcon } from '@radix-ui/react-icons';
import { ArrowDownToLine, ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';
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
}

interface ReplyListProps {
  replies: Record<string, Reply[]>;
  item: { id: string };
  replyVisible: boolean;
  handleMagicPrompt: (text: string, itemId: string) => void;
  handleLike: (itemId: string, replyId: string) => void;
  handleDislike: (itemId: string, replyId: string) => void;
  Download: (image: string) => void;
}

const ReplyList: React.FC<ReplyListProps> = ({
  replies,
  item,
  replyVisible,
  handleMagicPrompt,
  handleLike,
  handleDislike,
  Download
}) => {
  const capitalizeWords = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase());

  if (!replyVisible) return null;

  return (
    <div className="gap-2 mb-2">
      {replies[item.id] && replies[item.id].length > 0 && (
        replies[item.id].map((reply, index) => (
          <div key={index} className="flex mt-2">
            
            {reply.image ? (
              <div className="flex-col">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={reply.photo} alt="Avatar" />
                  <AvatarFallback> {reply.name
                            .split(" ")
                            .map((chunk) => chunk[0])
                            .join("")}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Avatar className="h-8 w-8">
                <AvatarImage src={reply.photo} alt="Avatar" />
                <AvatarFallback> {reply.name
                            .split(" ")
                            .map((chunk) => chunk[0])
                            .join("")}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col ml-2">
              <div className="font-semibold">{capitalizeWords(reply.name)} </div>
              <div className="line-clamp-2 text-xs">
                {reply.option === 'prompt' ? (
                  <div>{reply.text}</div>
                ) : (
                  <span>{reply.text}</span>
                )}
               
              </div>
              {reply.image && (
                <>
                  <img
                    src={reply.image}
                    alt="Image"
                    width={300}
                    height={550}
                    className="mt-2 mb-2 rounded lg"
                  />
                  <div className="flex gap-9 mt-2">
                    <Badge variant="stone">
                      <button onClick={() => handleLike(item.id, reply.id)}>
                        <IconWrapper>
                          <ThumbsUp strokeWidth={1.5} className="h-4 w-4 cursor-pointer mr-2" />
                        </IconWrapper>
                      </button>
                      <span>{reply.likes?.length || 0}</span>
                    </Badge>
                    <Badge variant="stone">
                      <button onClick={() => handleDislike(item.id, reply.id)}>
                        <IconWrapper>
                          <ThumbsDown strokeWidth={1.5} className="h-4 w-4 cursor-pointer mr-2" />
                        </IconWrapper>
                      </button>
                      <span>{reply.dislikes?.length || 0}</span>
                    </Badge>
                    <Badge variant="stone">
                      <IconWrapper>
                        <ArrowDownToLine
                          strokeWidth={1.5}
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => Download(reply.image || '')}
                        />
                      </IconWrapper>
                    </Badge>
                  </div>
                </>
              )}
            </div>
            {reply.option === 'prompt' && (
                  <Badge variant="stone">
                    <IconWrapper>
                      <MagicWandIcon
                        className="h-6 w-6 cursor-pointer ml-12"
                        onClick={() => handleMagicPrompt(reply.text, item.id)}
                      />
                    </IconWrapper>
                  </Badge>
                )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReplyList;
