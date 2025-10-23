import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase/config';

export async function createNewUser(userId: string, name: string, email: string) {
  try {
    await setDoc(doc(db, "users", userId), {
      name: name,
      email: email,
      createdAt: serverTimestamp(),
      plants: []
    });
    console.log("User added successfully!");
  } catch (e) {
    console.error("Error adding user: ", e);
    throw e;
  }
}