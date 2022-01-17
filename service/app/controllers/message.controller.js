const db = require("../models");
const Message = db.message;
const User = db.user;
// Create and Save a new Message
exports.create = (req, res) => {

  // Create a Message
  const message = new Message({
    userId: req.body.userId,
    username: req.body.username,
    avatar: req.body.avatar,
    msg: req.body.msg,
    file: req.body.file,
    channelId: req.body.channelId
  });

  // Save Message in the database
  message
    .save(message)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Message."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Message.find(condition)
    .then(data => {
      console.log('----------- data ------------', data)
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving message."
      });
    });
};

// Find a single Message with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Message.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Message with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Message with id=" + id });
    });
};

// Update a Message by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Message.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Message with id=${id}. Maybe Message was not found!`
        });
      } else res.send({ message: "Message was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Message with id=" + id
      });
    });
};

// Delete a Message with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Message.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Message with id=${id}. Maybe Message was not found!`
        });
      } else {
        res.send({
          message: "Message was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Message with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Message.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all message."
      });
    });
};

// Find all published Tutorials
exports.findByChannelId = (req, res) => {
  Message.find({ channelId: req.params.channelId })
    .then(async data => {
      for (let item of data) {
        let user = await User.findById(item.userId)
        item.avatar = user.avatar
      }
      console.log('data', data)
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving message."
      });
    });

};

