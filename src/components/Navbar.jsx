import React from "react";
import list from "../assets/list.png";
import MenuButtonImage from "../assets/Menu-Btn.png";
import { Avatar, Box, Flex, Heading, HStack } from "@chakra-ui/react";

const Navbar = ({ onOpen, btnRef }) => {
  return (
    <Flex
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        bgColor: "#FFE794",
        p: { base: 3, md: 5 },
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
      <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
    </Flex>
  );
};

export default Navbar;
