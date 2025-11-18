import express from "express";
import "dotenv/config.js";
import cors from "cors";
// routers
import todoRouter from "./router/todoRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import authRouter from "./router/authRouter.js";
import { createTables } from "./utils/create.js";
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger/swagger.js';
import errorHandler from "./middleware/errorHandler.js";
import requestLogger from "./middleware/requestLogger.js";
import { AppError } from "./errors/AppError.js";


const PORT = 3000;

const app = express();

app.use(express.json());
// Разрешим CORS для браузерных клиентов/Swagger, можно сузить origin через переменную окружения
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(requestLogger);

createTables();


app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Todo API',
    docs: '/api-docs',
    endpoints: {
      categories: '/api/categories',
      todos: '/api/todos'
    }
  });
});

// Корневой маршрут: редирект на описание API
app.get('/', (req, res) => {
  res.redirect('/api');
});

app.use("/api/auth", authRouter);
app.use("/api/todos", todoRouter);
app.use("/api/categories", categoryRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
 
// Маршрут для несуществующих адресов
app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

// Регистрация глобального обработчика ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}/api-docs`);
});
