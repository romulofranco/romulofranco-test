const { connection } = require('./conn');

const getUsersCollection = async () => {
  const conn = await connection();
  return conn.collection('users');
};

const findAll = async () => {
  const users = await getUsersCollection();
  return users.find().toArray();
};

const findByEmail = async (email) => {
  const users = await getUsersCollection();
  return users.findOne({ email });
};

const create = async (user) => {
  const users = await getUsersCollection();

  const { userId } = await users.insertOne(user);
  return { _id: userId, ...user };
};

module.exports = {
  findAll,
  findByEmail,
  create,
};
