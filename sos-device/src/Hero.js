import React from 'react';
import {
  Flex,
  Box,
  Heading,
  Button,
  Stack,
  Spacer,
  Text,
  Image,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

// Hero page
function Hero() {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout();
  };

  // Function to handle the upload and quiz buttons
  const handleRedirect = () => {
    if (isAuthenticated) {
      // Redirect to the profile page
      window.location.href = "/profile";
    } else {
      // Redirect to the login page if not authenticated
      loginWithRedirect();
    }
  };

  return (
    <>
      {/* Navbar */}
      <Flex
        as="nav"
        bg="purple.400"
        p={4}
        color="white"
        align="center"
        justify="space-between"
        height="120px" // Increased the height of the navbar to accommodate the logo
      >
        <Flex align="center">
          {/* StudySync Title */}
          <Heading size="lg" mr={4}>StudySync</Heading>

          {/* Logo Image */}
          <Image
            src="/img/logo.png" // Path to your logo image
            alt="Logo"
            boxSize="140px" // Set image size to 140px
          />
        </Flex>

        <Spacer />

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={4}>
          {/* Home button */}
          <Button
            bg="whiteAlpha.900"
            color="purple.500"
            _hover={{ bg: "whiteAlpha.800" }}
            onClick={() => window.location.href = "/"} // Redirect to Home
          >
            Home
          </Button>

          {/* Classes button */}
          <Button
            bg="whiteAlpha.900"
            color="purple.500"
            _hover={{ bg: "whiteAlpha.800" }}
            onClick={() => handleRedirect()} // Redirect to profile (classes)
          >
            Classes
          </Button>

          {/* Changed Quiz to Quiz Generator */}
          <Button
            bg="whiteAlpha.900"
            color="purple.500"
            _hover={{ bg: "whiteAlpha.800" }}
            onClick={() => handleRedirect()} // Redirect to quiz generator
          >
            Quiz Generator
          </Button>

          {!isAuthenticated && (
            <>
              <Button
                bg="whiteAlpha.900"
                color="purple.500"
                onClick={handleLogin} // For Sign In
                _hover={{ bg: "whiteAlpha.800" }}
              >
                Sign In
              </Button>
              <Button
                bg="whiteAlpha.900"
                color="purple.500"
                onClick={handleLogin} // For Sign Up
                _hover={{ bg: "whiteAlpha.800" }}
              >
                Sign Up
              </Button>
            </>
          )}
          {isAuthenticated && (
            <Button
              bg="purple.500"
              color="white"
              onClick={handleLogout} // For Log out
              _hover={{ bg: "purple.600" }}
            >
              Log out
            </Button>
          )}
        </Stack>
      </Flex>

      {/* Main Content with the opaque box */}
      <Box
        p={6}
        mx="15px"
        mt="15px"
        mb="15px"
        bg="whiteAlpha.900" // Opaque background
        borderRadius="lg"
        boxShadow="none" // Removed dark shadow here
        borderStyle="none" // Removed the border
      >
        <Flex minH="calc(100vh - 180px)" align="center" justify="center" bg="purple.50">
          <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
            <Stack align="center">
              <Heading fontSize="4xl">AI Lecture Summarizer</Heading>
              <Text fontSize="lg" color="gray.600">
                Drag & drop your video or audio file below to get started, or click to upload.
              </Text>
            </Stack>

            {/* Upload Box */}
            <Box
              p={8}
              width="100%"
              height="200px"
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="md"
              bg="white"
              cursor="pointer"
              onClick={handleRedirect} // Redirect to profile or login
            >
              <Text align="center" color="gray.600" fontSize="lg">
                Drag & drop your file here or click to select
              </Text>
            </Box>
          </Stack>
        </Flex>
      </Box>

      {/* Footer */}
      <Flex bg="gray.800" color="white" p={4} justify="center">
        <Text>© 2024 StudySync. All rights reserved.</Text>
      </Flex>
    </>
  );
}

export default Hero;
  