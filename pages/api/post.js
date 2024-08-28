const {onRequest} = require("firebase-functions/v2/https");

const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

const notifyNewPost = onRequest(async (req, res) => {
    const postsRef = db.collection('General');
    const snapshot = await postsRef.orderBy('createdAt', 'desc').limit(1).get();
    const post = snapshot.docs[0].data();
    
    res.json(post);
    });