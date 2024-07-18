import React from "react";
import list from "../assets/list.png";
import MenuButtonImage from "../assets/Menu-Btn.png";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  PopoverArrow,
} from "@chakra-ui/react";
import { PiSignOut } from "react-icons/pi";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useGlobalState } from "../context";

const Navbar = ({ onOpen, btnRef }) => {
  const { user } = useGlobalState();

  return (
    <Flex
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        bgColor: "#FFE794",
        p: { base: 3, md: 5 },
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 1,
        boxShadow: "sm",
      }}
    >
      <Box
        sx={{
          display: { md: "none" },
        }}
        ref={btnRef}
        onClick={onOpen}
      >
        <img
          src={MenuButtonImage}
          alt="Menu Button"
          style={{
            width: "40px",
            height: "30px",
            cursor: "pointer",
          }}
        />
      </Box>
      <HStack>
        <img
          src={list}
          alt="List Icon"
          style={{
            width: "40px",
            height: "40px",
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
      <Popover>
        <PopoverTrigger>
          <Avatar name={user?.name} src={user?.photo} cursor={"pointer"} />
        </PopoverTrigger>
        <PopoverContent
          sx={{
            width: "150px",
          }}
        >
          <PopoverArrow />

          <PopoverBody>
            <Button
              leftIcon={<PiSignOut />}
              variant="solid"
              onClick={() => signOut(auth)}
              sx={{
                bgColor: "white",
                _hover: {
                  bgColor: "white",
                },
              }}
            >
              Sign out
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

export default Navbar;
