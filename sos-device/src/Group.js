import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Link,
    Stack,
    useToast
} from "@chakra-ui/react";

function Profile() {
    const [groupName, setGroupName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const toast = useToast();
    const fileInputRef = useRef(null);

    function getGroupName() {
        setGroupName(localStorage.getItem("groupName"))
        console.log(groupName);
    }

    useEffect(() => {
        getGroupName();
    }, []);

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFileUploaded(true);
    };

    const onFileUpload = async () => {
        if (!selectedFile) {
            toast({
                title: 'No file selected',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast({
                title: 'File uploaded successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setSelectedFile(null);
            setIsFileUploaded(false);
        } catch (error) {
            toast({
                title: 'Upload failed',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files.length > 0) {
            setSelectedFile(event.dataTransfer.files[0]);
            setIsFileUploaded(true);
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    

    return (
        <Flex direction="column" minH="100vh" bg="background">
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
                    onClick={() => window.location.href = "/profile"}
                    fontSize="2xl"
                    fontWeight="bold"
                    textAlign="center"
                    width="40px"
                    height="40px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    _hover={{
                        bg: 'gray.600', // Darker background on hover
                        transform: 'scale(1.1)' // Slightly larger on hover
                    }}
                >
                    &lt;
                </Box>
            
            {/* Header */}
            <Box bg="teal.400" p={9} color="black">
                <Heading size="2xl" textAlign="center">
                    Mr. Stefanik: Grade 12 History
                </Heading>
            </Box>

            <Flex direction="column" flex="1" bg="background" p={5}>

                <Box mb={7}>
                    <Heading
                        color="white"
                        size="xl"
                        align="center"
                        mb={5}
                    >
                        {groupName}
                    </Heading>

                    <Box p={4} width="50%" mx="auto">
                        <FormControl>
                            <FormLabel>Upload lecture recording!</FormLabel>
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                p={4}
                                height="200px"
                                border="2px dashed"
                                borderColor="gray.300"
                                borderRadius="md"
                                bg="whiteAlpha.800"
                                _hover={{ borderColor: 'gray.500' }}
                                _focus={{ borderColor: 'blue.500' }}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                cursor="pointer"
                                onClick={handleClick}
                            >
                                <Input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={onFileChange}
                                    display="none"
                                    accept="audio/mp3"
                                />
                                <Box
                                    as="span"
                                    fontSize="md"
                                    color="gray.600"
                                >
                                    Drag & drop your file here, or click to select
                                </Box>
                            </Flex>
                        </FormControl>
                        <Flex direction="column" align="center" mt={4}>
                            <Button
                                colorScheme="teal"
                                size="lg"
                                fontSize="lg"
                                px={8}
                                py={6}
                                boxShadow="md"
                                _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }}
                                onClick={onFileUpload}
                                mb={4}
                            >
                                Upload
                            </Button>
                            <Box
                                bg="gray.200"
                                p={4}
                                borderRadius="md"
                                width="100%"
                                maxWidth="400px"
                                mx="auto"
                                textAlign="center"
                                boxShadow="md"
                            >
                                <Box mb={4} fontSize="md" color="gray.700">
                                    Want to test your knowledge?
                                </Box>
                                <Button
                                    colorScheme={isFileUploaded ? "blue" : "gray"}
                                    size="lg"
                                    fontSize="lg"
                                    px={8}
                                    py={6}
                                    boxShadow="md"
                                    _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }}
                                    isDisabled={!isFileUploaded}
                                >
                                    QUIZ ME!
                                </Button>
                            </Box>
                        </Flex>
                    </Box>
                </Box>
            </Flex>

            {/* Footer */}
            <Box bg="gray.800" p={4} color="white" textAlign="center" height="40px">
                Footer
            </Box>
        </Flex>
    );
}

export default Profile;
