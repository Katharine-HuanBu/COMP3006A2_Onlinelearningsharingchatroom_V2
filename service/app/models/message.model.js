module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      username: String,
      avatar: String,
      msg: String,
      channelId: String,
      file: String,
      createdDate: Date,
      userId: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Message = mongoose.model("message", schema);
  return Message;
};
