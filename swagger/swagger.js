import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "API for Todo app",
    },
    // Define security schemes for labatory work 3
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          required: ["status", "message"],
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string", example: "Описание ошибки" }
          }
        },
        ValidationErrorDetail: {
          type: "object",
          required: ["field", "message"],
          properties: {
            field: { type: "string", example: "email" },
            message: { type: "string", example: "Некорректный email" }
          }
        },
        ValidationErrorResponse: {
          type: "object",
          required: ["status", "message", "errors"],
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string", example: "Ошибка валидации данных" },
            errors: {
              type: "array",
              items: { $ref: '#/components/schemas/ValidationErrorDetail' }
            }
          }
        }
      },
      responses: {
        ErrorResponse: {
          description: "Унифицированный ответ об ошибке",
          content: {
            "application/json": {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                serverError: {
                  summary: "Ошибка сервера",
                  value: { status: "error", message: "Internal server error" }
                },
                notFound: {
                  summary: "Не найдено",
                  value: { status: "error", message: "Resource not found" }
                },
                forbidden: {
                  summary: "Доступ запрещен",
                  value: { status: "error", message: "Forbidden" }
                },
                unauthorized: {
                  summary: "Неавторизован",
                  value: { status: "error", message: "Unauthorized" }
                }
              }
            }
          }
        },
        ValidationErrorResponse: {
          description: "Ошибка валидации с подробным описанием полей",
          content: {
            "application/json": {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              examples: {
                invalidData: {
                  summary: "Некорректные данные",
                  value: {
                    status: "error",
                    message: "Ошибка валидации данных",
                    errors: [
                      { field: "username", message: "Должно быть не короче 3 символов" },
                      { field: "email", message: "Некорректный email" }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: [
    "./router/**/*.js",
    "./router/swaggerD.js",
  ],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
