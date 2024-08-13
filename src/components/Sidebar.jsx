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

import CreateProject from "../features/projects/CreateProject";
import Project from "../features/projects/Project";

import { useGlobalState } from "../context";

const Sidebar = ({ isOpen, btnRef, onClose }) => {
  const { projects } = useGlobalState();

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

              {projects?.map((item) => (
                <Box key={item?.id}>
                  <Project item={item} />
                </Box>
              ))}
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

            {projects?.map((item) => (
              <Box key={item?.id}>
                <Project item={item} />
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
