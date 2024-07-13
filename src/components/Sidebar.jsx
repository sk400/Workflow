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

const Sidebar = ({ isOpen, btnRef, onClose }) => {
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
                  <Project key={index} name={item} />
                )
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

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
              <Project key={index} name={item} />
            )
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default Sidebar;
