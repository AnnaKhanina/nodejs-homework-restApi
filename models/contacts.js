const { Contact } = require('../db/model');


const listContacts = async (owner, page, limit, favorite) => {
  console.log(favorite);
  const skip = (parseInt(page) - 1) * parseInt(limit);
    if (favorite) {
      const data = await Contact.find({ $and: [{ owner }, { favorite: JSON.parse(favorite) }] })
        .skip(skip)
        .limit(parseInt(limit));
      return data;
    } else {
      const data = await Contact.find({ owner }).skip(skip).limit(parseInt(limit));
      return data;
    }
  };

const getContactById = async (contactId, owner) => {
  const data = await Contact.find({ $and: [{ owner }, { _id: contactId }] });
  return data;
};

const removeContact = async (contactId, owner) => {
  const data = await Contact.findOneAndRemove({ $and: [{ owner }, { _id: contactId }] });
  return data;
};

const addContact = async ({ name, email, phone, favorite }, owner) => {
  const contact = new Contact({ name, email, phone, favorite, owner });
  const newContact = await contact.save();
  return newContact;
};

const updateContact = async (contactId, owner, body) => {
  await Contact.findOneAndUpdate( { $and: [{ owner }, { _id: contactId }] }, { $set: body }, { runValidators: true });
  const updatedContact = await Contact.find({ $and: [{ owner }, { _id: contactId }] });
  return updatedContact;
};

const updateStatusContact = async (contactId, owner, favorite) => {
  await Contact.findOneAndUpdate( { $and: [{ owner }, { _id: contactId }] },{ favorite }, { runValidators: true });
  const updatedContact = await Contact.find({ $and: [{ owner }, { _id: contactId }] });
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
