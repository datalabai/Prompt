// Import the functions you need from the SDKs you need
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

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

export const getProfile = async () => {
  try {
    const uid = auth.currentUser.uid; 
    console.log("profile data");
    console.log('uid:', uid); // Logging the UID for debugging purposes
    const response = await fetch(`https://wallet-api-vyxx.onrender.com/profile?uid=${uid}`);
    const data = await response.json();
    console.log('data:', data);
    console.log(data);
    return data; 
  } catch (error) {
    console.error('Error fetching profile data:', error.message); // Handling any errors that occur during the fetch
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

export const addMessageToPrivateChannel = async (messageData,prompt) => {
  const user = auth.currentUser;
  let privateChannelRef ;


  privateChannelRef = doc(db, "privateChannels", user.uid);

  // Ensure the private channel exists
  const privateChannelSnap = await getDoc(privateChannelRef);
  if (!privateChannelSnap.exists()) {
    console.error("Private channel does not exist for user with UID:", user.uid);
    await createPrivateChannel(user.uid);
  }

  const messagesRef = collection(db, "privateChannels", user.uid, "messages");


  if(prompt){
    try {
      console.log('prompt:',prompt);
      console.log(user.uid);
      console.log("Hello Worldddddddddddd");
      console.log(messageData.text);
     const responose=await fetch(`https://wallet-api-vyxx.onrender.com/inprompt?uid=${user.uid}`);
     const data= await responose.json();
     if(!data.sig)
     {
        return {type:'warning',message:"Not Enough Sol"};
     }
     const image= await fetchImageForMessage(messageData.text); 
     if(image=='Failed to generate image. Please try again later.')
      {
        return {type:'error',message:"Failed to load Image,try another"};
      }
      await addDoc(messagesRef, {
        text: messageData.text,
        userName: user.displayName,
        userPhoto: user.photoURL,
        imageUrl: image,
        timestamp: Date.now(),
        });
      console.log("Message added successfully.");
      //import the collection prompt
      const promptRef = collection(db, "prompt");
    const promptData = {
      uid:user.uid,
      prompt:messageData.text,
      sig:data.sig,
      type:"receive",
      wallet:data.wallet,
      time:Date.now()
    };
    await addDoc(promptRef, promptData);
     return {type:'success',message:'0.01 Sol Deduct from wallet'};
    } catch (error) {
      console.error("Error adding message: ", error);
      return {type:'error',message:error};
    }
    }
    else{
    try {
      await addDoc(messagesRef, {
        text: messageData.text,
        userName: user.displayName,
        userPhoto: user.photoURL,
        timestamp: Date.now(),
      });
      console.log("Message added successfully.");
      return {type:'success',message:'0.01 Sol Deduct from wallet'};
    } catch (error) {
      console.error("Error adding message: ", error);
      return {type:'error',message:error};
    }
  }
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

export const addMessageToChannel = async (channelId,messageData,prompt) => {
  // Create channel document if not exists
  if(channelId=='Private')
  {
    const response=await addMessageToPrivateChannel(messageData,prompt);
    return response;
  }
  const channelRef = doc(db, "channels", channelId);
  await setDoc(channelRef, { name: channelId }, { merge: true });

  const user=auth.currentUser;

  const messagesRef = collection(db, "channels", channelId, "messages");

  console.log(user);
  console.log(messageData.text);
  if(prompt){
  try {
    console.log('prompt:',prompt);
    console.log(user.uid);
    console.log("Hello Worldddddddddddd");
    console.log(messageData.text);
   const responose=await fetch(`https://wallet-api-vyxx.onrender.com/inprompt?uid=${user.uid}`);
   const data= await responose.json();
   console.log(data);
   if(!data.sig)
   {
      return {type:'warning',message:"Insfuccient Funds"};
   }
   const image= await fetchImageForMessage(messageData.text); 
   if(image=='Failed to generate image. Please try again later.')
    {
      return {type:'error',message:"Failed to load Image,try another"};
    }
    await addDoc(messagesRef, {
      text: messageData.text,
      userName: user.displayName,
      userPhoto: user.photoURL,
      imageUrl: image,
      timestamp: Date.now(),
      likes: 0,
      replies: 0,
      Ulikes: [],
      activity:false
      });
    console.log("Message added successfully.");
    //import the collection prompt
    const promptRef = collection(db, "prompt");
  const promptData = {
    uid:user.uid,
    prompt:messageData.text,
    sig:data.sig,
    type:"receive",
    wallet:data.wallet,
    time:Date.now()
  };
  await addDoc(promptRef, promptData);
   return {type:'success',message:'1.50 USDC Deduct from wallet'};
  } catch (error) {
    console.error("Error adding message: ", error);
    return {type:'error',message:error};
  }
  }
  else{
  try {
    await addDoc(messagesRef, {
      text: messageData.text,
      userName: user.displayName,
      userPhoto: user.photoURL,
      timestamp: Date.now(),
      likes: 0,
      replies: 0,
      Ulikes:[],
      activity:false
    });
    console.log("Message added successfully.");
    return {type:'success',message:'0.01 Sol Deduct from wallet'};
  } catch (error) {
    console.error("Error adding message: ", error);
    return {type:'error',message:error};
  }
}
};


export const listenForComments = (channelId, messageId, callback) => {
  const commentsRef = collection(db, "channels", channelId, "messages", messageId, "comments");
  const orderedCommentsQuery = query(commentsRef, orderBy("date", "asc"));

  const unsubscribe = onSnapshot(orderedCommentsQuery, (snapshot) => {
    const newComments = [];
    snapshot.forEach((doc) => {
      newComments.push({ id: doc.id, ...doc.data() });
    });
    callback(newComments);
  });

  return unsubscribe; 
};

export const listenForMessages = (channelId, callback) => {
  const user=auth.currentUser;
  if(channelId === 'Private')
  {
    const messagesRef = collection(db, "privateChannels", user.uid, "messages");
  const orderedMessagesQuery = query(messagesRef, orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(orderedMessagesQuery, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    // Reverse the order of messages to display the newest first
    callback(messages.reverse());
  }); 
  return unsubscribe; // Return the unsubscribe function
  }
  const messagesRef = collection(db, "channels", channelId, "messages");
  const orderedMessagesQuery = query(messagesRef, orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(orderedMessagesQuery, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    // Reverse the order of messages to display the newest first
    callback(messages.reverse());
  });

  return unsubscribe; // Return the unsubscribe function
};
// Function to add a new comment to a message
export const addCommentToMessage = async (channelId, messageId, commentData,prompt) => {
  // Create message document if not exists
  const messageRef = doc(db, "channels", channelId, "messages", messageId);
  const user =auth.currentUser;

  try {
    // Get the message document snapshot
    const messageDoc = await getDoc(messageRef);
    if (messageDoc.exists()) {
      // Get the current replies count from the message data
      // Add comment to comments subcollection
      
      //update messageRef

      const updateObject = {};
      updateObject['activity'] = true;
  
      // Update the document
      await updateDoc(messageRef, updateObject);
    
      const commentsRef = collection(
        db,
        "channels",
        channelId,
        "messages",
        messageId,
        "comments"
      );

      if(prompt)
      {
        console.log("doing transcation");
        const responose=await fetch(`https://wallet-api-vyxx.onrender.com/inprompt?uid=${user.uid}`);
        const data= await responose.json();
        console.log(data);
        if(!data.sig)
          {
             return {type:'warning',message:"Not Enough USDC"};
          }
          const image= await fetchImageForMessage(commentData.text); 
          if(image=='Failed to generate image. Please try again later.')
           {
             return {type:'error',message:"Failed to load Image,try another"};
           }
           console.log(image);
           console.log(commentData);
        await addDoc(commentsRef, {
          text: commentData.text,
          sender: commentData.sender,
          userPhoto: commentData.userPhoto,
          imageUrl:image,
          date: Date.now(),
          likes: commentData.likes || 0,
          dislikes:0,
          plikes:[],
          pdislikes:[],
          CImg:0,
          uid:commentData.uid
        });
        const promptRef = collection(db, "prompt");
        const promptData = {
          uid:user.uid,
          prompt:commentData.text,
          sig:data.sig,
          type:"receive",
          wallet:data.wallet,
          time:Date.now()
        };
        await addDoc(promptRef, promptData);
        const currentReplies = messageDoc.data().replies || 0;

      const newRepliesCount = currentReplies + 1;

      await updateDoc(messageRef, {
        replies: newRepliesCount,
      });
      
      console.log("Comment added successfully.");
      return {type:'success',message:'1.10 USDC Deduct from wallet'};
      }
      else
      {
      const doc=await addDoc(commentsRef, {
        text: commentData.text,
        sender: commentData.sender,
        userPhoto: commentData.userPhoto,
        date: Date.now(),
        likes: commentData.likes || 0,
        dislikes:0,
        plikes:[],
        pdislikes:[],
        CImg:0,
        uid:commentData.uid
      });

      console.log(doc);
      const currentReplies = messageDoc.data().replies || 0;

      const newRepliesCount = currentReplies + 1;

      await updateDoc(messageRef, {
        replies: newRepliesCount,
      });
      
      console.log("Comment added successfully.");
    }
    return {type:'normal',message:'1.10 Sol Deduct from wallet'};
    } else {
      console.error("Message not found.");
      return {type:'error',message:"Message not found"};
    }
  } catch (error) {
    console.error("Error adding comment: ", error);
    return {type:'error',message:error};
  }
};

//function to update a comment in messagee
export const updateComment = async (channelId, messageId, commentId, commentData) => {
  const commentRef = doc(db, `channels/${channelId}/messages/${messageId}/comments/${commentId}`);

  try {
    await updateDoc(commentRef, {
      CImg: commentData+1,
    });
    console.log("Comment updated successfully.");
  } catch (error) {
    console.error("Error updating comment: ", error);
  }
}



// Function to retrieve all messages from a channel
export const getAllMessagesFromChannel = async (channelId) => {
  const messagesRef = collection(db, "channels", channelId, "messages");
  const orderedMessagesQuery = query(messagesRef, orderBy("timestamp", "desc"));

  try {
    const querySnapshot = await getDocs(orderedMessagesQuery);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    console.log(messages.rev);
    return messages.reverse();
  } catch (error) {
    console.error("Error getting messages: ", error);
    return [];
  }
};


// Function to retrieve all comments from a message
export const getAllCommentsFromMessage = async (channelId, messageId) => {
  const commentsRef = collection(db, "channels", channelId, "messages", messageId, "comments");
  const commentsQuery = query(commentsRef);

  try {
    const querySnapshot = await getDocs(commentsQuery);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    return comments;
  } catch (error) {
    console.error("Error getting comments: ", error);
    return [];
  }
};

export const addLiketoComment = async (channelId, messageId, commentId) => {
  const commentRef = doc(db, `channels/${channelId}/messages/${messageId}/comments/${commentId}`);
  try {
    const docSnap = await getDoc(commentRef);
    const data = docSnap.data();

    if (data.plikes.includes(auth.currentUser.uid)) {
      await updateDoc(commentRef, {
        likes: data.likes - 1,
        plikes: data.plikes.filter(id => id !== auth.currentUser.uid),
      });
      return data.likes - 1;
    } else {
      await updateDoc(commentRef, {
        likes: data.likes + 1,
        plikes: [...data.plikes, auth.currentUser.uid],
      });
      return data.likes + 1;
    }
  } catch (error) {
    console.error('Error updating likes in Firebase:', error);
    return data.likes;
  }
};

// Function to add a dislike to the comment of a particular message id
export const addDisLiketoComment = async (channelId, messageId, commentId) => {
  const commentRef = doc(db, `channels/${channelId}/messages/${messageId}/comments/${commentId}`);
  try {
    const docSnap = await getDoc(commentRef);
    const data = docSnap.data();

    if (data.pdislikes.includes(auth.currentUser.uid)) {
      await updateDoc(commentRef, {
        dislikes: data.dislikes - 1,
        pdislikes: data.pdislikes.filter(id => id !== auth.currentUser.uid),
      });
      return data.dislikes - 1;
    } else {
      await updateDoc(commentRef, {
        dislikes: data.dislikes + 1,
        pdislikes: [...data.pdislikes, auth.currentUser.uid],
      });
      return data.dislikes + 1;
    }
  } catch (error) {
    console.error('Error updating dislikes in Firebase:', error);
    return data.dislikes;
  }
};

// Function to update likes of a message
export const updateLikesInFirebase = async (channelId, messageId) => {
  const messageRef = doc(db, `channels/${channelId}/messages/${messageId}`);
  try {
    const docSnap = await getDoc(messageRef);
    const data = docSnap.data();
    const userId = auth.currentUser.uid;

    if (data.Ulikes.includes(userId)) {
      await updateDoc(messageRef, {
        likes: data.likes - 1,
        Ulikes: data.Ulikes.filter(id => id !== userId),
      });
      return data.likes - 1;
    } else {
      await updateDoc(messageRef, {
        likes: data.likes + 1,
        Ulikes: [...data.Ulikes, userId],
      });
      return data.likes + 1;
    }
  } catch (error) {
    console.error('Error updating likes in Firebase:', error);
    return data.likes;
  }
};


export {auth};
