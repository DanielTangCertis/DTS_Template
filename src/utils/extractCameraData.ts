// extractCameraDataUtility.ts
import * as fs from "fs";
import * as path from "path";

// Import your source data
import * as SourceData from "./cameraSourceData";

/**
 * Extracts camera information from source data
 */
function extractCameraData(sourceData: any[], levelKey: string) {
  return sourceData.map((camera) => {
    const assetNameProp = camera.data.Properties.find(
      (prop: any) => prop["标记"] !== undefined
    );

    return {
      UUID: camera.data.UUID,
      AssetName: assetNameProp ? assetNameProp["标记"] : "",
      location: camera.CoordinateInformation.location,
      LevelKey: levelKey,
    };
  });
}

// Generate the output content
function generateOutputFile() {
  let output = "// Auto-generated camera data\n";
  output += "// This file contains extracted camera information\n\n";

  // Process all exports from source data
  Object.keys(SourceData).forEach((key) => {
    const sourceData = (SourceData as any)[key];

    if (Array.isArray(sourceData)) {
      const extractedData = extractCameraData(sourceData, key);
      output += `export const ${key} = ${JSON.stringify(
        extractedData,
        null,
        2
      )};\n\n`;
    }
  });

  return output;
}

// Write to output file
function writeOutputFile() {
  const outputContent = generateOutputFile();
  const outputPath = "./cameraData.ts";

  fs.writeFileSync(outputPath, outputContent, "utf-8");
  console.log(`✅ Successfully generated camera data file: ${outputPath}`);
  console.log(`📊 File size: ${(outputContent.length / 1024).toFixed(2)} KB`);
}

// Run the extraction
writeOutputFile();
