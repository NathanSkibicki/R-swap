import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStringsFromFirestore } from "./firebase";
import OpenAI from "openai";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

function AI() {
  const [jobDescription, setJobDescription] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenerateResume = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const resumePoints = await getAllStringsFromFirestore();
      
      const formattedPoints = resumePoints.map(point => 
        `- ${point.text} (Category: ${point.category || "N/A"})`
      ).join("\n");
      
      const client = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY, 
        dangerouslyAllowBrowser: true 
      });
      
      const prompt = `
        I need help tailoring my resume for a job. Here is the job description:
        ${jobDescription}
        Here are my resume points:
        ${formattedPoints}
        Based on the job description, please create a tailored resume that highlights my most relevant experience and skills. Put all the experience first followed by
        2 project selections from the list.
      `;
      
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      
      setGeneratedResume(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error generating resume:", error);
      setError(`Error generating resume: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return(
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Enter Job Description
      </Typography>
      
      <TextField
        fullWidth
        label="Job Description"
        multiline
        rows={6}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        margin="normal"
        variant="outlined"
        placeholder="Paste the job description here..."
      />
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGenerateResume}
          disabled={isLoading || !jobDescription.trim()}
        >
          {isLoading ? <CircularProgress size={24} /> : "Generate Resume"}
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={handleGoBack}
        >
          Back to Resume Points
        </Button>
      </Box>
      
      {generatedResume && (
        <Paper sx={{ mt: 4, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Generated Resume
          </Typography>
          <Box sx={{ whiteSpace: "pre-wrap" }}>
            {generatedResume.split("\n").map((line, i) => (
              <Typography key={i} paragraph={line.trim() !== ""} variant="body1">
                {line}
              </Typography>
            ))}
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => {
                navigator.clipboard.writeText(generatedResume);
                alert("Resume copied to clipboard!");
              }}
            >
              Copy to Clipboard
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  )
}
export default AI;