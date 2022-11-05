const express = require('express');

const {
  addContactValidation,
  putContactValidation,
  patchContactFavoriteValidation,
} = require('../../validationMiddleware/joiSchema');

const { isValidId } = require('../../validationMiddleware/mongooseSchema');

const {
  listContactsController,
  getContactByIdController,
  addContactValidationController,
  removeContactController,
  updateContactController,
  updateStatusContactController,
} = require('../../controllers/contactsController');

const { tryCatchWrapper } = require('../../helpers/index');

const router = express.Router();

router.get(
  '/',
  tryCatchWrapper(listContactsController)
);

router.get(
  '/:contactId', 
  isValidId, 
  tryCatchWrapper(getContactByIdController)
);

router.post('/', 
addContactValidation, 
tryCatchWrapper(addContactValidationController)
);

router.delete(
  '/:contactId', 
  isValidId, 
  tryCatchWrapper(removeContactController)
);

router.put(
  '/:contactId', 
  isValidId, 
  putContactValidation, 
  tryCatchWrapper(updateContactController)
);

router.patch(
  '/:contactId/favorite',
  isValidId,
  patchContactFavoriteValidation,
  tryCatchWrapper(updateStatusContactController)
);

module.exports = router;
