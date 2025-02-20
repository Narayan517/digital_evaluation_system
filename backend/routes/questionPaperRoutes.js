const express = require("express");
const { body } = require("express-validator");
const questionPaperController = require("../controllers/questionPaperController")

const router = express.Router();
router.post(
    "/",
    [
        body("subject").notEmpty().withMessage("Subject is required"),
        body("date_of_exam").isDate().withMessage("Valid date of exam is required"),
        body("total_marks").isInt({ min: 0 }).withMessage("Total marks must be a positive integer"),
    ],
    questionPaperController.createQuestionPaper
);

module.exports = router;
