/**
 * Chunks a MongoDB Framework document into smaller, precise pieces for vectorization.
 * In compliance analysis, the best way to chunk is by individual "Controls".
 * 
 * @param {Object} framework - The mongoose Framework document
 * @returns {Array<Object>} - An array of chunk objects containing the text and metadata
 */
export const chunkFramework = (framework) => {
  const chunks = [];

  // If the framework has no controls, we can just vectorize its general description
  if (!framework.controls || framework.controls.length === 0) {
    const text = `Framework: ${framework.name} (${framework.shortCode})
Description: ${framework.description || "No description provided."}
Authority: ${framework.authority || "N/A"}`;
    
    chunks.push({
      text,
      metadata: {
        frameworkId: framework._id.toString(),
        frameworkUuid: framework.uuid,
        frameworkName: framework.name,
        shortCode: framework.shortCode,
        isGeneralDescription: true,
      }
    });
    return chunks;
  }

  // Iterate over every control and make it a dedicated chunk
  framework.controls.forEach((control) => {
    // We construct a rich text string that the AI will understand during semantic search
    const text = `Framework: ${framework.name} (${framework.shortCode})
Control ID: ${control.controlId} - ${control.title}
Requirement: ${control.requirementText || "N/A"}
Description: ${control.description || "N/A"}
Risk Level: ${control.riskLevel}
Mandatory: ${control.mandatory ? "Yes" : "No"}
Tags: ${control.tags && control.tags.length > 0 ? control.tags.join(", ") : "None"}`;

    chunks.push({
      text, // This is what we will send to Hugging Face
      metadata: {
        // This is what we will save in Qdrant as the Payload
        frameworkId: framework._id.toString(),
        frameworkUuid: framework.uuid,
        frameworkName: framework.name,
        shortCode: framework.shortCode,
        controlId: control.controlId,
        controlTitle: control.title,
        riskLevel: control.riskLevel,
        isMandatory: control.mandatory
      }
    });
  });

  return chunks;
};