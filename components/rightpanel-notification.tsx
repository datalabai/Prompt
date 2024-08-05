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
  import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";


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
  
  export function RightNotifications() {
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  
    useEffect(() => {
        const fetchRecentPosts = async () => {
          try {
            const recentPostsRef = collection(db, "recentPosts");
            const recentPostsQuery = query(recentPostsRef, orderBy("createdAt", "desc"), limit(5));
            const recentPostsSnapshot = await getDocs(recentPostsQuery);
            const posts = recentPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RecentPost[];
            setRecentPosts(posts);
          } catch (error) {
            console.error("Error fetching recent posts:", error);
          }
        };
    
        fetchRecentPosts();
      }, []);
  
    return (
      <div className="h-[685px] overflow-y-auto">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-large">RecentPosts</CardTitle>
            <CardDescription>
              {/* You can add some tag line for recent prompts here */}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1">
            {recentPosts.map(post => (
              <div key={post.id} className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src={post.photo || "default-avatar-url"} alt="Avatar" />
                  <AvatarFallback>KS</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{post.name|| "Unknown Author"}</p>
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
  