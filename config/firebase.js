import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCRX_ngaOYtxI0GQM-LhyV4Rkf30bB5zIY",
    authDomain: "lightningnode-60dc0.firebaseapp.com",
    projectId: "lightningnode-60dc0",
    storageBucket: "lightningnode-60dc0.appspot.com",
    messagingSenderId: "1075221583613",
    appId: "1:1075221583613:web:b52326369ddaa358b89094"
};

initializeApp(firebaseConfig);

export {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
};

