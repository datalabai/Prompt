"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { db } from '@/app/firebase';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from "firebase/firestore";

interface RecentPost {
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

export function RecentPosts() {
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const recentPostsRef = collection(db, "recentPosts");
        const recentPostsQuery = query(recentPostsRef, orderBy("createdAt", "desc"), limit(5));
        const recentPostsSnapshot = await getDocs(recentPostsQuery);
        const posts = recentPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RecentPost[];
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
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RecentPost[];
      setRecentPosts(posts);
      localStorage.setItem('recentPosts', JSON.stringify(posts));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Card className="border-none shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-large">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(100vh-150px)]">
          {recentPosts.map(post => (
            <div key={post.id} className="flex items-start space-x-4 p-2 transition-all hover:bg-accent hover:text-accent-foreground">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={post.photo || "default-avatar-url"} alt="Avatar" />
                <AvatarFallback>KS</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{post.name || "Unknown Author"}</p>
                <p className="text-sm text-muted-foreground">{post.text || "No description available"}</p>
                {post.image && (
                  <img src={post.image} alt="Image" width={300} height={550} className="mt-4 mb-2 rounded-lg" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
