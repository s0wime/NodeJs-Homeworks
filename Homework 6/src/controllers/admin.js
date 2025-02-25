const express = require("express");
const router = express.Router();
const AdminServiceClass = require("../services/admin");
const adminService = new AdminServiceClass();

router.get("/games", adminService.getGames);

router.get("/games/add", adminService.getAddPage);
router.post("/games/add", adminService.addGame);

router.get("/games/:id/edit", adminService.getEditingPage);
router.patch("/games/:id/edit", adminService.editGame);

router.delete("/games/:id/delete", adminService.deleteGame);

module.exports = router;
