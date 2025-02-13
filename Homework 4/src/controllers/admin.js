const express = require("express");
const router = express.Router();
const AdminServiceClass = require("../services/admin");
const adminService = new AdminServiceClass();

router.get("/viewSchedule/", adminService.getGames);

router.get("/addGame", adminService.getAddPage);
router.post("/addGame", adminService.addGame);

router.get("/editGame", adminService.getEditingPage);
router.patch("/editGame", adminService.editGame);

router.delete("/deleteGame/:gameId", adminService.deleteGame);

module.exports = router;
