import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Text,
    Button,
    Stack,
    useToast,
    Wrap,
    WrapItem
} from "@chakra-ui/react";

function Profile() {
    const [groupName, setGroupName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [transcribedText, setTranscribedText] = useState(""); // State for transcribed text
    const [notes, setNotes] = useState([]); // State for notes
    const toast = useToast();

    // get group name on first render
    function getGroupName() {
        const storedGroupName = localStorage.getItem("groupName");
        setGroupName(storedGroupName);
        console.log(storedGroupName);
    }

    useEffect(() => {
        getGroupName();
    }, []);

    // Load notes from the server
    async function loadNotes() {
        if (!groupName) return;

        try {
            console.log(`http://localhost:3001/lectures/${encodeURIComponent(groupName)}`)
            const response = await axios.get(`http://localhost:3001/lectures/${encodeURIComponent(groupName)}`);
            setNotes(response.data); // Assuming response.data is an array of notes
            console.log('Notes loaded:', notes);

        } catch (error) {
            console.error('Error loading notes:', error);
            toast({
                title: 'Failed to load notes',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }

    useEffect(() => {
        loadNotes();
    }, [groupName]);

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onVideoChange = (event) => {
        setSelectedVideo(event.target.files[0]);
    };

    const onVideoUpload = async () => {
        if (!selectedVideo) {
            toast({
                title: 'No video selected',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        const formData = new FormData();
        formData.append('video', selectedVideo);
        try {
            const response = await fetch(
                "https://symphoniclabs--symphonet-vsr-modal-model-upload-static.modal.run",
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (response.ok) {
                const data = await response.text();
                console.log("Transcription result:", data);
                setTranscribedText(data);
                toast({
                    title: 'Video uploaded and transcribed successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setSelectedVideo(null);
            } else {
                throw new Error("Failed to transcribe the video");
            }
        } catch (error) {
            toast({
                title: 'Video transcription failed',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.error("Error transcribing video:", error);
        }
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
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response Data:', response.data)
            toast({
                title: 'File uploaded successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setSelectedFile(null);
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

    return (
        <Flex minH="100vh" direction="column" bg="background">
            <Box mb={7} mt={5} ml={5} mr={5}>
                <Heading color="white" size="xl" align="center" mb={5}>
                    {groupName}
                </Heading>
                {/* Load and display notes */}
                <Box p={4} width="50%">
                    <Heading size="lg" mb={4}>Notes</Heading>
                    {notes.length > 0 ? (
                        <Wrap spacing={"20px"} mt={4}>
                            {notes.map((note, index) => (
                                <WrapItem key={index} p={3} borderRadius="md">
                                    <Box
                                        height="100px"
                                        bg="secondBackground"
                                        onClick={() => console.log(note.notes)}
                                        cursor="pointer"
                                        transition="all 0.3s ease-in-out"
                                        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                                        borderRadius="lg"
                                    >
                                        <Flex direction="column" align="center" height="100%">
                                            <Box
                                                flex="1"
                                                display="flex"
                                                flexDirection="column"
                                                justifyContent="center"
                                                p={2}
                                            >
                                                <Text
                                                    align="center"
                                                    fontFamily="Montserrat,sans-serif"
                                                    fontWeight="bold"
                                                    style={{ overflowWrap: "break-word", width: "100%" }}
                                                >
                                                    {note.title}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </Box>
                                </WrapItem>
                            ))}
                        </Wrap>


                    ) : (
                        <Text>No notes available for this group.</Text>
                    )}
                </Box>
                {/* Notes Upload */}
                <Box p={4} width="50%">
                    <FormControl>
                        <FormLabel>Upload your notes!</FormLabel>
                        <Input
                            type="file"
                            id="file-upload"
                            onChange={onFileChange}
                            accept="audio/mp3"
                        />
                    </FormControl>
                    <Stack spacing={4} mt={4}>
                        <Button colorScheme="teal" onClick={onFileUpload}>
                            Upload
                        </Button>
                    </Stack>
                </Box>
                {/* Video Upload */}
                <Box p={4} width="50%">
                    <FormControl>
                        <FormLabel>Upload a voiceless video!</FormLabel>
                        <Input
                            type="file"
                            id="video-upload"
                            onChange={onVideoChange}
                            accept="video/mp4"
                        />
                    </FormControl>
                    <Stack spacing={4} mt={4}>
                        <Button colorScheme="teal" onClick={onVideoUpload}>
                            Upload and Transcribe
                        </Button>
                    </Stack>
                </Box>
                {/* Transcription Result Display */}
                {transcribedText && (
                    <Box p={4} width="50%" mt={5}>
                        <Heading size="md">Transcription Result</Heading>
                        <Text mt={2} p={2} bg="gray.100" borderRadius="md">
                            {transcribedText}
                        </Text>
                    </Box>
                )}
            </Box>
        </Flex>
    );
}

export default Profile;
