const express = require("express");
const router = express.Router();
const generationHacahge = require("../controllers/generationHachage");

router.post("/", generationHacahge.hachage);

module.exports = router;