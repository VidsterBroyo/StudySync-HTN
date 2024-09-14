import React, { useEffect, useState, useRef } from 'react';
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
    WrapItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure
} from "@chakra-ui/react";

function Group() {
    const [groupName, setGroupName] = useState("");
    const [lectureTitle, setLectureTitle] = useState(""); // State for lecture title
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [transcribedText, setTranscribedText] = useState(""); // State for transcribed text
    const [notes, setNotes] = useState([]); // State for notes
    const [selectedNote, setSelectedNote] = useState(null); // State for selected note
    const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls
    const toast = useToast();
    const fileInputRef = useRef(null);

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
            console.log(`http://localhost:3001/lectures/${encodeURIComponent(groupName)}`);
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
        setIsFileUploaded(true); // Mark file as uploaded
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
            setIsFileUploaded(true); // Mark file as uploaded
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
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
        if (!selectedFile || !lectureTitle) { // Check if title and file are provided
            toast({
                title: 'Missing title or file',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', lectureTitle); // Include lecture title in the form data

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response Data:', response.data);
            toast({
                title: 'File uploaded successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // After uploading the file, add the note
            console.log("Making the request to add the note...");
            await axios.post(`http://localhost:3001/lectures/${encodeURIComponent(groupName)}`, {
                title: lectureTitle,
                notes: response.data.transcript // Assuming the response data contains the content for the note
            });
            console.log("Note added successfully");

            // Refresh the notes
            loadNotes();

            // Reset the form
            setSelectedFile(null);
            setLectureTitle("");
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

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        onOpen(); // Open the modal
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
                    {groupName}
                </Heading>
            </Box>
            <Flex direction="column" flex="1" bg="background" p={5}>
                <Box mb={7}>
                    <Box p={4} width="50%">
                        <Heading size="lg" mb={4}>Notes</Heading>
                        {notes.length > 0 ? (
                            <Wrap spacing={"20px"} mt={4}>
                                {notes.map((note, index) => (
                                    <WrapItem key={index} p={3} borderRadius="md">
                                        <Box
                                            height="100px"
                                            bg="secondBackground"
                                            onClick={() => handleNoteClick(note)}
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

                    <Box p={4} width="50%" mx="auto">
                        <FormControl mb={4}>
                            <FormLabel>Lecture Title</FormLabel>
                            <Input
                                type="text"
                                value={lectureTitle}
                                onChange={(e) => setLectureTitle(e.target.value)}
                                placeholder="Enter lecture title"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Upload lecture recording!</FormLabel>
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                p={4}
                                height="200px"
                                border={`2px dashed ${isFileUploaded ? 'teal.500' : 'gray.300'}`}
                                borderRadius="md"
                                bg={isFileUploaded ? 'teal.100' : 'whiteAlpha.800'}
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
                                    {selectedFile ? selectedFile.name : 'Drag & drop your file here, or click to select'}
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

            <Modal isOpen={isOpen} onClose={onClose} size="lg"> {/* Use size prop for predefined sizes */}
                <ModalOverlay />
                <ModalContent maxWidth="80vw" width="80vw"> {/* Adjust width as needed */}
                    <ModalHeader>Note Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>{selectedNote?.notes}</Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default Group;
