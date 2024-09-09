import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { auth, db } from '@/app/firebase';
import { onSnapshot, collection, query, orderBy, limit, getDocs, where, setDoc } from 'firebase/firestore';
import CustomToast from "../expert/components/CustomToast";
import { UserAuth } from './AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { fetchToken } from '@/app/firebase'; // Import your existing fetchToken function

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const audioRef = useRef(null);
  const { user } = UserAuth(); // Use the user from UserAuth context
  const [isExpert, setIsExpert] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user && user.uid) { // Check if user exists and has a uid
        try {
          const userDoc = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setIsExpert(userData.role === 'expert'); // Adjust field name if necessary
            
            // Use the existing fetchToken function
            const token = await fetchToken();
            if (token) {
              // Store the token in Firestore
              await setDoc(userDoc, { fcmToken: token }, { merge: true });
            } else {
              console.log('No registration token available.');
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting document or fetching token:", error);
        }
      } else {
        setIsExpert(false); // Reset isExpert if user is not authenticated
      }
    };

    checkUserRole();
  }, [user]); // Depend on user from UserAuth context

  useEffect(() => {
    if (!user || !isExpert) return;

    const loadNotifiedPostIds = () => {
      const savedIds = localStorage.getItem('notifiedPostIds');
      return savedIds ? new Set(JSON.parse(savedIds)) : new Set();
    };

    const notifiedPostIds = loadNotifiedPostIds();

    const postsQuery = query(collection(db, "General"), orderBy('date', 'desc'), limit(1));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const post = change.doc.data();
          const postId = change.doc.id;

          if (!notifiedPostIds.has(postId)) {
            const toastId = toast.success(<CustomToast item={post} toastId={postId} />, {
              icon: false,
              autoClose: false,
              closeButton: true,
              className: 'rounded-xl shadow-lg p-4',
              position: "bottom-right",
              toastId: postId, // Ensure toastId is set here
            });

            if (audioRef.current) {
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.error("Failed to play sound:", error);
                });
              }
            }

            // Send notification to the expert
            // const expertQuery = query(collection(db, "users"), where("role", "==", "expert"));
            // const expertSnapshot = await getDocs(expertQuery);
            // expertSnapshot.forEach(doc => {
            //   const expertData = doc.data();
            //   if (expertData.fcmToken) {
            //     sendNotificationToExpert(expertData, post, postId);
            //   }
            // });

            notifiedPostIds.add(postId);
            localStorage.setItem('notifiedPostIds', JSON.stringify(Array.from(notifiedPostIds)));
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user, isExpert]);

  // const sendNotificationToExpert = async (expertData, post, postId) => {
  //   try {
  //     const response = await fetch('/api/send-notification', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         token: expertData.fcmToken, 
  //         title: post.name,
  //         message: post.text,
  //         link: `/post/${postId}`,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to send web push notification');
  //     } else {
  //       playNotificationSound(); // Play sound after successful expert notification
  //     }
  //   } catch (error) {
  //     console.error('Error sending web push notification:', error);
  //   }
  // };

  const showToastNotification = (post, postId) => {
    toast.success(<CustomToast item={post} toastId={postId} />, {
      icon: false,
      autoClose: false,
      closeButton: true,
      className: 'rounded-xl shadow-lg p-4',
      position: "bottom-right",
      toastId: postId,
    });
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset audio to start
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Failed to play sound:", error);
        });
      }
    }
  };

  return (
    <NotificationContext.Provider value={null}>
      {children}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <ToastContainer />
    </NotificationContext.Provider>
  );
};
