const express = require("express");
const router = express.Router();
const guestServiceClass = require("../services/guest");
const guestService = new guestServiceClass();

router.get("/viewSchedule", guestService.getSchedule);

module.exports = router;
