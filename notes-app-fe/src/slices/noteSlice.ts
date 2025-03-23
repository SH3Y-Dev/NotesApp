import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const initialState: NotesState = {
  notes: [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    updateNotePosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const { id, x, y } = action.payload;
      const note = state.notes.find((note) => note.id === id);
      if (note) {
        note.x = x;
        note.y = y;
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
  },
});

export const { addNote, updateNotePosition, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;