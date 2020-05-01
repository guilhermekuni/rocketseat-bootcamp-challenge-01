const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const newItem = {
    ...request.body,
    id: uuid(),
    likes: 0,
  };

  repositories.push(newItem);

  return response.json(newItem);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const itemIndex = repositories.findIndex(item => item.id === id);

  if (itemIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository does not exists' });
  }

  const updatedRepository = { ...repositories[itemIndex], url, title, techs };

  repositories[itemIndex] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const itemIndex = repositories.findIndex(item => item.id === id);

  if (itemIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository does not exists' });
  }

  repositories.splice(itemIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const itemIndex = repositories.findIndex(item => item.id === id);

  if (itemIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repository does not exists' });
  }

  const repo = repositories[itemIndex];
  const updatedRepository = { ...repo, likes: (repo.likes + 1) };

  repositories[itemIndex] = updatedRepository;

  return response.json(updatedRepository);
});

module.exports = app;
