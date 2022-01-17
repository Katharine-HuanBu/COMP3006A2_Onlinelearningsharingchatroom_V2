module.exports = app => {
  const channel = require("../controllers/channel.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", channel.create);

  // Retrieve all Tutorials
  router.get("/", channel.findAll);

  router.get("/:id", channel.findOne);

  // Update a Tutorial with id
  router.put("/:id", channel.update);

  // Delete a Tutorial with id
  router.delete("/:id", channel.delete);

  // Create a new Tutorial
  router.delete("/", channel.deleteAll);

  app.use("/api/channel", router);
};
