import React, { useState } from "react";
import {
  Flex,
  Box,
  HStack,
  Button,
  Heading,
  Text,
  Input,
  useToast,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import AuthNavbar from "../features/auth/components/AuthNavbar";
import { signUpWithEmail } from "../features/auth/authFunctions";

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        console.log("Signed up successfully");

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
      signUpWithEmail({ ...userData, toast, setterFunc: setUserData });
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
          <Heading size="xl">Create account</Heading>
          {/* Sign up form */}
          <Flex direction="column" gap={4} alignItems={"center"} width="100%">
            {/* Emaill and password input */}
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
            {/* Google sign up button */}
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
                Sign up with Google
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
            Create account
          </Button>
          <Flex direction="column" width="100%" alignItems={"center"} gap={2}>
            <HStack>
              <Text>Already a user?</Text>
              <Link
                to="/sign-in"
                style={{
                  color: "#F7FAFC",
                  fontWeight: "bold",
                }}
              >
                Log in
              </Link>
            </HStack>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Signup;
