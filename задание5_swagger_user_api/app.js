const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 3000;

const createId = () => Math.random().toString(36).slice(2, 8);

let users = [
  { id: createId(), name: "Пётр", age: 16 },
  { id: createId(), name: "Иван", age: 18 },
  { id: createId(), name: "Дарья", age: 20 }
];

app.use(express.json());

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} -> ${res.statusCode}`);
    if (["POST", "PATCH"].includes(req.method)) {
      console.log("Body:", req.body);
    }
  });
  next();
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API управления пользователями",
      version: "1.0.0",
      description: "Простое CRUD API с документацией Swagger"
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Локальный сервер"
      }
    ]
  },
  apis: ["./app.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный идентификатор пользователя
 *           example: abc123
 *         name:
 *           type: string
 *           description: Имя пользователя
 *           example: Пётр
 *         age:
 *           type: integer
 *           description: Возраст пользователя
 *           example: 18
 */

function findUserOr404(id, res) {
  const user = users.find((item) => item.id === id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return null;
  }

  return user;
}

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Возвращает список всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/api/users", (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создаёт нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Пользователь создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации
 */
app.post("/api/users", (req, res) => {
  const { name, age } = req.body || {};

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Field 'name' is required" });
  }

  if (!Number.isInteger(Number(age)) || Number(age) < 0) {
    return res.status(400).json({ error: "Field 'age' must be a non-negative integer" });
  }

  const newUser = {
    id: createId(),
    name: name.trim(),
    age: Number(age)
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получает пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 */
app.get("/api/users/:id", (req, res) => {
  const user = findUserOr404(req.params.id, res);
  if (!user) return;

  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Обновляет пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Обновлённый пользователь
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Нет данных для обновления или невалидные данные
 *       404:
 *         description: Пользователь не найден
 */
app.patch("/api/users/:id", (req, res) => {
  const user = findUserOr404(req.params.id, res);
  if (!user) return;

  const { name, age } = req.body || {};

  if (name === undefined && age === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Field 'name' must be a non-empty string" });
    }
    user.name = name.trim();
  }

  if (age !== undefined) {
    if (!Number.isInteger(Number(age)) || Number(age) < 0) {
      return res.status(400).json({ error: "Field 'age' must be a non-negative integer" });
    }
    user.age = Number(age);
  }

  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удаляет пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь удалён
 *       404:
 *         description: Пользователь не найден
 */
app.delete("/api/users/:id", (req, res) => {
  const exists = users.some((item) => item.id === req.params.id);

  if (!exists) {
    return res.status(404).json({ error: "User not found" });
  }

  users = users.filter((item) => item.id !== req.params.id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`User API started at http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
