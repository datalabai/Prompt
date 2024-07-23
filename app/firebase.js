import { Avatar } from "@radix-ui/react-avatar";
import { add } from "date-fns";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { query,where,getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc,setDoc,orderBy,onSnapshot, getCountFromServer,serverTimestamp,Firestore,arrayUnion, arrayRemove} from "firebase/firestore";
import { get } from "http";
import { format } from "date-fns";


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

const MAX_FREE_TRIALS =10;

export const transactions = async () => {
  try {
    const uid = auth.currentUser.uid; 
    console.log('uid:', uid); 
    const response = await fetch(`https://wallet-api-vyxx.onrender.com/trans?uid=${uid}`);
    const data = await response.json();
    console.log('data:', data);
    return data; 
  }
  catch (error) {
    console.error('Error fetching transactions data:', error.message); // Handling any errors that occur during the fetch
  }
};

export const rewards = async () => {
  try {

    const uid = auth.currentUser.uid;
    console.log('uid:', uid);
    const response = await fetch(`https://wallet-api-vyxx.onrender.com/rewards?uid=${uid}`);
    const data = await response.json();
    console.log('data:', data);
    return data;
  }
  catch (error) {
    console.error('Error fetching rewards data:', error.message); // Handling any errors that occur during the fetch
  }
};

export const getProfile = async () => {
  alert("getProfile");
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user is signed in.");
      return null;
    }

    const uid = user.uid;
    console.log('uid:', uid); // Logging the UID for debugging purposes

    const response = await fetch(`https://wallet-api-vyxx.onrender.com/profile?uid=${uid}`);
    const data = await response.json();
    console.log('data:', data);

    const rewards = await fetch(`https://wallet-api-vyxx.onrender.com/rewards?uid=${uid}`).then(res => res.json());
    const transactions = await fetch(`https://wallet-api-vyxx.onrender.com/transactions?uid=${uid}`).then(res => res.json());
    console.log('rewards:', rewards);
    console.log('transactions:', transactions);

    return { user: data, rewards: rewards, transactions: transactions };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
};

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

  export const addPost = async (post, category, option) => {
    console.log("Adding post:", post);
    if (option === "chat" || option === "") {
      try {
        const docRef = await addDoc(collection(db, category), {
          name: post.name,
          email: post.email,
          text: post.text,
          date: post.date,
          photo: post.photo,
          image: post.image,
          likes: [],
          dislikes: [],
          read: true,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      return;
    }
  
    const data = await fetchImageForMessage(post.text);
    if (data.trails <= 0) {
      return "You have no free trails left";
    }
    if (data.image === 'Failed to generate image. Please try again later.') {
      return "fail";
    }
    try {
      const docRef = await addDoc(collection(db, category), {
        name: post.name,
        email: post.email,
        text: post.text,
        date: post.date,
        photo: post.photo,
        likes: [],
        dislikes: [],
        read: true,
        image: data.image,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  
    return `You have ${data.trails} free trails left`;
  };
  
  
  export const getPosts = (category, callback) => {
    const user=auth.currentUser?.displayName;
    // Create a query that orders documents by the 'createdAt' field
    if(category === "Expert"){
      const postsQuery = query(collection(db, "General"), orderBy("date", "desc"));
      // Set up the real-time listener
      const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (!data.image && data.name !== user) {
            console.log('Data inside:', data);
            posts.push({ id: doc.id, ...data });
          }
        });
        callback(posts);
      });
      // Return the unsubscribe function to allow for cleanup
      return unsubscribe;
    }
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


  const resetFreeTrials = async (userRef, userDoc) => {
    const today = format(new Date(), "yyyy-MM-dd");
    
    if (!userDoc.lastReset || userDoc.lastReset !== today) {
      await updateDoc(userRef, {
        freeTrials: MAX_FREE_TRIALS,
        lastReset: today,
      });
      return MAX_FREE_TRIALS;
    }
  
    return userDoc.freeTrials;
  };
  
  const fetchImageForMessage = async (message) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is signed in.");
    }
  
    const userRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userRef);
  
    if (!userDocSnap.exists()) {
      throw new Error("User document does not exist.");
    }
  
    const userDoc = userDocSnap.data();
    let freeTrials = await resetFreeTrials(userRef, userDoc);
  
    if (freeTrials <= 0) {
      return {image:"",trails:freeTrials}
    }
  
    try {
      const response = await fetch(`https://sandbox-410710.el.r.appspot.com/?prompt=${message}`);
      const data = await response.text();
  
      // Decrement free trials
      await updateDoc(userRef, {
        freeTrials: freeTrials - 1,
      });
  
      return {image:data,trails:freeTrials}
    } catch (error) {
      console.error("Error fetching image:", error);
      return "Failed to generate image. Please try again later.";
    }
  };
  export const addReply = async (postId,category,reply,option) => {
    console.log("Adding reply:", reply);
    try {
      if(option === "prompt"){
        console.log(reply);
        const data= await fetchImageForMessage(reply.text); 
        if(data.freeTrials<=0)
          {
            return "You have no freeTrails left";
          }
        if(data.image=='Failed to generate image. Please try again later.')
          {
            return "Failed to Generate Image. Please try again later.";
          }
        const postRef = doc(db, category, postId);
        await addDoc(collection(postRef, "replies"), {
          name:reply.name,
          text:reply.text,
          email:reply.email,
          date:reply.date,
          createdAt: serverTimestamp(),
          image:data.image,
          photo:reply.photo
        });
       return `you have ${data.trails} freeTrails left`;
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
      return;
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

  export const likePost = async (postId, category) => {
    const userId = auth.currentUser?.uid;
    const postRef = doc(db, category, postId);
  
    try {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        dislikes: arrayRemove(userId) // Remove from dislikes if previously disliked
      });
    } catch (e) {
      console.error('Error liking post: ', e);
    }
  }

  export const dislikePost = async (postId, category) => {
    const userId = auth.currentUser?.uid;
    const postRef = doc(db, category, postId);
  
    try {
      await updateDoc(postRef, {
        dislikes: arrayUnion(userId),
        likes: arrayRemove(userId) // Remove from likes if previously liked
      });
    } catch (e) {
      console.error('Error disliking post: ', e);
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
    console.log("Replies:", replies);
    callback(replies);
  }, (error) => {
    console.error("Error listening for replies:", error);
  });
};

