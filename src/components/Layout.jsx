import { Box, Flex, useDisclosure } from "@chakra-ui/react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import React from "react";

const Layout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <Flex direction={"column"} sx={{ height: "100vh", overflow: "hidden" }}>
      <Flex
        sx={{
          flex: 1,
          position: "relative",
        }}
      >
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
        <Box
          sx={{
            bgColor: "#17181F",
            width: "100%",
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Navbar onOpen={onOpen} btnRef={btnRef} />
          {/* {children} */}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
