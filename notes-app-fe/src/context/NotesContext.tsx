import React, { createContext, useReducer, useContext, ReactNode } from 'react';

export interface Note {
	id: string;
	title: string;
	content: string;
	x: number;
	y: number;
}

interface NotesState {
	notes: Note[];
}

type Action =
	| { type: 'ADD_NOTE'; payload: Note }
	| { type: 'UPDATE_NOTE_POSITION'; payload: Note }
	| { type: 'DELETE_NOTE'; payload: string }
	| { type: 'SET_NOTES'; payload: Note[] };

const initialState: NotesState = {
	notes: [],
};

const NotesContext = createContext<{
	state: NotesState;
	dispatch: React.Dispatch<Action>;
}>({
	state: initialState,
	dispatch: () => null,
});

const notesReducer = (state: NotesState, action: Action): NotesState => {
	switch (action.type) {
		case 'ADD_NOTE':
			return {
				...state,
				notes: [...state.notes, action.payload],
			};
		case 'UPDATE_NOTE_POSITION':
			return {
				...state,
				notes: state.notes.map((note) =>
					note.id === action.payload.id
						? {
								...note,
								x: action.payload.x,
								y: action.payload.y,
								title: action.payload.title ?? note.title,
								content: action.payload.content ?? note.content,
						  }
						: note,
				),
			};
		case 'DELETE_NOTE':
			return {
				...state,
				notes: state.notes.filter((note) => note.id !== action.payload),
			};
		case 'SET_NOTES':
			return {
				...state,
				notes: action.payload,
			};
		default:
			return state;
	}
};

export const NotesProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(notesReducer, initialState);

	return (
		<NotesContext.Provider value={{ state, dispatch }}>
			{children}
		</NotesContext.Provider>
	);
};

export const useNotes = () => useContext(NotesContext);
