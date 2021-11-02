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
    .then((db) => db.collection(collectionName)
      .insertOne({ ...item, create: new Date(), update: new Date() }))
    .then(() => ({ ...item, create: new Date(), update: new Date() }))
    .catch((err) => err)
);

const logIn = async (collectionName, { email, password }) => (
  connection()
    .then((db) => db.collection(collectionName).findOne({ email, password }))
    .then((res) => res)
    .catch((err) => err)
);

const findByfield = (collectionName, field, item) => (
  connection()
    .then((db) => db.collection(collectionName).find({ [field]: item }).toArray())
    .then((res) => res)
    .catch((err) => err)
);

const findId = (collectionName, id) => (
  connection()
    .then((db) => db.collection(collectionName).findOne(ObjectId(id)))
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
  logIn,
  findId,
  findByfield,
  updateOne,
  deleteOne,
  insertAdminUser,
};
