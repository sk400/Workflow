import React from "react";
import {
  Flex,
  Box,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import list from "../assets/list.png";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Signup = () => {
  const navigate = useNavigate();

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

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      position={"relative"}
    >
      <Stack spacing={10} mx={"auto"} maxW={"lg"} px={6}>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={10} align={"center"}>
            {/* Logo */}
            <HStack>
              <img
                src={list}
                alt="List Icon"
                style={{
                  width: "60px",
                  height: "60px",
                }}
              />
              <Heading
                as="h3"
                size="lg"
                sx={{
                  fontFamily: "josefin",
                }}
              >
                YourTodo
              </Heading>
            </HStack>
            {/* Google sign up button */}
            <Stack spacing={4} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"white"}
                leftIcon={<FcGoogle />}
                boxShadow={"md"}
                onClick={signInWithGoogle}
              >
                Sign in with Google
              </Button>
              <Stack>
                <Text align={"center"}>
                  Create account{" "}
                  <Link to="/sign-up" style={{ color: "#0BC5EA" }}>
                    Sign up
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Signup;
