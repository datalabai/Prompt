import { Avatar } from "@radix-ui/react-avatar";
import { add } from "date-fns";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { query,where,getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc,setDoc,orderBy,onSnapshot, getCountFromServer,serverTimestamp,Firestore,arrayUnion, arrayRemove, limit, deleteDoc } from "firebase/firestore";
import { get } from "http";
import { format } from "date-fns";
import dotenv from 'dotenv';
import { act } from "react";
// import { getAnalytics,logEvent } from "firebase/analytics";


dotenv.config();


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const walletApiUrl = process.env.NEXT_PUBLIC_WALLET_API_URL;
const sandboxApiUrl = process.env.NEXT_PUBLIC_SANDBOX_API_URL;

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// const analytics = getAnalytics(app); 

// logEvent(analytics, 'notification Received');
// Prefix with _ to indicate it's intentionally unused

const MAX_FREE_TRIALS =10;

export const transactions = async () => {
  try {
    const uid = auth.currentUser.uid; 
    // console.log('uid:', uid); 
    const response = await fetch(`${walletApiUrl}/trans?uid=${uid}`);
    const data = await response.json();
    // console.log('data:', data);
    return data; 
  }
  catch (error) {
    console.error('Error fetching transactions data:', error.message); // Handling any errors that occur during the fetch
  }
};

export const rewards = async () => {
  try {

    const uid = auth.currentUser.uid;
    // console.log('uid:', uid);
    const response = await fetch(`${walletApiUrl}/rewards?uid=${uid}`);
    const data = await response.json();
    // console.log('data:', data);
    return data;
  }
  catch (error) {
    console.error('Error fetching rewards data:', error.message); // Handling any errors that occur during the fetch
  }
};

