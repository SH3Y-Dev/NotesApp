import React, { useEffect, useState } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import DraggableNote from '../DraggableNote/DraggableNote';
import Header from '../Header/Header';
import { useNotes } from '../../context/NotesContext';
import axiosInstance from '../../axios/axios.instance';
import { useSocket } from '../../context/SocketContext';
import { useColorModeValue } from '../ui/color-mode';
import { useToast} from '@chakra-ui/toast';

const GRID_CELL_WIDTH = 320;
const GRID_CELL_HEIGHT = 150;
const GRID_COLUMNS = 3;
const STARTING_OFFSET_X = 20;
const STARTING_OFFSET_Y = 80;

const Dashboard: React.FC = () => {
	const { state, dispatch } = useNotes();
	const socket = useSocket();
	const toast = useToast();
	const [isReorganizing, setIsReorganizing] = useState(false);

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				const response = await axiosInstance.get(
					`${process.env.REACT_APP_BE_URL}/notes`,
				);
				if (response.status === 200) {
					const notes = response.data.map((note: any) => ({
						id: note._id,
						title: note.title,
						content: note.content,
						x: note.x,
						y: note.y,
					}));

					dispatch({ type: 'SET_NOTES', payload: notes });
				}
			} catch (error) {
				console.error('Failed to fetch notes:', error);
			}
		};

		fetchNotes();
	}, [dispatch]);

	useEffect(() => {
		if (!socket) return;

		socket.on('noteCreated', (newNote: any) => {
			dispatch({
				type: 'ADD_NOTE',
				payload: {
					id: newNote._id,
					title: newNote.title,
					content: newNote.content,
					x: newNote.x,
					y: newNote.y,
				},
			});
		});

		socket.on('noteDeleted', (newNote: any) => {			
			dispatch({
				type: 'DELETE_NOTE',
				payload: newNote,
			});
		});

		socket.on('noteUpdated', (updatedNote: any) => {
			dispatch({
				type: 'UPDATE_NOTE_POSITION',
				payload: {
					id: updatedNote._id,
					title: updatedNote.title,
					content: updatedNote.content,
					x: updatedNote.x,
					y: updatedNote.y,
				},
			});
		});

		return () => {
			socket.off('noteCreated');
			socket.off('noteUpdated');
		};
	}, [socket, dispatch]);

	const calculateGridPosition = (index: number) => {
		const col = index % GRID_COLUMNS;
		const row = Math.floor(index / GRID_COLUMNS);
		
		return {
			x: STARTING_OFFSET_X + (col * GRID_CELL_WIDTH),
			y: STARTING_OFFSET_Y + (row * GRID_CELL_HEIGHT)
		};
	};

	const handleReorganize = async () => {
		setIsReorganizing(true);
		
		try {
			const reorganizedNotes = [...state.notes].map((note, index) => {
				const { x, y } = calculateGridPosition(index);
				return { ...note, x, y };
			});

			const updatePromises = reorganizedNotes.map(note => 
				axiosInstance.put(`${process.env.REACT_APP_BE_URL}/notes/${note.id}`, {
					...note,
					x: note.x,
					y: note.y
				})
			);
			
			await Promise.all(updatePromises);
			
			reorganizedNotes.forEach(note => {
				dispatch({
					type: 'UPDATE_NOTE_POSITION',
					payload: { id: note.id, x: note.x, y: note.y }
				});
			});
			
			toast({
				title: 'Notes reorganized',
				description: 'Your notes have been arranged in a grid pattern.',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			console.error('Failed to reorganize notes:', error);
			toast({
				title: 'Error',
				description: 'Failed to reorganize notes. Please try again.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsReorganizing(false);
		}
	};

	const bgColor = useColorModeValue('gray.50', 'gray.800');

	return (
		<Box minH='100vh' bg={bgColor} position="relative">
			<Header />
			
{state.notes.length > 0 && (
  <Flex justify="center" my={4}>
    <Button 
      onClick={handleReorganize}
      isLoading={isReorganizing}
      loadingText="Reorganizing"
      leftIcon={<span role="img" aria-label="organize">🔄</span>}
      size="md"
      px={6}
      py={5}
      fontWeight="bold"
      boxShadow="md"
      color="black"
      _hover={{ 
        transform: "translateY(-2px)", 
        boxShadow: "lg",
        opacity: 0.9,
		color: "black"
      }}
      _active={{ 
        transform: "translateY(0)",
        boxShadow: "sm",
        opacity: 0.8
      }}
      transition="all 0.2s"
      borderRadius="full"
      bgGradient="linear(to-r, #4776E6, #8E54E9)"
    >
      Reorganize Notes
    </Button>
  </Flex>
)}
			
			<Box 
				position="relative" 
				minH="calc(100vh - 150px)" 
				p={4}
				maxW="1200px"
				mx="auto"
			>
				{state.notes.map((note) => (
					<DraggableNote key={note.id} note={note} />
				))}
			</Box>
		</Box>
	);
};

export default Dashboard;