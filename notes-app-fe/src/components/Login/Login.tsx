import React, { useState } from "react";
import {
  Heading,
  Input,
  Button,
  Stack,
  Box,
  Text,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
} from "@chakra-ui/form-control";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { io } from "socket.io-client";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, status: 'success' | 'error' | null } | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BE_URL}/user/login`, {
        email,
        password,
      });

      const { accessToken } = response.data;
      Cookies.set("accessToken", accessToken, { expires: 1 }); 
      const socket = io(process.env.REACT_APP_BE_WS_URL, {
        transports: ['websocket'],
        withCredentials: true,
      });
      setMessage({ text: "Success. Redirecting to dashboard...", status: "success" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setMessage({ text: "Invalid email or password.", status: "error" });
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
          Login
        </Heading>
        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel color="black">Email address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>

            <FormControl id="password">
              <FormLabel color="black">Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>

            {message && (
              <Text
                fontSize="sm"
                color={message.status === "success" ? "green.500" : "red.500"}
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
              Login
            </Button>
          </Stack>
        </form>

        <Box textAlign="center" mt={4} color={"black"}>
          New user?{" "}
          <Link to="/register" style={{ color: "blue" }}>
            Register
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
