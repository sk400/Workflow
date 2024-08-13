import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  ListItem,
  ListIcon,
  Icon,
  List,
  Text,
  Image,
} from "@chakra-ui/react";

import CreateProject from "../features/projects/CreateProject";
import Project from "../features/projects/Project";
import { MdHome, MdLabel, MdDelete } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import addProject from "../assets/add-project.png";
import { useGlobalState } from "../context";
import { useLocation, useNavigate } from "react-router-dom";
import { GoProjectRoadmap } from "react-icons/go";
import logo from "../assets/workflow-logo.png";

const sidebarItemsData = [
  {
    title: "Home",
    icon: MdHome,
    path: "/",
  },
  {
    title: "Projects",
    icon: FaTasks,
    path: "/projects",
  },
  {
    title: "Labels",
    icon: MdLabel,
    path: "/labels",
  },
  {
    title: "Bin",
    icon: MdDelete,
    path: "/bin",
  },
];

const Sidebar = ({ isOpen, btnRef, onClose }) => {
  const { projects } = useGlobalState();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  console.log(projects);

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
        <DrawerContent
          sx={{
            bgColor: "#17181F",
          }}
        >
          <DrawerHeader></DrawerHeader>

          <DrawerBody
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <List spacing={2}>
              {sidebarItemsData.map((item) => (
                <ListItem
                  sx={{
                    cursor: "pointer",
                    bgColor: pathname === item.path ? "#272A30" : "#17181F",
                    color: pathname === item.path ? "gray.50" : "#828388",
                    borderRadius: "lg",
                    p: 2,
                    fontSize: "18px",
                    fontWeight: 400,
                    _hover: {
                      bg: pathname === item.path ? "#272A30" : "#17181F",
                    },
                  }}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                >
                  <ListIcon
                    sx={{
                      width: "30px",
                      height: "30px",
                      mb: "-2px",
                    }}
                  >
                    <Icon
                      as={item.icon}
                      sx={{
                        color: pathname === item.path ? "gray.50" : "#828388",
                      }}
                    />
                  </ListIcon>

                  {item.title}
                </ListItem>
              ))}
            </List>

            <Flex direction="column" width="100%" gap={3}>
              {/* Create project */}
              <Flex
                sx={{
                  color: "#828388",
                  letterSpacing: "1px",
                  px: 1,
                }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Text>PROJECTS</Text>
                <Image
                  src={addProject}
                  objectFit={"cover"}
                  sx={{
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                  }}
                />
              </Flex>
              {/* Project list */}
              <Flex
                sx={{
                  width: "100%",
                  bgColor: "#20212C",
                  p: 1.5,
                  borderRadius: "18px",
                }}
              >
                <List
                  sx={{
                    width: "100%",
                  }}
                >
                  {projects?.map((item) => (
                    <ListItem
                      sx={{
                        cursor: "pointer",
                        bgColor: "#20212C",
                        color:
                          pathname.includes(item?.id) === true
                            ? "gray.50"
                            : "#828388",
                        borderRadius: "lg",
                        p: 2,
                        width: "100%",
                        fontSize: "18px",
                        fontWeight: 400,
                      }}
                      onClick={() => {
                        navigate(`/projects/${item?.id}`);
                        onClose();
                      }}
                    >
                      <ListIcon
                        sx={{
                          width: "25px",
                          height: "25px",
                        }}
                      >
                        <Icon
                          as={GoProjectRoadmap}
                          sx={{
                            color:
                              pathname.includes(item?.id) === true
                                ? "gray.50"
                                : "#828388",
                          }}
                        />
                      </ListIcon>

                      {item.name}
                    </ListItem>
                  ))}
                </List>
              </Flex>
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
          gap: 5,
          bgColor: "#17181F",
          height: "100vh",
          borderRight: "solid 4px",
          borderRightColor: "#212329",
        }}
      >
        <Image
          src={logo}
          alt="Workflow Logo"
          objectFit={"cover"}
          sx={{
            width: { base: "70px", sm: "90", md: "100px" },
            height: { base: "70px", sm: "90", md: "100px" },
            mt: "-20px",
            ml: "-20px",
          }}
        />
        <List spacing={2}>
          {sidebarItemsData.map((item) => (
            <ListItem
              sx={{
                cursor: "pointer",
                bgColor: pathname === item.path ? "#272A30" : "#17181F",
                color: pathname === item.path ? "gray.50" : "#828388",
                borderRadius: "lg",
                p: 2,
                fontSize: "18px",
                fontWeight: 400,
                _hover: {
                  bg: pathname === item.path ? "#272A30" : "#17181F",
                },
              }}
              onClick={() => {
                navigate(item.path);
              }}
            >
              <ListIcon
                sx={{
                  width: "30px",
                  height: "30px",
                  mb: "-2px",
                }}
              >
                <Icon
                  as={item.icon}
                  sx={{
                    color: pathname === item.path ? "gray.50" : "#828388",
                  }}
                />
              </ListIcon>

              {item.title}
            </ListItem>
          ))}
        </List>

        <Flex direction="column" width="100%" gap={3}>
          {/* Create project */}
          <Flex
            sx={{
              color: "#828388",
              letterSpacing: "1px",
              px: 1,
            }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text>PROJECTS</Text>
            <Image
              src={addProject}
              objectFit={"cover"}
              sx={{
                width: "24px",
                height: "24px",
                cursor: "pointer",
              }}
            />
          </Flex>
          {/* Project list */}
          <Flex
            sx={{
              width: "100%",
              bgColor: "#20212C",
              p: 1.5,
              borderRadius: "18px",
            }}
          >
            <List
              sx={{
                width: "100%",
              }}
            >
              {projects.map((item) => (
                <ListItem
                  sx={{
                    cursor: "pointer",
                    bgColor: "#20212C",
                    color:
                      pathname.includes(item?.id) === true
                        ? "gray.50"
                        : "#828388",
                    borderRadius: "lg",
                    p: 2,
                    width: "100%",
                    fontSize: "18px",
                    fontWeight: 400,
                  }}
                  onClick={() => {
                    navigate(`/projects/${item?.id}`);
                  }}
                >
                  <ListIcon
                    sx={{
                      width: "25px",
                      height: "25px",
                    }}
                  >
                    <Icon
                      as={GoProjectRoadmap}
                      sx={{
                        color:
                          pathname.includes(item?.id) === true
                            ? "gray.50"
                            : "#828388",
                      }}
                    />
                  </ListIcon>

                  {item.name}
                </ListItem>
              ))}
            </List>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Sidebar;
