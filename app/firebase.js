import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { query,where,getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc,setDoc,orderBy,onSnapshot, getCountFromServer,serverTimestamp} from "firebase/firestore";

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

  export const addPost = async (post) => {
    try {
      const docRef = await addDoc(collection(db, "general"), {
        ...post,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  
  export const getPosts = async () => {
    // Create a query that orders documents by the 'createdAt' field
    const postsQuery = query(collection(db, "general"), orderBy("createdAt"));
  
    // Get the documents matching the query
    const querySnapshot = await getDocs(postsQuery);
    
    // Extract the data from each document
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
  
    return posts;
  };
  export const addReply = async (postId, reply) => {
    try {
      const postRef = doc(db, "general", postId);
      await addDoc(collection(postRef, "replies"), {
        ...reply,
        createdAt: serverTimestamp(),
      });
      console.log("Reply added to post ID: ", postId);
    } catch (e) {
      console.error("Error adding reply: ", e);
    }
  };
  
  export const getReplies = async (postId) => {
    const postRef = doc(db, "general", postId);
    const repliesSnapshot = await getDocs(collection(postRef, "replies"));
    const replies = [];
    repliesSnapshot.forEach((doc) => {
      replies.push({ id: doc.id, ...doc.data() });
    });
    return replies;
  };

export { auth, db, query,where, collection, addDoc, getDocs, getDoc, doc, updateDoc,setDoc,orderBy,onSnapshot, getCountFromServer,serverTimestamp};
