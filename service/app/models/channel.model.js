module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      createdBy: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Channel = mongoose.model("channel", schema);
  return Channel;
};
