const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send([{name: "C++"}, {name: "PHP"}]);
});

module.exports = router;
