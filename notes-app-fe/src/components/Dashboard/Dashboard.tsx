import React, { useEffect } from 'react';
import { Box, Heading, Grid } from '@chakra-ui/react';
import DraggableNote from '../DraggableNote/DraggableNote';
import Header from '../Header/Header';
import { useNotes } from '../../context/NotesContext';
import axiosInstance from '../../axios/axios.instance';
import { useSocket } from '../../context/SocketContext';
import { useColorModeValue } from '../ui/color-mode';

const Dashboard: React.FC = () => {
	const { state, dispatch } = useNotes();
	const socket = useSocket();

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
			console.log('Received noteCreated event:', newNote);
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

		socket.on('noteUpdated', (updatedNote: any) => {
			console.log('Received noteUpdated event:', updatedNote);
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

	const bgColor = useColorModeValue('gray.50', 'gray.800');
	const noteBgColor = useColorModeValue('white', 'gray.700');

	return (
		<Box minH='100vh' bg={bgColor}>
			<Header />
			<Box p={4}>
				<Heading
					mb={4}
					textAlign='center'
					color={useColorModeValue('teal.500', 'teal.200')}
				>
					Dashboard
				</Heading>
				<Grid
					templateColumns='repeat(auto-fill, minmax(250px, 1fr))'
					gap={4}
					p={4}
					maxW='1200px'
					mx='auto'
				>
					{state.notes.map((note) => (
						<DraggableNote key={note.id} note={note} />
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default Dashboard;
