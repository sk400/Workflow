import React from "react";
import { Box, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";

const Project = ({ name }) => {
  return (
    <Box>
      <Flex
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          px: 3,
          py: 1,
          bgColor: "#F4D089",

          borderRadius: "8px",
          cursor: "pointer",
          backgroundOpacity: "40%",
          color: "#535151",
          fontWeight: "400",
          boxShadow: "lg",
        }}
      >
        <Text
          sx={{
            fontFamily: "josefin",
            fontWeight: "500",
            textAlign: "center",
            flexBasis: "95%",
            ml: 4,
          }}
        >
          {name}
        </Text>
        <IconButton
          sx={{
            bgColor: "#F4D089",
            flexBasis: "5%",
            "&:hover": {
              bgColor: "#F4D089",
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            console.log("clicked");
          }}
        >
          <Icon as={SlOptionsVertical} />
        </IconButton>
      </Flex>
    </Box>
  );
};

export default Project;
