const express = require("express");
const router = express.Router();
const brainTreeController = require("../controller/braintree");
const { loginCheck } = require("../middleware/auth"); // Import loginCheck

router.post("/braintree/get-token", loginCheck, brainTreeController.ganerateToken);
router.post("/braintree/payment", loginCheck, brainTreeController.paymentProcess);

module.exports = router;
