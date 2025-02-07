const express = require("express");
const router = express.Router();
const adminServiceClass = require("../services/admin");
const adminService = new adminServiceClass();

router.get("/viewSchedule/", adminService.getGames);
router.delete("/deleteGame/:gameId", adminService.deleteGame);

module.exports = router;
