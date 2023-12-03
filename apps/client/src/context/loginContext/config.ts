import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZby9J85T4jwxKmXDA10yrVvkEgLV56vc",
  authDomain: "wits-406604.firebaseapp.com",
  projectId: "wits-406604",
  storageBucket: "wits-406604.appspot.com",
  messagingSenderId: "221792790210",
  appId: "1:221792790210:web:efbeaeda0263d836a9bd5b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const user = auth.currentUser;
if (user !== null) {
  const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;
  const uid = user.uid;
}

export { auth, provider, user };
