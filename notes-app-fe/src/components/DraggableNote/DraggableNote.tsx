import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import {
	Box,
	Heading,
	Text,
	Flex,
	Button,
	Input,
	Textarea,
} from '@chakra-ui/react';
import { useNotes } from '../../context/NotesContext';
import axiosInstance from '../../axios/axios.instance';
import { useToast } from '@chakra-ui/toast';
import AiEnhanceButton from '../AiEnhanceButton/AiEnhanceButton';
import { useColorModeValue } from '../ui/color-mode';

const DraggableNote: React.FC<{ note: any }> = ({ note }) => {
	const { dispatch } = useNotes();
	const nodeRef = useRef(null);
	const toast = useToast();
	const [controlledPosition, setControlledPosition] = useState({
		x: note.x,
		y: note.y,
	});
	const [lastDragPosition, setLastDragPosition] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(note.title);
	const [editedContent, setEditedContent] = useState(note.content);
	const [isDeleted, setIsDeleted] = useState(false);
	const [enhancedContent, setEnhancedContent] = useState<string>('');
	const [showEnhanced, setShowEnhanced] = useState<boolean>(false);

	const enhancedBoxBgColor = useColorModeValue('gray.100', 'gray.700');
	const enhancedBoxBorderColor = useColorModeValue('gray.200', 'gray.600');
	const enhancedTextColor = useColorModeValue('gray.800', 'gray.200');

	useEffect(() => {
		if (!lastDragPosition) {
			setControlledPosition({ x: note.x, y: note.y });
		}
	}, [note.x, note.y]);

	useEffect(() => {
		setEditedTitle(note.title);
		setEditedContent(note.content);
	}, [note.title, note.content]);

	const onStart = () => {
		if (!isEditing) {
			setLastDragPosition(controlledPosition);
		}
	};

	const onDrag = (e, data) => {
		if (!isEditing) {
			setControlledPosition({ x: data.x, y: data.y });
		}
	};

	const onStop = async (e, data) => {
		if (isEditing) return;

		setLastDragPosition(null);
		setControlledPosition({ x: data.x, y: data.y });

		try {
			const response = await axiosInstance.put(
				`${process.env.REACT_APP_BE_URL}/notes/${note.id}`,
				{
					...note,
					x: data.x,
					y: data.y,
				},
			);

			if (response.status === 200) {
				dispatch({
					type: 'UPDATE_NOTE_POSITION',
					payload: { id: note.id, x: data.x, y: data.y },
				});

				toast({
					title: 'Note updated.',
					description: "The note's position has been updated.",
					status: 'success',
					duration: 2000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error('Failed to update note position:', error);
			toast({
				title: 'Error',
				description: 'Failed to update the note position. Please try again.',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditedTitle(note.title);
		setEditedContent(note.content);
	};

	const useEnhancedContent = () => {
		setEditedContent(enhancedContent);
		setShowEnhanced(false);
	};

	const handleSaveEdit = async () => {
		try {
			const response = await axiosInstance.put(
				`${process.env.REACT_APP_BE_URL}/notes/${note.id}`,
				{
					...note,
					title: editedTitle,
					content: editedContent,
				},
			);

			if (response.status === 200) {
				dispatch({
					type: 'UPDATE_NOTE_POSITION',
					payload: { ...note, title: editedTitle, content: editedContent },
				});

				setIsEditing(false);
				toast({
					title: 'Note updated.',
					description: 'The note has been updated successfully.',
					status: 'success',
					duration: 2000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error('Failed to update note:', error);
			toast({
				title: 'Error',
				description: 'Failed to update the note. Please try again.',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const handleDelete = async () => {
		try {
			setIsDeleted(true); // Mark as deleted before API call to prevent UI jumps

			const response = await axiosInstance.delete(
				`${process.env.REACT_APP_BE_URL}/notes/${note.id}`,
			);

			if (response.status === 200) {
				dispatch({
					type: 'DELETE_NOTE',
					payload: note.id,
				});

				toast({
					title: 'Note deleted.',
					description: 'The note has been deleted successfully.',
					status: 'success',
					duration: 2000,
					isClosable: true,
				});
			}
		} catch (error) {
			setIsDeleted(false);
			console.error('Failed to delete note:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete the note. Please try again.',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	// If note is deleted, don't render anything
	if (isDeleted) {
		return null;
	}

	return (
		<Draggable
			nodeRef={nodeRef}
			position={controlledPosition}
			onStart={onStart}
			onDrag={onDrag}
			onStop={onStop}
			disabled={isEditing}
		>
			<Box
				ref={nodeRef}
				p={4}
				borderWidth={1}
				borderRadius='md'
				bg='white'
				boxShadow='md'
				width='300px'
				cursor={isEditing ? 'default' : 'move'}
				color='black'
			>
				{isEditing ? (
					<>
						<Input
							value={editedTitle}
							onChange={(e) => setEditedTitle(e.target.value)}
							placeholder='Note Title'
							mb={2}
							size='sm'
						/>
						<Textarea
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
							placeholder='Note Content'
							mb={2}
							size='sm'
							rows={3}
						/>
						{showEnhanced && (
							<Box
								mt={2}
								mb={2}
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

						<Flex alignItems='center' justifyContent='space-between'>
							<Flex>
								<AiEnhanceButton
									content={editedContent}
									setEnhancedContent={setEnhancedContent}
									setShowEnhanced={setShowEnhanced}
								></AiEnhanceButton>
							</Flex>
							<Flex>
								<Button
									size='xs'
									colorScheme='green'
									mr={1}
									onClick={handleSaveEdit}
								>
									Save
								</Button>
								<Button size='xs' colorScheme='red' onClick={handleCancelEdit}>
									Cancel
								</Button>
							</Flex>
						</Flex>
					</>
				) : (
					<>
						<Flex justifyContent='space-between' alignItems='center' mb={2}>
							<Heading size='sm' noOfLines={1}>
								{note.title}
							</Heading>
							<Box>
								<Button size='xs' mr={1} onClick={handleEdit}>
									Edit
								</Button>
								<Button size='xs' colorScheme='red' onClick={handleDelete}>
									Del
								</Button>
							</Box>
						</Flex>
						<Text noOfLines={3}>{note.content}</Text>
					</>
				)}
			</Box>
		</Draggable>
	);
};

export default DraggableNote;
