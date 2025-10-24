import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase/config';

export async function createNewUser(userId: string, name?: string, email?: string) {
  try {
    await setDoc(doc(db, "users", userId), {
      name: name || "Anonymous",
      email: email || "",
      createdAt: serverTimestamp(),
      plants: []
    });
    console.log("User added successfully!");
    return { id: userId };
  } catch (e) {
    console.error("Error adding user: ", e);
    throw new Error("Failed to create new user in Firestore.");
  }
}
