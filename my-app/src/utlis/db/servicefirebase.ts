import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  addDoc,
  where,
  updateDoc,
} from "firebase/firestore";
import app from "./firebase";
import bcrypt from "bcrypt";

const db = getFirestore(app);

/* --- PRODUCT SERVICES --- */

export async function retrieveProducts(collectionName: string) {
  const snapshot = await getDocs(collection(db, collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}

export async function retrieveDataByID(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(db, collectionName, id));
  const data = snapshot.data();
  return data;
}

/* --- AUTH SERVICES --- */

export async function signIn(email: string) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length > 0) {
    return data[0];
  } else {
    return null;
  }
}

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    password: string;
    role?: string;
  },
  callback: Function,
) {
  const q = query(
    collection(db, "users"),
    where("email", "==", userData.email),
  );

  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length > 0) {
    callback({
      status: "error",
      message: "User already exists",
    });
  } else {
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.role = "user";
    await addDoc(collection(db, "users"), userData)
      .then(() => {
        callback({
          status: "success",
          message: "User registered successfully",
        });
      })
      .catch((error) => {
        callback({
          status: "error",
          message: error.message,
        });
      });
  }
}

/* --- OAUTH SERVICES (REFACTORED) --- */

/**
 * Nama fungsi diubah menjadi signInWithGoogle agar sesuai dengan 
 * error import "has no exported member 'signInWithGoogle'" sebelumnya.
 */
export async function signInWithGoogle(data: any, callback: Function) {
  try {
    const q = query(collection(db, "users"), where("email", "==", data.email));
    const querySnapshot = await getDocs(q);
    const userList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (userList.length > 0) {
      // Update data jika user sudah ada (misal update foto profil terbaru dari Google)
      const existingUser: any = userList[0];
      const userRef = doc(db, "users", existingUser.id);
      
      await updateDoc(userRef, {
        fullname: data.fullname,
        image: data.image,
        type: data.type,
      });

      callback({ 
        status: true, 
        data: { ...existingUser, ...data } // Kembalikan data lengkap termasuk role lama
      });
    } else {
      // Registrasi user baru via OAuth
      const newUser = { 
        ...data, 
        role: "member",
        createdAt: new Date() 
      };
      
      await addDoc(collection(db, "users"), newUser);
      callback({ 
        status: true, 
        data: newUser 
      });
    }
  } catch (error) {
    console.error("Firebase OAuth Error:", error);
    callback({ status: false, message: "Failed to process OAuth login" });
  }
}