import React, { createContext, useContext, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { db } from '@/app/firebase'; // Ensure firestore is imported correctly
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import CustomToast from "../expert/components/CustomToast";

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    // Query for the latest post
    const postsQuery = query(collection(db, "General"), orderBy('date', 'desc'), limit(1));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      // Debug: Check the snapshot received
      console.log('Snapshot:', snapshot);

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          // New post added
          const post = change.doc.data();
          console.log('New post:', post);

          toast.success(<CustomToast item={post} />, {
            icon: false,
            autoClose: 5000,
            closeButton: true,
          });

          // Play notification sound
          if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error("Failed to play sound:", error);
              });
            }
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <NotificationContext.Provider value={null}>
      {children}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <ToastContainer />
    </NotificationContext.Provider>
  );
};
