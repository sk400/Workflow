import "@fontsource-variable/josefin-sans";
import "@fontsource-variable/open-sans";
import "@fontsource/poppins/600.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "./lib/theme";
import { Provider } from "./context";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <Provider>
        <Router>
          <Routes>
            <Route path="/*" element={<App />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/sign-in" element={<Signin />} />
          </Routes>
        </Router>
      </Provider>
    </ChakraProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
