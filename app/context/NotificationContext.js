import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { auth, db } from '@/app/firebase';
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import CustomToast from "../expert/components/CustomToast";
import { UserAuth } from './AuthContext';
import { getDoc, doc } from 'firebase/firestore';

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const audioRef = useRef(null);
  const user = UserAuth();
  const [isExpert, setIsExpert] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setIsExpert(userData.role === 'expert'); // Adjust field name if necessary
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    checkUserRole();
  }, [user]);

  useEffect(() => {
    if (!user || !isExpert) return;

    const loadNotifiedPostIds = () => {
      const savedIds = localStorage.getItem('notifiedPostIds');
      return savedIds ? new Set(JSON.parse(savedIds)) : new Set();
    };

    const notifiedPostIds = loadNotifiedPostIds();

    const postsQuery = query(collection(db, "General"), orderBy('date', 'desc'), limit(1));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
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

            notifiedPostIds.add(postId);
            localStorage.setItem('notifiedPostIds', JSON.stringify(Array.from(notifiedPostIds)));
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user, isExpert]);

  return (
    <NotificationContext.Provider value={null}>
      {children}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <ToastContainer />
    </NotificationContext.Provider>
  );
};