export const getProfile = async () => {
  try {
    const uid =localStorage.getItem("uid");
    console.log('uid:', uid); 
    console.log("kishore");
    const user = doc(db, "users", uid);
    const activitiesSnapshot = await getDoc(user);
    const userData = activitiesSnapshot.data();
    console.log("userData");
    console.log(userData);
    const cred = await fetchCredits();
    const data={name:userData.displayName,photo:userData.photo,credits:cred,wallet:userData.wallet,email:userData.email,rewards:userData.rewards};
    if(userData.activities) {
      return { user: data ,transactions: userData.activities.reverse()};
    }
    return { user: data ,transactions: []};
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
};



export const addUserToFirestore = async (user) => {
    // console.log("add user to firebase");
    try {
      const userRef = doc(db, "users", user.uid);
      // Check if the user document already exists
      const docSnap = await getDoc(userRef);
      // console.log(docSnap.data());
      if (docSnap.exists()) {
        // console.log("Document with UID", user.uid, "already exists.");
        await createPrivateChannel(user);
        return; // Exit the function if the user document exists
      }    
      await setDoc(userRef, {
        uid: user.uid,
        photo: user.photoURL,
        displayName: user.displayName,
        email: user.email,
        createdAt: Date.now(),
        isAdmin: false,
        credits: 0,
      });
      await createPrivateChannel(user);
      await fetch(`${walletApiUrl}/wallet?uid=${user.uid}`);
      // console.log("User added successfully to Firestore.");
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
    }
  };

  export const createPrivateChannel = async (user) => {
    console.log(user);
    const userChannelRef = doc(db, "privateChannels", user.uid);
    console.log("CreatePrivateChannel");
  
    try {
      // Check if the private channel already exists
      const channelSnapshot = await getDoc(userChannelRef);
  
      if (!channelSnapshot.exists()) {
        // Private channel does not exist, so create it
        //create a document with user id 
        await setDoc(userChannelRef, { name: user?.displayName}, { merge: true });
  
        console.log("Private channel created for user:", user.uid);
      } else {
        console.log("Private channel already exists for user:", user.uid);
      }
    } catch (error) {
      console.error("Error creating private channel:", error);
    }
  };

  export const addMessageToPrivateChannel = async (post, option) => {
    const user = auth.currentUser;
    const privateChannelRef = doc(db, "privateChannels", user.uid);
  
    // Ensure the private channel exists
    const privateChannelSnap = await getDoc(privateChannelRef);
    if (!privateChannelSnap.exists()) {
      console.error("Private channel does not exist for user with UID:", user.uid);
      await createPrivateChannel(user.uid);
    }
  
    const messagesRef = collection(db, "privateChannels", user.uid, "messages");
  
    const addMessage = async (messageData) => {
      try {
        const docRef = await addDoc(messagesRef, messageData);
        console.log("Document written with ID: ", docRef.id);
        return { type: 'success', id: docRef.id };
      } catch (error) {
        console.error("Error adding message: ", error);
        return { type: 'error', message: error.message };
      }
    };
  
    const generateAndAddMessage = async (prompt, postText) => {
      const data = await fetchImageForMessage(prompt + postText);
      if (data.trials <= 0) {
        return "You have no free trails left";
      }
      if (data.image === 'Failed to generate image. Please try again later.') {
        return "fail";
      }
      const messageData = {
        name: post.name,
        email: post.email,
        text: prompt + postText,
        date: post.date,
        photo: post.photo,
        likes: [],
        dislikes: [],
        read: true,
        image: data.image,
        createdAt: serverTimestamp(),
        option: option,
      };
      return await addMessage(messageData);
    };
  
    switch (option) {
      case 'memes':
        return await generateAndAddMessage("Meme on ", post.text);
  
      case 'logos':
        return await generateAndAddMessage("Logo on ", post.text);
  
      case 'images':
        return await generateAndAddMessage("Image on ", post.text);
  
      case 'text':
      case 'resumes':
        const textData = await FetchText(post.text);
        if (textData.trails <= 0) {
          return "You have no free trails left";
        }
        const messageData = {
          name: post.name,
          email: post.email,
          text: post.text,
          date: post.date,
          photo: post.photo,
          likes: [],
          dislikes: [],
          read: true,
          image: textData.text,
          createdAt: serverTimestamp(),
          option: option,
        };
        return await addMessage(messageData);
  
      case 'prompt':
        return await generateAndAddMessage("Prompt on ", post.text);
  
      default:
        const defaultMessageData = {
          name: post.name,
          email: post.email,
          text: post.text,
          date: post.date,
          photo: post.photo,
          image: post.image,
          likes: [],
          dislikes: [],
          read: true,
          createdAt: serverTimestamp(),
        };
        return await addMessage(defaultMessageData);
    }
  };

  // FetchText function to fetch text from the endpoint
export const FetchText = async (text) => {
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
    return {text:"",trails:freeTrials}
  }
  try {
    
    const response = await fetch(`${sandboxApiUrl}/chat?prompt=${text}`);
    const data = await response.text();
    await updateDoc(userRef, {
      freeTrials: freeTrials - 1,
    });

    return {text:data,trails:freeTrials}
  } catch (error) {
    console.error("Error fetching image:", error);
    return "Failed to generate image. Please try again later.";
  }
};


const updateRecentPosts = async (newPost) => {
  const recentPostsRef = collection(db, "recentPosts");
  
  // Get the current recent posts
  const recentPostsQuery = query(recentPostsRef, orderBy("createdAt", "desc"), limit(5));
  const recentPostsSnapshot = await getDocs(recentPostsQuery);
  const recentPosts = recentPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Add the new post to the beginning of the array
  recentPosts.unshift(newPost);

  // Ensure the array does not exceed 5 elements
  if (recentPosts.length > 5) {
    const oldestPost = recentPosts.pop();
    await deleteDoc(doc(db, "recentPosts", oldestPost.id));
  }

  // Add the new post to the recentPosts collection
  await addDoc(recentPostsRef, newPost);
};

