import React from 'react';
import Hero from "./Hero.js";
import Profile from "./Profile.js";
import Group from "./Group.js";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Flex,
  Text,
  Spinner
} from "@chakra-ui/react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";




export default function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        direction="column"
        bg="purple.200"
        p={5}
      >
        <Spinner
          size="xl"
          color="purple.600"
        />
        <Text mt={4} fontSize="lg" color="purple.600">
          Loading...
        </Text>
      </Flex>
    );
  }

  if (isAuthenticated) {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/group" element={<Group />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <div className="App">
      <Hero />
    </div>
  );
}
