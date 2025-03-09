import { Layout } from "@/components/layouts";
import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export const FactCheck = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);

  const handleCheck = () => {
    if (prompt.trim() === "") return;

    // Add user input to messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", message: prompt },
    ]);

    // Set the response message (mock response)
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", message: `You asked: "${prompt}"` }, // Replace with actual API call
    ]);

    setPrompt(""); // Clear input field
  };

  return (
    <Layout>
      <Box 
        display="flex" 
        flexDirection="column" 
        height="80vh" 
        color="white" 
        p={2}
      >
        {/* Chat messages */}
        <Box flexGrow={1} overflow="auto" p={2}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.sender === "user" ? "flex-end" : "flex-start"}
              mb={2}
            >
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: msg.sender === "user" ? "#0e777a" : "#17C0C6",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  maxWidth: "60%",
                }}
              >
                {msg.message}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Input & Button */}
        <Box display="flex" alignItems="center" p={2}>
          <TextField
            fullWidth
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What do you want to check today?"
            InputProps={{
              sx: {
                height:50,
                fontSize:"1rem",
                color: "#ffffff",
                borderRadius: 50,
                borderColor: "transparent",
                backgroundColor: "#0e777a",
                transition: "background-color 0.3s ease-in-out",
                "&:focus-within": { backgroundColor: "#17C0C6" },
              },
            }}
          />
          <Button
            onClick={handleCheck}
            variant="contained"
            sx={{
              ml: 2,
              px: 4, // Bigger button width
              py: 1, // Bigger button height
              fontSize: "1rem", 
              color: "white",
              borderRadius: "50px",
              bgcolor: "#0e777a",
              "&:hover": { bgcolor: "#17C0C6" },
            }}
          >
            Check
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};