export const addRewards= async (postText,amount) => {
  try {
    const uid=localStorage.getItem("uid");
    const userRef = doc(db, "users", uid);
   //add a new field to the user document
    const userDocSnap = await getDoc(userRef);
    if (!userDocSnap.exists()) {
      console.error("User document does not exist.");
      return;
    }
    if(userDocSnap.data().rewards){
    const total = userDocSnap.data().rewards + amount;
    await updateDoc(userRef, {
      rewards: total,
      activities: arrayUnion({
        activity: "Reward",
        timestamp: new Date(),
        creditsDeducted: amount,
        prompt: postText,
      }),
    });
  }
  else{
    await updateDoc(userRef, {
      rewards: amount,
      activities: arrayUnion({
        activity: "Reward",
        timestamp: new Date(),
        creditsDeducted: amount,
        prompt: postText,
      }),
    });
  }
    console.log("User data updated successfully.");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

// addPost function to add a post to Firebase
export const addPost = async (post, category, option) => {
  console.log("Adding post:", post);
  await addRewards(post.text,1);
  const generateAndAddPost = async (prompt, postText) => {
    const data = await fetchImageForMessage(prompt + postText);
    if (data.trials <= 0) {
      if(data.credits)
      {
        if(data.credits<10)
        {
          return "You have no freeTrails or Credits left ! Please buy credits";
        }
        const newPost = {
          name: post.name,
          email: post.email,
          text: prompt + postText,
          date: post.date,
          photo: post.photo,
          likes: [],
          dislikes: [],
          read: true,
          image: data.image,
          createdAt: serverTimestamp(),
          option: option,
        };
        const docRef = await addDoc(collection(db, category), newPost);
        console.log("Document written with ID: ", docRef.id);
        await updateRecentPosts(newPost);
        return `You have ${data.credits} credits left`;
      }
      return "You have no free trails or Credits left ! Please buy credits";
    }
    if (data.image === 'Failed to generate image. Please try again later.') {
      return "Fail to generate image. Please try again later.";
    }
    try {
      const newPost = {
        name: post.name,
        email: post.email,
        text: prompt + postText,
        date: post.date,
        photo: post.photo,
        likes: [],
        dislikes: [],
        read: true,
        image: data.image,
        createdAt: serverTimestamp(),
        option: option,
      };
      const docRef = await addDoc(collection(db, category), newPost);
      console.log("Document written with ID: ", docRef.id);
      await updateRecentPosts(newPost);
      return `You have ${data.trials} free trails left`;
    } catch (e) {
      console.error("Error adding document: ", e);
      return "Error adding document";
    }
  };

  switch (option) {
    case 'memes':
      return await generateAndAddPost("Meme on ", post.text);

    case 'logos':
      return await generateAndAddPost("Logo on ", post.text);

    case 'images':
      return await generateAndAddPost("Image on ", post.text);

    case 'text':
    case 'resumes':
      const textData = await FetchText(post.text);
      if (textData.trails <= 0) {
        return "You have no free trails left";
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
          image: textData.text,
          option: option,
        });
        console.log("Document written with ID: ", docRef.id);
        return `You have ${textData.trails} free trails left`;
      } catch (e) {
        console.error("Error adding document: ", e);
        return "Error adding document";
      }      
    case 'chat':
    case '':
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
          option: option,
        });
        console.log("Document written with ID: ", docRef.id);
        return;
      } catch (e) {
        console.error("Error adding document: ", e);
        return "Error adding document";
      }

    default:
      if (category === "Text") {
        const textData = await FetchText(post.text);
        if (textData.trails <= 0) {
          return "You have no free trails left";
        }
        try {
          const docRef = await addDoc(collection(db,category), {
            name: post.name,
            email: post.email,
            text: post.text,
            date: post.date,
            photo: post.photo,
            likes: [],
            dislikes: [],
            read: true,
            image: textData.text,
          });
          console.log("Document written with ID: ", docRef.id);
          return `You have ${textData.trails} free trails left`;
        } catch (e) {
          console.error("Error adding document: ", e);
          return "Error adding document";
        }
      } else {
        const data = await fetchImageForMessage(post.text);
        if (data.trials <= 0) {
          if(data.credits)
          {
            if(data.credits<10)
            {
              return "You have no freeTrails or Credits left ! Please buy credits";
            }
            const newPost = {
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
              option: option,
            };
            const docRef = await addDoc(collection(db, category), newPost);
            console.log("Document written with ID: ", docRef.id);
            await updateRecentPosts(newPost);
            return `You have ${data.credits} credits left`;
          }
          return "You have no free trails or Credits left ! Please buy credits";
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
          console.log("Document writcten with ID: ", docRef.id);
          return `You have ${data.trials} free trails left`;
        } catch (e) {
          console.error("Error adding document: ", e);
          return "Error adding document";
        }
      }
  }
};


  
  
  export const getPosts = (category, callback) => {
    const user=auth.currentUser;
    if(category === 'Expert')
    {
      const postsQuery = query(collection(db, "General"),
      orderBy("date", "desc"));
  
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
    }

    if(category === 'Private')
      {
        const messagesRef = collection(db, "privateChannels", user.uid, "messages");
      const orderedMessagesQuery = query(messagesRef, orderBy("date", "desc"));
    
      const unsubscribe = onSnapshot(orderedMessagesQuery, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() });
        });
        console.log("Messages:", messages);
        // Reverse the order of messages to display the newest first
        callback(messages);
      }); 

      return unsubscribe;
    }
    // Create a query that orders documents by the 'createdAt' field in descending order
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
      if (userDoc.credits) {
        if (userDoc.credits < 10) {
          return { image: "", trials: 0, credits: userDoc.credits };
        }
        const response = await fetch(`${sandboxApiUrl}/?prompt=${message}`);
        const data = await response.text();
        await updateDoc(userRef, {
          credits: userDoc.credits - 10,
          activities: arrayUnion({
            activity: "Prompt Generation",
            prompt: message,
            timestamp: new Date(),
            creditsDeducted: 10,
          }),
        });
  
        return { image: data, trials: freeTrials, credits: userDoc.credits - 10 };
      }
      return { image: "", trials: freeTrials, credits: 0 };
    }
  
    try {
      const response = await fetch(`${sandboxApiUrl}/?prompt=${message}`);
      const data = await response.text();
      // Decrement free trials
      await updateDoc(userRef, {
        freeTrials: freeTrials - 1,
        activities: arrayUnion({
          activity: "Prompt Generation",
          prompt: message,
          timestamp: new Date(),
          creditsDeducted: 0,
        }),
      });
      console.log(freeTrials-1);
      return { image: data, trials: freeTrials - 1, credits: userDoc.credits };
    } catch (error) {
      console.error("Error fetching image:", error);
      return "Failed to generate image. Please try again later.";
    }
  };
  


  export const addReply = async (postId,category,reply,option) => {
    // console.log("Adding reply:", reply);
    try {
      if(option === "prompt" && category !=="Text"){
        console.log(reply);
        const data= await fetchImageForMessage(reply.text); 
        if(data.trails<=0)
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
      if(option === "prompt" && category ==="Text"){
        const data= await FetchText(reply.text); 
        if(data.trails<=0)
          {
            return "You have no freeTrails left";
          }
        const postRef = doc(db, category, postId);
        await addDoc(collection(postRef, "replies"), {
          name:reply.name,
          text:reply.text,
          email:reply.email,
          date:reply.date,
          createdAt: serverTimestamp(),
          image:data.text,
          photo:reply.photo,
          likes:[],
          dislikes:[],
        });
       return `you have ${data.trails} freeTrails left`;
      }
      if(option === "chat")
      {
        if(reply.option === "prompt")
          {
            await addRewards(reply.text,2);
          }
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
      // console.log("Reply added to post ID: ", postId);
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

export const updateUserData = async (credits) => {
  try {
    const uid=localStorage.getItem("uid");
    const userRef = doc(db, "users", uid);
   //add a new field to the user document
    const userDocSnap = await getDoc(userRef);
    if (!userDocSnap.exists()) {
      console.error("User document does not exist.");
      return;
    }
    if(userDocSnap.data().credits){
    const total = userDocSnap.data().credits + credits;
    await updateDoc(userRef, {
      credits: total,
    });
  }
  else{
    await updateDoc(userRef, {
      credits: credits,
    });
  }
    console.log("User data updated successfully.");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

export const fetchCredits = async () => {
  try {
    const uid =localStorage.getItem("uid");
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().credits;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching credits:", error);
    return 0;
  }
}
  
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