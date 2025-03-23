import React, { useState } from 'react';
import {
  Heading,
  Input,
  Button,
  Stack,
  Box,
  Text,
} from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
} from "@chakra-ui/form-control";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, status: 'success' | 'error' | null } | null>(null); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BE_URL}/user/register`,
        formData
      );

      setMessage({ text: 'Success Check your email for the password.', status: 'success' });

      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.100"
    >
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <Heading as="h2" size="lg" textAlign="center" mb={6} color="gray.800">
          Register
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="firstName">
              <FormLabel color="black">First Name</FormLabel>
              <Input
                type="text"
                id='firstName'
                placeholder="Enter your First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                color="black"
                bg="white"
                _placeholder={{ color: 'gray.500' }}
              />
            </FormControl>

            <FormControl id="lastName">
              <FormLabel color="black">Last Name</FormLabel>
              <Input
                type="text"
                id="lastName"
                placeholder="Enter your Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                color="black"
                bg="white"
                _placeholder={{ color: 'gray.500' }}
              />
            </FormControl>

            <FormControl id="email">
              <FormLabel color="black">Email address</FormLabel>
              <Input
                type="email"
                id='email'
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                color="black"
                bg="white" 
                _placeholder={{ color: 'gray.500' }}
              />
            </FormControl>

            {message && (
              <Text
                fontSize="sm"
                color={message.status === 'success' ? 'green.500' : 'red.500'}
                textAlign="center"
              >
                {message.text}
              </Text>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              mt={4}
              variant="subtle"
              isLoading={isLoading}
            >
              Register
            </Button>
          </Stack>
        </form>

        <Box textAlign="center" mt={4} color="black">
          Already a user?{' '}
          <Link to="/login" style={{ color: 'blue' }}>
            Login
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
