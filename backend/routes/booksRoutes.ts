import express from "express";

const router = express.Router();

router.get("/books", (req, res) => {
    res.send("hello - books")
})

export default router; 