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
        
        Based on the job description, please create a tailored resume that highlights my most relevant experience and skills. Format it professionally with sections for Experience, Projects, Skills, etc. as appropriate.
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
    <div>
        <h1>awsfoih</h1>
    </div>
  )
}
export default AI;