const express = require('express');
const router = express.Router();
const {
  validateRecord,
  insertRecord,
  getRecords,
  getRecordById,
  getStats
} = require('../controllers/recordController');

// Record management & validation endpoints
router.post('/validate', validateRecord);
router.post('/', insertRecord);
router.get('/', getRecords);
router.get('/stats', getStats);
router.get('/:id', getRecordById);

module.exports = router;
