import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { query,where,getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc,setDoc,orderBy,onSnapshot, getCountFromServer,serverTimestamp,Firestore,arrayUnion, arrayRemove} from "firebase/firestore";
import { get } from "http";

const firebaseConfig = {
  apiKey: "AIzaSyBe7LVB7NZGQ4ih869GmtX2iwYvE0hzbLE",
  authDomain: "discordbot-5a1b5.firebaseapp.com",
  projectId: "discordbot-5a1b5",
  storageBucket: "discordbot-5a1b5.appspot.com",
  messagingSenderId: "942074563442",
  appId: "1:942074563442:web:ee7686c5bce688559aebeb"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export const addUserToFirestore = async (user) => {
    console.log("add user to firebase");
    try {
      const userRef = doc(db, "users", user.uid);
      // Check if the user document already exists
      const docSnap = await getDoc(userRef);
      console.log(docSnap.data());
      if (docSnap.exists()) {
        console.log("Document with UID", user.uid, "already exists.");
        await createPrivateChannel(user.uid);
        return; // Exit the function if the user document exists
      }    
      await setDoc(userRef, {
        uid: user.uid,
        photo: user.photoURL,
        displayName: user.displayName,
        email: user.email,
        createdAt: Date.now(),
        isAdmin: false,
      });
      await createPrivateChannel(user.uid);
      await fetch(`https://wallet-api-vyxx.onrender.com/wallet?uid=${user.uid}`);
      console.log("User added successfully to Firestore.");
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
    }
  };

  export const createPrivateChannel = async (userId) => {
    const userChannelRef = doc(db, "privateChannels", userId);
    console.log("CreatePrivateChannel");
  
    try {
      // Check if the private channel already exists
      const channelSnapshot = await getDoc(userChannelRef);
  
      if (!channelSnapshot.exists()) {
        // Private channel does not exist, so create it
        //create a document with user id 
        await setDoc(userChannelRef, { name: userId }, { merge: true });
  
        console.log("Private channel created for user:", userId);
      } else {
        console.log("Private channel already exists for user:", userId);
      }
    } catch (error) {
      console.error("Error creating private channel:", error);
    }
  };

  export const addPost = async (post, category,option) => {
    console.log("Adding post:", post);
    if(option==="chat" || option===""){
      try {
        const docRef = await addDoc(collection(db, category), post);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      return;
    }
    const image= await fetchImageForMessage(post.text); 
      alert(image);
      try {
        const docRef = await addDoc(collection(db, category), {
          ...post,
          image:image,
          createdAt: serverTimestamp(),
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      return;
  };
  
  export const getPosts = (category, callback) => {
    // Create a query that orders documents by the 'createdAt' field
    const postsQuery = query(collection(db, category), orderBy("date", "desc"));
  
    // Set up the real-time listener
    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      callback(posts);
    });
  
    // Return the unsubscribe function to allow for cleanup
    return unsubscribe;
  };


  const fetchImageForMessage = async (message) => {
    console.log('fetching image for:', message);
    try {
        const response = await fetch(`https://sandbox-410710.el.r.appspot.com/?prompt=${message}`);
        const data=await response.text();
        console.log('data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
  };
  
  export const addReply = async (postId,category,reply,option) => {
    try {
      if(option === "prompt"){
        console.log(reply);
        const image= await fetchImageForMessage(reply.text); 
        alert(image);
        const postRef = doc(db, category, postId);
        await addDoc(collection(postRef, "replies"), {
          name:reply.name,
          text:reply.text,
          email:reply.email,
          date:reply.date,
          createdAt: serverTimestamp(),
          image:image,
          photo:reply.photo
        });
        return;
      }
      if(option === "chat")
      {
      const postRef = doc(db, category, postId);
      await addDoc(collection(postRef, "replies"), {
        ...reply,
        createdAt: serverTimestamp(),
      });
      return;
    }
    const postRef = doc(db, category, postId);
      await addDoc(collection(postRef, "replies"), {
        ...reply,
        createdAt: serverTimestamp(),
      });
      console.log("Reply added to post ID: ", postId);
    } catch (e) {
      console.error("Error adding reply: ", e);
    }
  };

  export const likeReply = async (postId, category, replyId) => {
    const userId = auth.currentUser?.uid;
    const replyRef = doc(db, category, postId, 'replies', replyId);
  
    try {
      await updateDoc(replyRef, {
        likes: arrayUnion(userId),
        dislikes: arrayRemove(userId) // Remove from dislikes if previously disliked
      });
    } catch (e) {
      console.error('Error liking reply: ', e);
    }
  };
  
  // Function to dislike a reply
  export const dislikeReply = async (postId, category, replyId) => {
    const userId = auth.currentUser?.uid;
    const replyRef = doc(db, category, postId, 'replies', replyId);
  
    try {
      await updateDoc(replyRef, {
        dislikes: arrayUnion(userId),
        likes: arrayRemove(userId) // Remove from likes if previously liked
      });
    } catch (e) {
      console.error('Error disliking reply: ', e);
    }
  };

  // Add this to your firebase file

// Function to upvote a reply
  
export const listenForReplies = (postId, category, callback) => {
  if (!postId || !category) {
    console.warn("postId or category is empty. Exiting listenForReplies function.");
    return () => {}; // Return a no-op function
  }

  const postRef = doc(db, category, postId);
  const repliesQuery = query(collection(postRef, "replies"), orderBy("createdAt", "asc"));

  return onSnapshot(repliesQuery, (snapshot) => {
    const replies = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        replies.push({ id: doc.id, ...data });
      } else {
        console.warn("Document with no data found:", doc.id);
      }
    });
    callback(replies);
  }, (error) => {
    console.error("Error listening for replies:", error);
  });
};

 

export { auth, db, query,where, collection, addDoc, getDocs, getDoc, doc, updateDoc,setDoc,orderBy,onSnapshot, getCountFromServer,serverTimestamp};
