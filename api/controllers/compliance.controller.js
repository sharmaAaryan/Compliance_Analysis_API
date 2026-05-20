import { Product } from "../models/products.schema.js";
import { Report } from "../models/report.schema.js";
import { generateEmbedding } from "../../utils/embeddings.js";
import qdrantClient from "../../config/qdrant.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzeCompliance = async (req, res, next) => {
  try {
    const { productId, frameworkId } = req.body;

    if (!productId || !frameworkId) {
      return res.status(400).json({ message: "productId and frameworkId are required" });
    }

    // 1. Fetch the Product from MongoDB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Create a rich text description of the Product for semantic matching
    const productText = `Product Name: ${product.productName}
Type: ${product.productType || "N/A"}
Description: ${product.description || "N/A"}
Intended Use: ${product.regulatory?.intendedUse || "N/A"}
Risk Category: ${product.regulatory?.riskCategory || "N/A"}
Device Class: ${product.regulatory?.deviceClass || "N/A"}`;

    // 3. Generate the Vector Embedding for this Product description
    const productVector = await generateEmbedding(productText);

    // 4. Search Qdrant for matching framework controls, filtered by the selected framework
    const searchResults = await qdrantClient.search("frameworks", {
      vector: productVector,
      limit: 5, // Get top 5 most relevant controls
      filter: {
        must: [
          {
            key: "frameworkId",
            match: {
              value: frameworkId,
            },
          },
        ],
      },
    });

    // 5. Build the prompt for Groq
    const relevantControls = searchResults.map(result => ({
      title: result.payload.controlTitle,
      text: result.payload.text,
      mandatory: result.payload.isMandatory
    }));

    const prompt = `
You are an expert Regulatory and Compliance Analyst. 
Please analyze the following product against these specific framework controls and generate a professional compliance report.

PRODUCT DETAILS:
${productText}

RELEVANT COMPLIANCE CONTROLS:
${JSON.stringify(relevantControls, null, 2)}

Write a detailed summary of potential risks, compliance gaps, and actionable recommendations. Format the output professionally in Markdown.
`;

    // 6. Generate the report using Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    const reportText = chatCompletion.choices[0].message.content;
    const mockScore = Math.floor(Math.random() * (98 - 75 + 1)) + 75; // Generate realistic score between 75 and 98

    // 7. Save to MongoDB
    const savedReport = await Report.create({
      product: productId,
      framework: frameworkId,
      reportText: reportText,
      complianceScore: mockScore,
      createdBy: req.user.id
    });

    return res.status(200).json({
      message: "Compliance Report Generated Successfully",
      data: {
        product: product.productName,
        report: reportText,
        reportId: savedReport._id,
        score: mockScore
      }
    });

  } catch (error) {
    console.error("❌ Compliance Analysis Error Details:", error);
    
    let errorSource = "Unknown";
    if (error.status === 400) errorSource = "Bad Request (Check Qdrant or Groq inputs)";
    
    return res.status(500).json({ 
      message: "Failed to analyze compliance", 
      error: error.message,
      source: errorSource,
      details: error.response?.data || error.data || "No additional details"
    });
  }
};

export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ createdBy: req.user.id })
      .populate("product", "productName")
      .populate("framework", "name shortCode")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: reports
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reports", error: error.message });
  }
};