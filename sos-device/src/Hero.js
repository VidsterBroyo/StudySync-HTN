import React from 'react';
import {
  Flex,
  Box,
  Heading,
  Button,
  Stack,
  Spacer,
  Text
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
  // Simulate redirection to login for non-authenticated users
  const requireLogin = () => {
    if (!isAuthenticated) {
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
      >
        <Box>
          <Heading size="lg">MyApp</Heading>
        </Box>
        <Spacer />
        <Stack direction="row" spacing={4}>
          <Button
            bg="whiteAlpha.900"
            color="purple.500"
            _hover={{ bg: "whiteAlpha.800" }}
            onClick={requireLogin} // Click Upload -> goes to login page
          >
            Upload
          </Button>
          <Button
            bg="whiteAlpha.900"
            color="purple.500"
            _hover={{ bg: "whiteAlpha.800" }}
            onClick={requireLogin} // Click Quiz -> goes to login page
          >
            Quiz
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
      {/* Main Content */}
      <Flex minH="100vh" align="center" justify="center" bg="purple.50">
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
            onClick={requireLogin} // Redirect to login if not authenticated
          >
            <Text align="center" color="gray.600" fontSize="lg">
              Drag & drop your file here or click to select
            </Text>
          </Box>
        </Stack>
      </Flex>
      {/* Footer */}
      <Flex bg="gray.800" color="white" p={4} justify="center">
        <Text>© 2024 MyApp. All rights reserved.</Text>
      </Flex>
    </>
  );
}
export default Hero;
