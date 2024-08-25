"use client"; 

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { db } from '@/app/firebase';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from "firebase/firestore";


interface RecentPrompts {
  id: string;
  name: string;
  email: string;
  text: string;
  date: Date;
  photo: string;
  image: string;
  likes: never[];
  dislikes: never[];
  read: boolean;
}

export function RecentPrompts() {
  const [recentPosts, setRecentPosts] = useState<RecentPrompts[]>([]);
  const [showFullImage, setShowFullImage] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const recentPostsRef = collection(db, "recentPosts");
        const recentPostsQuery = query(recentPostsRef, orderBy("createdAt", "desc"), limit(5));
        const recentPostsSnapshot = await getDocs(recentPostsQuery);
        const posts = recentPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RecentPrompts[];
        setRecentPosts(posts);
        localStorage.setItem('recentPosts', JSON.stringify(posts));
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    const recentPostsFromStorage = localStorage.getItem('recentPosts');
    if (recentPostsFromStorage) {
      setRecentPosts(JSON.parse(recentPostsFromStorage));
    } else {
      fetchRecentPosts();
    }

    const recentPostsRef = collection(db, "recentPosts");
    const recentPostsQuery = query(recentPostsRef, orderBy("createdAt", "desc"), limit(5));
    const unsubscribe = onSnapshot(recentPostsQuery, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RecentPrompts[];
      setRecentPosts(posts);
      localStorage.setItem('recentPosts', JSON.stringify(posts));
    });

    return () => unsubscribe();
  }, []);

  const handleShowMore = (postId: string) => {
    setShowFullImage(prevState => ({
      ...prevState,
      [postId]: true
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="border-none shadow-none">
       
        <CardContent className="overflow-y-auto max-h-[calc(100vh-150px)]">
          {recentPosts.map(post => (
            <div key={post.id} className="max-h-40 overflow-hidden flex items-start space-x-4 p-2 mb-2 transition-all hover:bg-accent hover:text-accent-foreground border rounded-lg">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={post.photo || "default-avatar-url"} alt="Avatar" />
                <AvatarFallback>KS</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{post.name || "Unknown Author"}</p>
                <p className="text-sm text-muted-foreground">{post.text.substring(0, 100) || "No description available"}...</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
