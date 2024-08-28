import { Box } from "@chakra-ui/react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { Layout } from "./components";

import { Bin, LabelsPage, ProjectDetails, Projects } from "./pages";

import { auth } from "./firebase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
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
          <Route path="/" element={<Projects />} />
          <Route path="/labels" element={<LabelsPage />} />
          <Route path="/bin" element={<Bin />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Routes>
      </Box>
    </Layout>
  );
}

export default App;
