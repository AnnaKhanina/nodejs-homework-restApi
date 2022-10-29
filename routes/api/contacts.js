const express = require("express");
const {
  listContacts,
  addContact,
  updateContact,
  removeContact,
  getContactById,
} = require("../../models/contacts.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ message: "success", code: 200, contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({ message: "contact not found" });
      return;
    }
    res.status(200).json({ message: "success", contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", addContactValidation, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      res.status(400).json({ message: "missing required name field" });
      return;
    }
    const contact = await addContact({ name, email, phone });
    res.status(201).json({ message: "contact added", contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const isContactRemoved = await removeContact(contactId);
    if (!isContactRemoved) {
      res.status(404).json({ message: "contact not found" });
      return;
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:contactId", putContactValidation, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "missing field" });
      return;
    }

    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) {
      res.status(400).json({ message: "contact not found" });
      return;
    }
    res.status(200).json({ message: "success", contact: updatedContact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
