const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAll = (collectionName) => (
  connection()
    .then((db) => db.collection(collectionName).find().toArray())
    .then((response) => response)
    .catch((err) => err)
);

const insertOne = async (collectionName, item) => (
  connection()
    .then((db) => db.collection(collectionName).insertOne(item))
    .then((response) => ({ id: response.id, ...item }))
    .catch((err) => err)
);

const findByfield = (collectionName, field, item) => (
  connection()
    .then((db) => db.collection(collectionName).find({ [field]: item }).toArray())
    .then((res) => res)
    .catch((err) => err)
);

const updateOne = (collectionName, id, item) => (
  connection()
    .then((db) => db.collection(collectionName).updateOne({ _id: ObjectId(id) }, { $set: item }))
    .then(() => ({ _id: id, ...item }))
    .catch((err) => err)
);

const deleteOne = (collectionName, id) => (
  connection()
    .then((db) => db.collection(collectionName).deleteOne({ _id: ObjectId(id) }))
    .then((res) => res)
    .catch((err) => err)
);

const insertAdminUser = (collectionName, item) => (
  connection()
    .then((db) => db.collection(collectionName).insertOne(item))
    .then(() => (item))
    .catch((err) => err)
);

module.exports = {
  getAll,
  insertOne,
  findByfield,
  updateOne,
  deleteOne,
  insertAdminUser,
};
