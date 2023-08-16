const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
let videos = [];

// GET "/"
app.get("/", (req, res) => {
  res.send(videos);
});

// POST "/"
app.post("/", (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).send({
      result: "failure",
      message: "Both title and url are required.",
    });
  }

  const id = Date.now();
  videos.push({ id, title, url, rating: 0 });

  res.send({ id });
});

// GET "/{id}"
app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const video = videos.find((video) => video.id === id);

  if (!video) {
    return res.status(404).send({ message: "Video not found." });
  }

  res.send(video);
});

// DELETE "/{id}"
app.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = videos.length;

  videos = videos.filter((video) => video.id !== id);

  if (videos.length === initialLength) {
    return res.status(404).send({
      result: "failure",
      message: "Video could not be deleted.",
    });
  }

  res.send({});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
