import { Box, Flex, Stack } from "@chakra-ui/react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <Flex direction={"column"}>
      <Navbar />
      <Flex>
        {/* Sidebar */}
        <Sidebar />

        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
