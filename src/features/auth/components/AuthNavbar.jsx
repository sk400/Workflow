import { Button, Flex, HStack, Image } from "@chakra-ui/react";
import logo from "../../../assets/workflow-logo.png";
import { useLocation, useNavigate } from "react-router-dom";

const AuthNavbar = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  // 3772FF
  return (
    <Flex
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        p: 3,
      }}
    >
      <Image
        src={logo}
        alt="Workflow Logo"
        objectFit={"cover"}
        sx={{
          width: { base: "70px", sm: "90", md: "100px" },
          height: { base: "70px", sm: "90", md: "100px" },
        }}
      />
      <HStack spacing={5} alignItems={"center"}>
        <Button
          size={["xs", "sm", "md"]}
          sx={{
            bgColor: pathname === "/sign-up" ? "#3772FF" : "#17181E",
            color: "gray.50",
            borderRadius: "8px",
            _hover: {
              bgColor: "#3772FF",
              opacity: 0.8,
            },
          }}
          onClick={() => navigate("/sign-up")}
        >
          Sign up
        </Button>
        <Button
          size={["xs", "sm", "md"]}
          sx={{
            bgColor: pathname === "/sign-in" ? "#3772FF" : "#17181E",
            color: "gray.50",
            borderRadius: "8px",
            _hover: {
              bgColor: "#3772FF",
              opacity: 0.8,
            },
          }}
          onClick={() => navigate("/sign-in")}
        >
          Log in
        </Button>
      </HStack>
    </Flex>
  );
};

export default AuthNavbar;
