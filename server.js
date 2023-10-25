import fetch from "node-fetch";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      const error = new Error("'url' query param is required");
      error.status = 400;
      throw error;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error(`There was an error fetching '${url}'`);
      error.status = response.status;
      throw error;
    }

    const contentType = response.headers.get("Content-Type");

    if (!contentType) {
      return response.end();
    }

    const isTextResponse = contentType.includes("text");

    const body = isTextResponse ? await response.text() : await response.json();

    res.send({ data: body });
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});

app.listen(4000, () => {
  console.log(`API listening on port 4000 `);
});

export default app;
