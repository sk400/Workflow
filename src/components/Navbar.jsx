import React from "react";
import list from "../assets/list.png";
import MenuButtonImage from "../assets/Menu-Btn.png";
import { Avatar, Box, Flex, Heading, HStack } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Flex
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      p={5}
      sx={{
        bgColor: "#FFE794",
      }}
    >
      <Box
        sx={{
          display: { md: "none" },
        }}
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
        <Heading as="h3" size="lg">
          YourTodo
        </Heading>
      </HStack>
      <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
    </Flex>
  );
};

export default Navbar;
