const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const {
  handleChat,
  handleSimplify,
  handleDescribeImage,
  handleAccessibilityWorkflow,
} = require('../controllers/aiController');

// POST /api/ai/chat - Voice assistant conversation
router.post('/chat', handleChat);

// POST /api/ai/simplify - Text simplification
router.post('/simplify', handleSimplify);

// POST /api/ai/describe-image - Image understanding (multipart/form-data)
router.post('/describe-image', upload.single('image'), handleDescribeImage);

// POST /api/ai/accessibility-workflow - One-Click Accessibility Mode
router.post('/accessibility-workflow', upload.single('image'), handleAccessibilityWorkflow);

module.exports = router;
