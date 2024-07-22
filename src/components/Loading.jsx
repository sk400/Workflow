import { Box, Spinner } from "@chakra-ui/react";

const Loading = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "90vh",
      width: "100%",
    }}
  >
    <Spinner size="xl" color="orange.400" />
  </Box>
);
export default Loading;
