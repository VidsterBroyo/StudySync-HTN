import React from 'react';
import Hero from "./Hero.js";
import Profile from "./Profile.js";
import Group from "./Group.js";
import { useAuth0 } from "@auth0/auth0-react";
import { Text } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";




export default function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="App">
        <Text>Loading...</Text>
      </div>
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