export const generateChatId = (uid1, uid2) => [uid1, uid2].sort().join('_');

// Get or create a chat room
export const getOrCreateChatRoom = async (uid1, uid2) => {
  const chatId = generateChatId(uid1, uid2);
  const chatRef = doc(db, 'chats', chatId);
  const chatDoc = await getDoc(chatRef);
  if (!chatDoc.exists) {
    await chatRef.set({ createdAt: new Date() });
  }
  return chatId;
};

export const getUid = async (email) => {
  const userRef = collection(db, 'users');
  const q = query(userRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  let uid = '';
  querySnapshot.forEach((doc) => {
    uid = doc.data().uid;
  });
  return uid;
};

// Send a message
export const sendMessage = async (receiverEmail, message) => {
  const uid2 = auth.currentUser?.uid;
  let uid1=await getUid(receiverEmail);
  const chatId = await getOrCreateChatRoom(uid2, uid1);
  //alert(chatId);
  try {
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: message.text,
      createdAt: serverTimestamp(),
      avatar: message.avatar,
      name: message.name,
    });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};
export const listenForMessages = (chatId, callback) => {
  const messagesQuery = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
  const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => messages.push(doc.data()));
    callback(messages);
  });
  return unsubscribe;
};


export { auth, db, query,where, collection, addDoc, getDocs, getDoc, doc, updateDoc,setDoc,orderBy,onSnapshot, getCountFromServer,serverTimestamp};
