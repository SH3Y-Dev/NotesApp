import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useToast } from '@chakra-ui/toast';
import axiosInstance from '../../axios/axios.instance';
import { useNotes } from '../../context/NotesContext';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/modal';

const EditNoteModal: React.FC<{ isOpen: boolean; onClose: () => void; note: any }> = ({
  isOpen,
  onClose,
  note,
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const toast = useToast();
  const { dispatch } = useNotes();

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put(
        `${process.env.REACT_APP_BE_URL}/notes/${note.id}`,
        {
          ...note,
          title,
          content,
        }
      );

      if (response.status === 200) {
        dispatch({
          type: 'UPDATE_NOTE',
          payload: {
            id: note.id,
            title,
            content,
          },
        });

        toast({
          title: 'Note updated.',
          description: "The note has been updated.",
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        onClose();
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Content</FormLabel>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditNoteModal;