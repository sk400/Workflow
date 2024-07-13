import { Box, Flex, useDisclosure } from "@chakra-ui/react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import React from "react";

const Layout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <Flex direction={"column"}>
      <Navbar onOpen={onOpen} btnRef={btnRef} />
      <Flex
        sx={{
          flex: 1,
        }}
      >
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
        <Box
          sx={{
            bgColor: "#FFE1BD",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
