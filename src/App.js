import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { FirstProject, Layout, ProjectDetails } from "./components";
import CreateTodo from "./components/CreateTodo";

import { auth, db } from "./firebase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useGlobalState } from "./context";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

function App() {
  const navigate = useNavigate();
  const { setUser, setProjects } = useGlobalState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user?.displayName,
          email: user?.email,
          photo: user?.photoURL,
          uid: user?.uid,
        });
        navigate("/");

        const getProjects = () => {
          const q = query(
            user && collection(db, "users", user?.email, "projects"),
            orderBy("createdAt", "desc")
          );
          onSnapshot(q, (querySnapshot) => {
            const documents = querySnapshot?.docs?.map((doc) => ({
              ...doc?.data(),
              id: doc?.id,
            }));

            if (documents?.length) {
              setProjects(documents);
            } else {
              setProjects([]);
            }
          });
        };

        getProjects();
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
