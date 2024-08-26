import { Box, Spinner } from "@chakra-ui/react";

const Loading = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
      width: "100%",
    }}
  >
    <Spinner size="xl" color="#7259C6" />
  </Box>
);
export default Loading;
