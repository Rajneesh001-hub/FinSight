const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  importTransactions,
  exportTransactions
} = require('../controllers/importController');

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

router.post('/import', upload.single('file'), importTransactions);
router.get('/export', exportTransactions);

module.exports = router;
