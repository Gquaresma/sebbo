import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config.js";

const fb = initializeApp(firebaseConfig);

export default fb;
