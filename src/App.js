import { Box } from "@chakra-ui/react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { Layout } from "./components";

import { Home, ProjectDetails } from "./pages";

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

        localStorage.setItem(
          "user",
          JSON.stringify({
            name: user?.displayName,
            email: user?.email,
            photo: user?.photoURL,
            uid: user?.uid,
          })
        );
        navigate("/");

        const projectQuery = query(
          user && collection(db, "users", user?.email, "projects"),
          orderBy("createdAt", "desc")
        );

        const getProjects = () => {
          onSnapshot(projectQuery, (querySnapshot) => {
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
        localStorage.removeItem("user");
        navigate("/sign-up");
      }
    });
  }, []);

  return (
    <Layout>
      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
        </Routes>
      </Box>
    </Layout>
  );
}

export default App;
