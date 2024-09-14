import React from 'react';
import { Link } from "react-router-dom";
import {
    Flex,
    Box,
    Heading,
    Button,
    Stack,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

/* https://www.huewheel.com/playful-dreamy-fresh */

function Hero() {
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

    const handleLogin = () => {
        console.log(isAuthenticated);
        loginWithRedirect();
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="background">
            <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
                <Stack align="center" color="white">
                    <Heading fontSize="4xl">Sign in or sign up</Heading>
                </Stack>
                <Box rounded="lg" bg={"secondBackground"} boxShadow="lg" p={8}>
                    <Stack spacing={4}>
                        {isAuthenticated ? (
                            <Button
                                bg="purple.400"
                                color="white"
                                onClick={handleLogout}
                                _hover={{
                                    bg: "purple.500",
                                }}
                            >
                                Log out
                            </Button>
                        ) : (
                            <>
                                <Button
                                    bg="purple.400"
                                    color="white"
                                    onClick={handleLogin}
                                    _hover={{
                                        bg: "purple.500",
                                    }}
                                >
                                    Sign in
                                </Button>
                                <Button
                                    bg="purple.400"
                                    color="white"
                                    onClick={handleLogin}
                                    _hover={{
                                        bg: "purple.500",
                                    }}
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Stack>
                </Box>
            </Stack >
        </Flex >
    );
}

export default Hero;
