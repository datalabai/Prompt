"use client"
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { addPost, getPosts, addReply, getReplies } from '../firebase';
import { auth } from '../firebase';

type ReplyMessage = {
  user: string;
  photo: string;
  message: string;
};

type ReplyMessagesState = {
  [postId: string]: ReplyMessage[];
};

type Post = {
  id: string;
  user: string;
  photo: string;
  message: string;
  createdAt: any;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [replyMessages, setReplyMessages] = useState<ReplyMessagesState>({});
  const [newPostMessage, setNewPostMessage] = useState('');
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const userName = auth.currentUser?.displayName;

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  const handleReply = async (postId: string, message: string) => {
    const newReply = {
      user: auth.currentUser?.displayName,
      photo: auth.currentUser?.photoURL,
      message
    };
    await addReply(postId, newReply);
    
    const updatedReplies = await getReplies(postId);
    setReplyMessages(prevState => ({
      ...prevState,
      [postId]: updatedReplies
    }));
  };

  const toggleReplies = async (postId: string) => {
    if (activeReplyPostId === postId) {
      setActiveReplyPostId(null);
    } else {
      setActiveReplyPostId(postId);
      if (!replyMessages[postId]) {
        const fetchedReplies = await getReplies(postId);
        setReplyMessages(prevState => ({
          ...prevState,
          [postId]: fetchedReplies
        }));
      }
    }
  };

  const handleAddPost = async () => {
    if (newPostMessage.trim() !== '') {
      const newPost = {
        user: auth.currentUser?.displayName,
        message: newPostMessage.trim(),
        createdAt: new Date(),
        photo: auth.currentUser?.photoURL
      };
      await addPost(newPost);
      setNewPostMessage('');
      
      const updatedPosts = await getPosts();
      setPosts(updatedPosts);
    }
  };

  return (
    <div className='mt-20'>
      <Card>
        <ScrollArea className="min-h-[555px] max-h-[555px] rounded-md p-4 overflow-y-auto">
          {posts.map((post) => (
            <CardContent key={post.id} className="grid gap-8">
              <div className="flex gap-4">
                <img src={post.photo} alt="Profile" className="w-10 h-10 rounded-full" />
                <div className="grid gap-1 w-full">
                  <p className="text-sm font-medium leading-none">
                    {post.user}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {post.message}
                  </p>
                  {activeReplyPostId === post.id && replyMessages[post.id] && replyMessages[post.id].map((reply, index) => (
                    reply.message && reply.message.length > 0 && (
                      <div key={index} className="flex items-center gap-2 ml-10">
                        <img src={reply.photo} alt="Profile" className="w-7 h-7 rounded-full" />
                        <p className="text-sm">{reply.user}: {reply.message}</p>
                      </div>
                    )
                  ))}
                  {activeReplyPostId === post.id && (
                    <div>
                      <textarea
                        className="w-full border rounded pl-2 h-8 mt-2"
                        placeholder={`Reply to post ${post.user}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim() !== '') {
                            handleReply(post.id, e.target.value.trim());
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="ml-auto font-medium flex gap-1 items-center">
                  <MessageSquare onClick={() => toggleReplies(post.id)} />
                  <Heart />
                </div>
              </div>
            </CardContent>
          ))}
        </ScrollArea>
        <CardFooter>
          <input
            type="text"
            placeholder="Comment..."
            className="w-full border rounded p-2"
            value={newPostMessage}
            onChange={(e) => setNewPostMessage(e.target.value)}
          />
          <button onClick={handleAddPost} className="ml-2 bg-blue-500 text-white rounded px-4 py-2">
            Send
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}