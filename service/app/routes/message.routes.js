const { route } = require("express/lib/application");

module.exports = app => {
  const message = require("../controllers/message.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", message.create);

  // Retrieve all Tutorials
  router.get("/", message.findAll);


  router.get("/:channelId", message.findByChannelId);

  // Update a Tutorial with id
  router.put("/:id", message.update);

  // Delete a Tutorial with id
  router.delete("/:id", message.delete);

  // Create a new Tutorial
  router.delete("/", message.deleteAll);

  app.use("/api/message", router);
};
