import axiosInstance from "@/lib/axios";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@/lib/firebase";

import { getFirebaseErrorMessage } from "@/lib/firebaseError";

export class AuthService {
  static async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const response = await axiosInstance.post("/auth/login");

      return response.data;
    } catch (error: any) {
      if (error.code) {
        throw new Error(getFirebaseErrorMessage(error.code));
      }
      throw new Error("Помилка логіну на бекенді");
    }
  }
  static async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const response = await axiosInstance.post("/auth/register", {
        email: user.email,
        firebaseUid: user.uid,
      });

      return response.data;
    } catch (error: any) {
      if (error.code) {
        throw new Error(getFirebaseErrorMessage(error.code));
      }
      throw new Error("Помилка реєстрації на бекенді");
    }
  }
}
