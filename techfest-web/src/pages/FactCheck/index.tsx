import { Layout } from "@/components/layouts";
import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import Markdown from "react-markdown";

export const FactCheck = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (prompt.trim() === "") return;
    setLoading(true);
    // Add user input to messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", message: prompt },
    ]);

    try {
      const response = await fetch("http://127.0.0.1:8001/fact-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claim: prompt }),
      });

      const data = await response.json();
      console.log("fact check data", data);
      // Set the response message (mock response)
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: data.result }, // Replace with actual API call
      ]);
    } catch (err) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: "An error occured" }, // Replace with actual API call
      ]);
    } finally {
      setPrompt(""); // Clear input field
      setLoading(false);
    }
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
                  backgroundColor:
                    msg.sender === "user" ? "#0e777a" : "#17C0C6",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  maxWidth: "60%",
                }}
              >
                <Markdown>{msg.message}</Markdown>
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Input & Button */}
        <Box display="flex" alignItems="center" p={2}>
          <TextField
            disabled={loading}
            fullWidth
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What do you want to check today?"
            InputProps={{
              sx: {
                height: 50,
                fontSize: "1rem",
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
            loading={loading}
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
