module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      username: String,
      no: String,
      email: String,
      password: String,
      avatar: String,
      createdDate: Date
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
