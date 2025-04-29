import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import type { OpenAPIV3 } from "openapi-types";
import fs from "fs";

const apiPath = path.join(process.cwd(), "src", "app", "api");
console.log(`Looking for API files in: ${apiPath}`);
console.log(`Directory exists: ${fs.existsSync(apiPath)}`);

// Try to list some files to verify path is correct
try {
  const files = fs.readdirSync(apiPath);
  console.log(`Files in directory: ${files.join(", ")}`);
} catch (err) {
  console.error("Error reading directory:", err);
}

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel API",
      version: "1.0.0",
      description: "API documentation for Hotel Web3 project"
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server"
      },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Bearer token",
        },
      },
    },
  },
  apis: ["./src/app/api/**/*.ts"],
};

let swaggerSpec: OpenAPIV3.Document;

try {
  console.log("Attempting to generate swagger spec...");
  swaggerSpec = swaggerJSDoc(options) as OpenAPIV3.Document;
  console.log("Swagger spec generated successfully");
} catch (error) {
  console.error("Error generating Swagger documentation:", error);
  swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "Hotel API (Error Loading)",
      version: "1.0.0",
      description: "Error loading API documentation. Check server logs for details."
    },
    paths: {}
  } as OpenAPIV3.Document;
}

export default swaggerSpec;