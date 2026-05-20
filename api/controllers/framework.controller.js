import { Framework } from "../models/framework.schema.js";
import { chunkFramework } from "../../utils/chunking.js";
import { generateEmbedding } from "../../utils/embeddings.js";
import qdrantClient from "../../config/quadrant.js";
import { randomUUID } from "crypto";

export const createFrameWork = async (req, res, next) => {
  try {
    const {
      name,
      shortCode,
      description,
      authority,
      country,
      version,
      industry,
      appliesTo,
      controls,
    } = req.body;

    if (
      !name ||
      !shortCode ||
      !description ||
      !authority ||
      !country ||
      !industry ||
      !controls ||
      !appliesTo
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const findFramwork = {
      $or: [{ shortCode }, { version }],
    };
    const IsframeworkExist = await Framework.findOne(findFramwork);
    if (IsframeworkExist) {
      return res.status(400).json({
        message: "Framework is already exist",
      });
    }

    const framework = await Framework.create({
      name,
      shortCode,
      description,
      version,
      authority,
      country,
      industry,
      controls,
      appliesTo,
      createdBy: req.user.id,
    });

    // --- PART 2: Sync new framework to Qdrant immediately ---
    try {
      const chunks = chunkFramework(framework);
      for (const chunk of chunks) {
        const vector = await generateEmbedding(chunk.text);
        await qdrantClient.upsert("frameworks", {
          wait: true,
          points: [
            {
              id: randomUUID(),
              vector: vector,
              payload: { text: chunk.text, ...chunk.metadata }
            }
          ]
        });
      }
    } catch (vectorErr) {
      console.error("❌ Failed to save to Vector DB during creation:", vectorErr);
      // Not returning error to user as Mongo save was successful, but logging it.
    }
    // --------------------------------------------------------

    return res.status(201).json({
      data: framework,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//  get framework:
export const getFramework = async (req, res, next) => {
  try {
    const framework = await Framework.find({ isActive: true });
    if (!framework || framework.length === 0) {
      return res.status(400).json({
        message: "No Framwork Exist",
      });
    }
    return res.status(200).json({
      data: framework,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// --- PART 1: Sync all existing frameworks to Qdrant ---
export const syncFrameworksToVectorDB = async (req, res, next) => {
  try {
    const frameworks = await Framework.find({ isActive: true });

    if (!frameworks || frameworks.length === 0) {
      return res.status(400).json({ message: "No frameworks found to sync" });
    }

    let totalChunksSynced = 0;

    for (const framework of frameworks) {
      const chunks = chunkFramework(framework);

      for (const chunk of chunks) {
        // Generate embedding
        const vector = await generateEmbedding(chunk.text);

        // Save to Qdrant
        await qdrantClient.upsert("frameworks", {
          wait: true,
          points: [
            {
              id: randomUUID(),
              vector: vector,
              payload: {
                text: chunk.text,
                ...chunk.metadata
              }
            }
          ]
        });
        totalChunksSynced++;
      }
    }

    return res.status(200).json({
      message: `Successfully synced ${frameworks.length} frameworks (${totalChunksSynced} chunks) to Qdrant.`,
    });
  } catch (err) {
    console.error("Vector DB Sync Error:", err);
    return res.status(500).json({
      message: "Failed to sync to Vector DB",
      error: err.message
    });
  }
};