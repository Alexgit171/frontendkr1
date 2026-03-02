const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

let products = [
  { id: 1, name: "Ноутбук AirBook 14", price: 64990 },
  { id: 2, name: "Беспроводная мышь Click Mini", price: 2490 },
  { id: 3, name: "Механическая клавиатура KeyPro", price: 7190 }
];

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Products API is running");
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

app.post("/products", (req, res) => {
  const { name, price } = req.body || {};

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Field 'name' is required" });
  }

  if (!Number.isFinite(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ error: "Field 'price' must be a non-negative number" });
  }

  const nextId = products.length ? Math.max(...products.map((item) => item.id)) + 1 : 1;
  const newProduct = {
    id: nextId,
    name: name.trim(),
    price: Number(price)
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { name, price } = req.body || {};

  if (name === undefined && price === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Field 'name' must be a non-empty string" });
    }
    product.name = name.trim();
  }

  if (price !== undefined) {
    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ error: "Field 'price' must be a non-negative number" });
    }
    product.price = Number(price);
  }

  res.json(product);
});

app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = products.some((item) => item.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Product not found" });
  }

  products = products.filter((item) => item.id !== id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
