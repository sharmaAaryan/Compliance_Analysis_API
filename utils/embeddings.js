import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Generate a vector embedding for a given text chunk using a free Hugging Face model
 * @param {string} text - The text to vectorize
 * @returns {Promise<number[]>} - The vector embedding (array of numbers)
 */
export const generateEmbedding = async (text) => {
  try {
    const response = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    return response;
  } catch (error) {
    console.error("❌ Error generating embedding:", error);
    throw error;
  }
};