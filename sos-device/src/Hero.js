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
    <Flex
      direction="column"
      minH="100vh"
      bg="#f2f2f2"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      {/* Navbar */}
      <Flex
      
        mx="10px"
        mt="10px"
        mb="10px"
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

      {/* Main Content */}
      <Flex direction="column" flex="1" bg="#f2f2f2">
        <Box
          p={6}
          mx="35px"
          mt="35px"
          mb="35px"
          bg="#f3ebf4" // Opaque background
          borderRadius="lg"
          boxShadow="none" // Removed dark shadow here
          borderStyle="none" // Removed the border
        >
          <Flex minH="calc(100vh - 180px)" align="center" justify="center">
            <Stack spacing={8} mx="auto" maxW="2xl" py={12} px={6}>
              <Stack align="center">
                <Heading fontSize="4xl" align="center" width="80%" color="black" mb="80px">A collaborative studying platform powered by an AI lecture summarizer</Heading>
                <Text fontSize="lg" width="100%" color="gray.600" align={'center'}>
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
      </Flex>

      {/* Footer */}
      <Flex
        bg="black"
        color="white"
        p={4}
        justifyContent="center"
        height="60px" // Set the height of the footer
        align="center"
      >
        <Text>© 2024 StudySync. All rights reserved.</Text>
      </Flex>
    </Flex>
  );
}

export default Hero;
