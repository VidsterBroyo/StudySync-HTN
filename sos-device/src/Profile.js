import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    Flex,
    Box,
    Heading,
    Wrap,
    WrapItem,
    Image,
    Text,
    SimpleGrid,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    useDisclosure
} from "@chakra-ui/react";

function openGroup(groupName) {
    localStorage.setItem("groupName", groupName);
    window.location.href = "/group";
}

function Profile() {
    const { user } = useAuth0();
    const [userGroups, setUserGroups] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupImage, setNewGroupImage] = useState('');

    async function fetchUserGroups() {
        console.log("fetching usermetadata");
        try {
            const response = await fetch("http://localhost:3001/get-user-metadata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?.sub,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setUserGroups(data.user_metadata);
                console.log("response from fetch:", data.user_metadata);
            } else {
                throw new Error("Failed to fetch user metadata");
            }
        } catch (error) {
            console.error("Error fetching user metadata:", error);
        }
    }

    useEffect(() => {
        fetchUserGroups();
    }, []);



    async function handleAddGroup() {
        try {
            const newGroup = [newGroupName, newGroupImage];
            setUserGroups(prevGroups => prevGroups.concat([newGroup]));


            const response = await fetch("http://localhost:3001/add-group", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.sub,
                    userGroups: userGroups,
                    newGroup: [newGroupName, newGroupImage]
                }),
            });
            if (response.ok) {
                console.log("Profile updated successfully!");
            } else {
                throw new Error("Failed to update profile");
            }

            
            onClose();
            setNewGroupName('');
            setNewGroupImage('');
        } catch (error) {
            console.error("Error adding new group:", error);
        }
    };



    return (
        <Flex minH="100vh" direction="column" bg="purple.200" p={5}>
            {/* Back Button */}
            <Box
                position="absolute"
                top={4}
                left={4}
                p={2}
                bg="gray.700"
                color="white"
                borderRadius="full"
                cursor="pointer"
                onClick={() => window.location.href = "/"}
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
                width="40px"
                height="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{
                    bg: 'gray.600',
                    transform: 'scale(1.1)'
                }}
            >
                &lt;
            </Box>

            {/* Heading */}
            <Heading color="white" size="xl" mb={8} textAlign="center">
                Your Classes
            </Heading>

            {/* Class Container */}
            <VStack
                bg="white"
                p={5}
                borderRadius="lg"
                boxShadow="lg"
                width="100%"
                maxW="1200px"
                mx="auto"
                overflowY="auto"
                spacing={5}
                height="400px"
                border="2px dashed gray"
            >
                <Text fontSize="xl" fontWeight="bold" color="purple.600">
                    Which class shall you be summarizing today?
                </Text>

                    <Wrap spacing={"10px"} mt={4}>

                        {userGroups.map((group, index) => (
                            <WrapItem key={index}>
                                <Box
                                    bg="purple.100"
                                    onClick={() => openGroup(group[0])}
                                    cursor="pointer"
                                    transition="all 0.3s ease-in-out"
                                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                                    borderRadius="lg"
                                    _hover={{
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                                    }}
                                >
                                    <Flex direction="column" align="center">
                                        <Image
                                            src={group[1]}
                                            boxSize="250px"
                                            objectFit="cover"
                                        />
                                        <Box p={3}>
                                            <Text
                                                align="center"
                                                fontFamily="Montserrat, sans-serif"
                                                fontWeight="bold"
                                                color="purple.800"
                                            >
                                                {group[0]}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Box>
                            </WrapItem>
                        ))}

                        <WrapItem>
                            <Box
                                bg="purple.100"
                                onClick={onOpen}
                                cursor="pointer"
                                transition="all 0.3s ease-in-out"
                                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                                borderRadius="lg"
                                _hover={{
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                                }}
                            >
                                <Flex direction="column" align="center">
                                    <Image
                                        src={"https://cdn-icons-png.flaticon.com/512/2661/2661440.png"}
                                        boxSize="250px"
                                        objectFit="cover"
                                    />
                                    <Box p={3}>
                                        <Text
                                            align="center"
                                            fontFamily="Montserrat, sans-serif"
                                            fontWeight="bold"
                                            color="purple.800"
                                        >
                                            Add a new study group
                                        </Text>
                                    </Box>
                                </Flex>
                            </Box>
                        </WrapItem>
                    </Wrap>
            </VStack>

            {/* Modal for Adding a New Group */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add a New Study Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Group Name</FormLabel>
                            <Input
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                placeholder="Enter group name"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Group Image URL</FormLabel>
                            <Input
                                value={newGroupImage}
                                onChange={(e) => setNewGroupImage(e.target.value)}
                                placeholder="Enter image URL"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddGroup}>
                            Add Group
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Footer */}
            <Flex
                bg="purple.500"
                color="white"
                p={4}
                justifyContent="center"
                mt="auto"
            >
                <Text>© 2024 StudySync. All rights reserved.</Text>
            </Flex>
        </Flex>
    );
}

export default Profile;
