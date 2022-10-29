const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve("./models/ontacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const parsedData = JSON.parse(data);
  const [contactById] = parsedData.filter((item) => item.id === contactId);
  return contactById;
};

const removeContact = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const parsedData = JSON.parse(data);
  const removeData = parsedData.filter((item) => item.id !== contactId);
  if (removeData.length === parsedData.length) {
    return false;
  }
  fs.writeFile(contactsPath, JSON.stringify(removeData));
  return true;
};

const addContact = async (name, email, phone) => {
  const data = await fs.readFite(contactsPath, "utf8");
  const parsedData = JSON.parse(data);
  const newContact = { name, email, phone, id: String(Date.now()) };
  parsedData.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(parsedData));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const parsedData = JSON.parse(data);
  const contactIndex = parsedData.findindex((item) => item.id === contactId);
  const ContactById = parsedData[contactIndex];
  if (contactIndex === -1) {
    return;
  }
  Object.assign(parsedData[contactIndex], body);
  fs.writeFile(contactsPath, JSON.stringify(parsedData));
  return ContactById;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
