const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("admin/index", {
        title: "Admin Index",
        layout: "layouts/admin"
    });
});

module.exports = router;
