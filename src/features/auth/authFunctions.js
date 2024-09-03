import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";

export const signUpWithEmail = async ({
  email,
  password,
  toast,
  setterFunc,
}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    setterFunc({ email: "", password: "" });

    toast({
      description: "Sign-up successful! Verification email sent.",
      status: "success",
      duration: 3000,
      position: "top",
      isClosable: true,
    });
    return user;
  } catch (error) {
    toast({
      description: error.message,
      status: "error",
      duration: 3000,
      position: "top",
      isClosable: true,
    });
  }
};

export const signInWithEmail = async ({
  email,
  password,
  navigate,
  toast,
  setterFunc,
}) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    setterFunc({ email: "", password: "" });

    // Check if the user's email is verified
    if (!user.emailVerified) {
      toast({
        description: "Email not verified. Please check your inbox.",
        status: "error",
        duration: 3000,
      });

      return;
    }

    console.log("Sign-in successful!");
    toast({
      description: "Signed in successfully",
      status: "success",
      duration: 3000,
      position: "top",
      isClosable: true,
    });
    navigate("/");
    return user;
  } catch (error) {
    console.log(error);
    toast({
      description: error.message,
      status: "error",
      duration: 3000,
      position: "top",
      isClosable: true,
    });
  }
};
