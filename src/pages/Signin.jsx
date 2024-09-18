import React, { useState } from "react";
import {
  Flex,
  Box,
  Button,
  Heading,
  Text,
  Input,
  useToast,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, provider } from "../firebase";
import AuthNavbar from "../features/auth/components/AuthNavbar";
import { signInWithEmail } from "../features/auth/authFunctions";

const Signup = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const toast = useToast();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        console.log("Signed in successfully");

        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) =>
    setUserData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });

  const handleClick = () => {
    try {
      signInWithEmail({
        ...userData,
        navigate,
        toast,
        setterFunc: setUserData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleForgotPassword = () => {
    try {
      sendPasswordResetEmail(auth, userData.email)
        .then(() => {
          toast({
            description: "Password reset email sent",
            status: "success",
            duration: 3000,
            position: "top",
            isClosable: true,
          });
        })
        .catch((error) => {
          console.log(error);
          toast({
            description: error.message,
            status: "error",
            duration: 3000,
            position: "top",
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        minH: "100vh",
        width: "100%",
        bgColor: "#17181E",
      }}
    >
      <AuthNavbar />

      <Flex
        sx={{
          justifyContent: "center",
          alignItems: "center",
          mt: {
            base: 4,
            sm: 5,
            md: 10,
          },
        }}
      >
        <Flex
          maxW={["300px", "300px", "350px"]}
          width={"100%"}
          alignItems={"center"}
          direction="column"
          color="gray.50"
          gap={[8, 8, 10]}
          p={[6, 0]}
        >
          <Heading size="xl">Log in</Heading>
          {/* Sign up form */}
          <Flex direction="column" gap={4} alignItems={"center"} width="100%">
            <Flex direction="column" width="100%" gap={4}>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                variant="outline"
                size="sm"
                bgColor="#17181E"
                focusBorderColor="#17181E"
                autoComplete="off"
                borderRadius="18px"
                onChange={handleChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                variant="outline"
                size="sm"
                bgColor="#17181E"
                focusBorderColor="#17181E"
                autoComplete="off"
                borderRadius="18px"
                onChange={handleChange}
              />
            </Flex>
            <Text>or</Text>
            <Flex direction="column" width="100%">
              <Button
                size="sm"
                bg="#17181E"
                leftIcon={<FcGoogle />}
                boxShadow={"md"}
                variant="outline"
                onClick={() => signInWithGoogle()}
                color="gray.50"
                sx={{
                  borderRadius: "18px",
                  _hover: {
                    bgColor: "#17181E",
                    opacity: 0.8,
                  },
                }}
              >
                Log in with Google
              </Button>
            </Flex>
          </Flex>
          <Button
            size="md"
            bg="#17181E"
            boxShadow={"md"}
            variant="filled"
            bgColor="#3772FF"
            width="100%"
            color="gray.50"
            sx={{
              borderRadius: "13px",
              _hover: {
                bgColor: "#3772FF",
                opacity: 0.8,
              },
            }}
            onClick={handleClick}
          >
            Log in
          </Button>
          <Flex direction="column" width="100%" alignItems={"center"} gap={2}>
            <Flex
              sx={{
                flexDirection: { base: "column", sm: "row" },
                alignItems: "center",
                gap: 2,
              }}
            >
              <Text>Don't have an account?</Text>

              <Link
                to="/sign-up"
                style={{
                  color: "#F7FAFC",
                  fontWeight: "bold",
                }}
              >
                Create account
              </Link>
            </Flex>
            <Text
              fontWeight="bold"
              cursor={"pointer"}
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Signup;
