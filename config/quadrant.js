import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";

dotenv.config();

const qdrantClient = new QdrantClient({
  url: process.env.QUADRANT_CLUSTER_ENDPOINT,
  apiKey: process.env.QUADRANT_API,
});
 
// initialize collection
const initFrameworkCollection = async () => {
  const collectionName = "frameworks";

  try {
    const res = await qdrantClient.getCollections();

    const exists = res.collections.some(
      (c) => c.name === collectionName
    );

    if (!exists) {
      await qdrantClient.createCollection(collectionName, {
        vectors: {
          size: 384,
          distance: "Cosine",
        },
      });

      await qdrantClient.createPayloadIndex(collectionName, {
        field_name: "frameworkId",
        field_schema: "keyword",
      });

      console.log(
        `✅ Qdrant Collection '${collectionName}' created successfully.`
      );
    } else {
      console.log(
        `.Qdrant Collection '${collectionName}' already exists.`
      );
    }

  } catch (err) {
    console.error("❌ Collection Setup Error:", err);
  }
};

// connection function
export const connectQdrant = async () => {
  try {
    const res = await qdrantClient.getCollections();

    console.log(
      "✅ Qdrant Database Connected:",
      res.collections.length,
      "collections found."
    );

    await initFrameworkCollection();

  } catch (err) {
    console.error("❌ Qdrant Database Connection Error:", err);
  }
};

export default qdrantClient;