import React, { useState } from 'react';
import {
	Box,
	Flex,
	Heading,
	Button,
	Input,
	Textarea,
	VStack,
	Dialog,
	CloseButton,
	Portal,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useToast } from '@chakra-ui/toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useNotes } from '../../context/NotesContext';
import axiosInstance from '../../axios/axios.instance';
import AiEnhanceButton from '../AiEnhanceButton/AiEnhanceButton';

const Header: React.FC = () => {
	const { state, dispatch } = useNotes();
	const [formData, setFormData] = useState<{
		title: string;
		content: string;
	}>({
		title: '',
		content: '',
	});
	const [enhancedContent, setEnhancedContent] = useState<string>('');
	const [showEnhanced, setShowEnhanced] = useState<boolean>(false);
	const navigate = useNavigate();
	const toast = useToast();

	const enhancedBoxBgColor = useColorModeValue('gray.100', 'gray.700');
	const enhancedBoxBorderColor = useColorModeValue('gray.200', 'gray.600');
	const enhancedTextColor = useColorModeValue('gray.800', 'gray.200');

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const isPositionEmpty = (x: number, y: number) => {
		return !state.notes.some(
			(note) => Math.abs(note.x - x) < 100 && Math.abs(note.y - y) < 100,
		);
	};

	const findEmptyPosition = () => {
		let x = Math.floor(Math.random() * 400);
		let y = Math.floor(Math.random() * 200);

		while (!isPositionEmpty(x, y)) {
			x = Math.floor(Math.random() * 400);
			y = Math.floor(Math.random() * 200);
		}

		return { x, y };
	};

	const handleSubmit = async () => {
		const { x, y } = findEmptyPosition();
		console.log(x, y);

		const newNote = {
			id: uuidv4(),
			title: formData.title,
			content: formData.content,
			x,
			y,
		};

		try {
			const { id, ...notesPayload } = newNote;
			const response = await axiosInstance.post(
				`${process.env.REACT_APP_BE_URL}/notes`,
				notesPayload,
			);

			if (response.status === 201) {
				toast({
					title: 'Note created.',
					description: "We've created your note.",
					status: 'success',
					duration: 2000,
					isClosable: true,
				});
				// TODO: Close the dialog
				resetForm();
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create the note. Please try again.',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const useEnhancedContent = () => {
		setFormData({
			...formData,
			content: enhancedContent,
		});
		setShowEnhanced(false);
	};

	const resetForm = () => {
		setFormData({
			title: '',
			content: '',
		});
		setEnhancedContent('');
		setShowEnhanced(false);
	};

	const handleLogout = () => {
		dispatch({ type: 'LOGOUT' });

		document.cookie.split(';').forEach((cookie) => {
			document.cookie = cookie
				.replace(/^ +/, '')
				.replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
		});

		navigate('/login');
	};

	return (
		<Box
			as='header'
			bg={useColorModeValue('teal.500', 'teal.700')}
			px={4}
			py={2}
		>
			<Flex justify='space-between' align='center'>
				<Heading size='md' color='white'>
					Notes App
				</Heading>
				<Flex>
					<Dialog.Root placement='top' motionPreset='slide-in-bottom'>
						<Dialog.Trigger asChild>
							<Button colorScheme='teal' variant='outline' color='white' mr={2}>
								Add Note
							</Button>
						</Dialog.Trigger>
						<Portal>
							<Dialog.Backdrop />
							<Dialog.Positioner>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title>Create a New Note</Dialog.Title>
									</Dialog.Header>
									<Dialog.Body>
										<VStack spacing={4} width='100%'>
											<FormControl width='100%'>
												<FormLabel>Title</FormLabel>
												<Input
													name='title'
													value={formData.title}
													onChange={handleInputChange}
													placeholder='Enter note title'
													focusBorderColor='teal.500'
													bg='white'
													color='black'
												/>
											</FormControl>

											<FormControl width='100%'>
												<FormLabel>Content</FormLabel>
												<Textarea
													name='content'
													value={formData.content}
													onChange={handleInputChange}
													placeholder='Enter note content'
													size='md'
													rows={5}
													focusBorderColor='teal.500'
													bg='white'
													color='black'
												/>
											</FormControl>
											{showEnhanced && (
												<Box
													mt={4}
													p={3}
													borderWidth={1}
													borderRadius='md'
													borderColor={enhancedBoxBorderColor}
													bg={enhancedBoxBgColor}
												>
													<Heading size='xs' mb={2} color={enhancedTextColor}>
														Enhanced Content
													</Heading>
													<Box color={enhancedTextColor}>{enhancedContent}</Box>
													<Button
														size='sm'
														colorScheme='teal'
														mt={2}
														onClick={useEnhancedContent}
													>
														Use This
													</Button>
												</Box>
											)}
										</VStack>
									</Dialog.Body>
									<Dialog.Footer>
										<Button colorScheme='teal' mr={3} onClick={handleSubmit}>
											Save Note
										</Button>
										<AiEnhanceButton
											content={formData.content}
											setEnhancedContent={setEnhancedContent}
											setShowEnhanced={setShowEnhanced}
										></AiEnhanceButton>
									</Dialog.Footer>
									<Dialog.CloseTrigger asChild>
										<CloseButton size='sm' />
									</Dialog.CloseTrigger>
								</Dialog.Content>
							</Dialog.Positioner>
						</Portal>
					</Dialog.Root>

					<Button
						colorScheme='teal'
						variant='outline'
						color='white'
						onClick={handleLogout}
					>
						Logout
					</Button>
				</Flex>
			</Flex>
		</Box>
	);
};

export default Header;
