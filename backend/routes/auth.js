const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");


router.post("/inscription", authController.FuncInscription);
router.post('/login',authController.FuncLogin);
router.post('/logout',authController.FuncLogout);
router.post('/reinitialisation',authController.FuncChange);


module.exports = router;