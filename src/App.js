import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { FirstProject, Layout, ProjectDetails } from "./components";
import CreateTodo from "./components/CreateTodo";

import { auth } from "./firebase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      } else {
        navigate("/sign-up");
      }
    });
  }, []);

  return (
    <Layout>
      <Box>
        <Center>
          <Heading
            sx={{
              fontWeight: "semibold",
              fontSize: "32px",
              textAlign: "center",
              fontFamily: "open",
              my: 5,
            }}
          >
            Monday
          </Heading>
        </Center>
        <Flex
          direction="column"
          align="center"
          width="100%"
          gap={5}
          my={10}
          // mb={20}
        >
          {/* Create new item */}
          <CreateTodo />

          {/* Routes */}

          <Routes>
            <Route path="/" element={<FirstProject />} />
            <Route path="/project/:projectId" element={<ProjectDetails />} />
          </Routes>
        </Flex>
      </Box>
    </Layout>
  );
}

export default App;
