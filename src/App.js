import { Box } from "@chakra-ui/react";
import "./App.css";
import { Layout } from "./components";

function App() {
  return (
    <Layout>
      <Box
        sx={{
          height: { base: "90vh", md: "88vh" },
        }}
      >
        <h1>hello</h1>
      </Box>
    </Layout>
  );
}

export default App;
