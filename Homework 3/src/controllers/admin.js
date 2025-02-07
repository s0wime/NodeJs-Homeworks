const express = require("express");
const router = express.Router();
const adminServiceClass = require("../services/admin");
const adminService = new adminServiceClass();

router.get("/viewSchedule/", adminService.viewSchedule);

router.get("/add/", adminService.renderHelloWorld);
router.get("/remove/", adminService.renderHelloWorld);

router
  .route("/editGame/")
  .get(adminService.viewEditingPage)
  .post(adminService.editGame);

module.exports = router;
