import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
} from "@chakra-ui/react";
import CreateProject from "./CreateProject";
import Project from "./Project";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, btnRef, onClose }) => {
  const navigate = useNavigate();
  return (
    <Box>
      {/* Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            sx={{
              fontWeight: "semibold",
              fontSize: "32px",
              textAlign: "center",
              fontFamily: "poppins",
            }}
          >
            Projects
          </DrawerHeader>

          <DrawerBody
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <CreateProject />
            <Flex
              sx={{
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* Project list */}

              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                (item, index) => (
                  <Box onClick={() => navigate(`/project/${item}`)} key={index}>
                    <Project name={item} />
                  </Box>
                )
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Box>
        <Box
          sx={{
            width: "250px",
            p: 3,
            display: {
              base: "none",
              md: "flex",
            },
            flexDirection: "column",
            gap: 3,
            bgColor: "#FFFBEF",
            height: "88vh",
          }}
        >
          {/* <Heading
          sx={{
            fontWeight: "semibold",
            fontSize: "32px",
            textAlign: "center",
            fontFamily: "poppins",
            my: 5,
          }}
        >
          Projects
        </Heading> */}

          {/* New project */}

          <CreateProject />

          {/* Projects */}

          <Flex
            sx={{
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Project list */}

            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (item, index) => (
                <Box onClick={() => navigate(`/project/${item}`)} key={index}>
                  <Project name={item} />
                </Box>
              )
            )}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
