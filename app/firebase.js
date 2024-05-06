// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Keypair } from "@solana/web3.js";
import { HDKey } from "micro-ed25519-hdkey";
import * as bip39 from "bip39";
// import .env file
import * as dotenv from "dotenv";
import { query,where,getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc,setDoc,orderBy,onSnapshot, getCountFromServer} from "firebase/firestore";
import { FieldValue } from "firebase/firestore";


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
dotenv.config();

export const addUserToFirestore = async (user) => {
  try {
    console.log(process.env.mnemonic);
    console.log('menmoic');
    const userRef = doc(db, "users", user.uid);
    const collectionRef = collection(db, 'users');
    const querySnapshot = await getDocs(collectionRef);
    const index = querySnapshot.size;
    console.log("Index:", index);

    // Check if the user document already exists
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("Document with UID", user.uid, "already exists.");
      return; // Exit the function if the user document exists
    }

    // Generate Solana wallet address
    console.log(process.env.mnemonic);
    const mnemonic = process.env.mnemonic || "";
    console.log(mnemonic);
    const seed = bip39.mnemonicToSeedSync(mnemonic, "");
    console.log(seed.toString("hex"));
    const hd = HDKey.fromMasterSeed(seed.toString("hex"));
    const path = `m/44'/501'/${index}'/0'`;
    const keypair = Keypair.fromSeed(hd.derive(path).privateKey);
    console.log(`${path} => ${keypair.publicKey.toBase58()}`);
    await setDoc(userRef, {
      uid: user.uid,
      photo: user.photoURL,
      displayName: user.displayName,
      email: user.email,
      createdAt: Date.now(),
      address: keypair.publicKey.toBase58(),
      index: index,
      isAdmin: false,
    });
    console.log("User added successfully to Firestore.");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
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
  const channelRef = doc(db, "channels", channelId);
  await setDoc(channelRef, { name: channelId }, { merge: true });

  const user=auth.currentUser;

  // Add message to messages subcollection
  const messagesRef = collection(db, "channels", channelId, "messages");

  console.log(user);
  console.log(messageData.text);
  if(prompt){
  const image= await fetchImageForMessage(messageData.text);
  try {
    await addDoc(messagesRef, {
      text: messageData.text,
      userName: user.displayName,
      userPhoto: user.photoURL,
      imageUrl: image,
      timestamp: Date.now(),
      likes: 0,
      replies: 0
    });
    console.log("Message added successfully.");
  } catch (error) {
    console.error("Error adding message: ", error);
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
      replies: 0
    });
    console.log("Message added successfully.");
  } catch (error) {
    console.error("Error adding message: ", error);
  }
}
};

export const listenForComments = (channelId, messageId, callback) => {
  const commentsRef = collection(db, "channels", channelId, "messages", messageId, "comments");
  const orderedCommentsQuery = query(commentsRef, orderBy("date", "asc"));

  const unsubscribe = onSnapshot(orderedCommentsQuery, (snapshot) => {
    const newComments = [];
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        newComments.push({ id: change.doc.id, ...change.doc.data() });
      }
    });
    callback(newComments);
  });

  return unsubscribe; // Return the unsubscribe function
};

export const listenForMessages = (channelId, callback) => {
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
export const addCommentToMessage = async (channelId, messageId, commentData) => {
  // Create message document if not exists
  const messageRef = doc(db, "channels", channelId, "messages", messageId);

  try {
    // Get the message document snapshot
    const messageDoc = await getDoc(messageRef);
    if (messageDoc.exists()) {
      // Get the current replies count from the message data
      const currentReplies = messageDoc.data().replies || 0;

      // Increment the replies count by 1
      const newRepliesCount = currentReplies + 1;

      // Update the message document with the new replies count
      await updateDoc(messageRef, {
        replies: newRepliesCount,
      });

      // Add comment to comments subcollection
      const commentsRef = collection(
        db,
        "channels",
        channelId,
        "messages",
        messageId,
        "comments"
      );

      await addDoc(commentsRef, {
        text: commentData.text,
        sender: commentData.sender,
        userPhoto: commentData.userPhoto,
        date: Date.now(),
        likes: commentData.likes || 0,
      });

      console.log("Comment added successfully.");
    } else {
      console.error("Message not found.");
    }
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

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

export const updateLikesInFirebase = async (channelId, messageId, newLikesCount) => {
  const messageRef = doc(db, `channels/${channelId}/messages/${messageId}`);

  try {
      await updateDoc(messageRef, {
          likes: newLikesCount,
      });
      console.log('Likes updated successfully in Firebase.');
  } catch (error) {
      console.error('Error updating likes in Firebase:', error);
  }
};



export {auth};