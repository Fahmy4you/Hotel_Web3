const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API documentation for Hotel Web3 project",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Operations related to authentication",
    },
    {
      name: "Hotel",
      description: "Operations related to hotels",
    },
    {
      name: "Role",
      description: "Operations related to user roles",
    },
  ],
  paths: {
    // Endpoint untuk Hotel
    "/hotels": {
      get: {
        summary: "Get all hotels",
        description: "Retrieve a list of all available hotels",
        tags: ["Hotel"],
        responses: {
          200: {
            description: "List of hotels",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Hotel",
                  },
                },
              },
            },
          },
          500: {
            description: "Server error",
          },
        },
      },
      post: {
        summary: "Create a new hotel",
        description: "Add a new hotel to the database",
        tags: ["Hotel"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HotelInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Hotel created successfully",
          },
          400: {
            description: "Invalid input",
          },
          500: {
            description: "Server error",
          },
        },
      },
    },

    // Endpoint untuk Role
    "/roles": {
      get: {
        summary: "Get all roles",
        description: "Retrieve a list of all available roles",
        tags: ["Role"], // Pastikan tag-nya "Role", bukan "Hotel"
        responses: {
          200: {
            description: "List of roles",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Role",
                  },
                },
              },
            },
          },
          500: {
            description: "Server error",
          },
        },
      },
    },

    "/Auth/Login": {
      post: {
        summary: "Get all roles",
        description: "Retrieve a list of all available roles",
        tags: ["Auth"],
        responses: {
          200: {
            description: "Return token for Authentication",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Role",
                  },
                },
              },
            },
          },
          500: {
            description: "Server error",
          },
          404: {
            description: "Cannot find the user",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      // Schema untuk Hotel
      Hotel: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "hotel-1",
          },
          name: {
            type: "string",
            example: "Luxury Hotel",
          },
          location: {
            type: "string",
            example: "New York",
          },
          price: {
            type: "number",
            example: 250,
          },
        },
      },
      HotelInput: {
        type: "object",
        required: ["name", "location", "price"],
        properties: {
          name: {
            type: "string",
            example: "Sea View Resort",
          },
          location: {
            type: "string",
            example: "Miami",
          },
          price: {
            type: "number",
            example: 180,
          },
        },
      },
      // Schema untuk Role
      Role: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "role-1",
          },
          name: {
            type: "string",
            example: "Admin",
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export const getSwaggerSpec = () => {
  return swaggerSpec;
};
