import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel API",
      version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    servers: [
      {
        url: "http://localhost:3000/api",
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
  apis: ["./src/app/api/**/route.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;