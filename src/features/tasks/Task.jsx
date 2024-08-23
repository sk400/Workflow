import {
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tag,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { IoMdMore } from "react-icons/io";

const Task = () => {
  return (
    <Box
      sx={{
        bgColor: "#20212C",
        color: "#D3D3D6",
        mt: 5,
        p: 3,
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        gap: 4,
      }}
    >
      <Flex>
        <Tag
          sx={{
            borderRadius: "2xl",
            bgColor: "#7259C6",
            color: "gray.50",
          }}
        >
          Testing
        </Tag>
        <Spacer />
        <Text
          sx={{
            fontWeight: "medium",
          }}
        >
          Sep 8
        </Text>
      </Flex>
      <Heading size="sm">Buy birthday dress</Heading>
      <Image
        src="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        alt="image"
        objectFit="cover"
        borderRadius="14px"
      />
      <Text fontSize="xs">
        Buy your upcomming birthday dress with your earned money
      </Text>
      <Menu>
        <MenuButton
          sx={{
            bgColor: "#20212C",
            color: "#D3D3D6",
            position: "absolute",
            bottom: 2,
            right: 2,
            _hover: {
              bgColor: "#272A30",
            },
            borderRadius: "lg",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Icon as={IoMdMore} />
        </MenuButton>
        <MenuList
          sx={{
            bgColor: "#272A30",
            border: "none",
          }}
        >
          <MenuItem
            sx={{
              color: "gray.50",
              bgColor: "#272A30",
              _hover: {
                bgColor: "#7259C6",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            sx={{
              color: "gray.50",
              bgColor: "#272A30",
              _hover: {
                bgColor: "#7259C6",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Add to bin
          </MenuItem>
          <MenuItem
            sx={{
              color: "gray.50",
              bgColor: "#272A30",
              _hover: {
                bgColor: "#7259C6",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Mark as completed
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Task;
