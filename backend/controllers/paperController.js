const paperModel = require("../models/paperModel");
const { validationResult } = require("express-validator");
const studentModel = require("../models/studentModel");
const { uploadOnCloudinary } = require("../utils/cloudinaryUtils");

exports.createPaper = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { subject, date_of_exam, studentEmail, total_marks } = req.body;

  try {
    const studentDetail = await studentModel.findOne({ email: studentEmail });

    if (!studentDetail) {
      return res.status(404).json({ message: "Student not found" });
    }

    const pdf = req.files?.answerSheet?.[0];

    if (!pdf) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const answerUploadResponse = await uploadOnCloudinary(pdf.path, "pdf", pdf.mimetype);

    const answerSheetUrl = answerUploadResponse.url;

    const newPaper = new paperModel({
      subject,
      date_of_exam,
      student: studentDetail._id,
      total_marks,
      answerSheet: answerSheetUrl,
    });

    await newPaper.save();
    studentDetail.papers.push(newPaper._id);
    await studentDetail.save();
    res.status(201).json({ message: "Paper created successfully", paper: newPaper });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.assignPaper = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { teacherEmail } = req.body;
  const { paperId } = req.params;

  try {
    const paper = await paperModel.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    paper.teacherEmail = teacherEmail;
    await paper.save();

    res.status(200).json({ message: "Paper assigned successfully", paper });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.checkPaper = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { marks } = req.body;
  const { paperId } = req.params;

  try {
    const paper = await paperModel.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    paper.marks = marks;
    await paper.save();

    res.status(200).json({ message: "Paper checked successfully", paper });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getStudentPapers = async (req, res) => {
  try {
    const studentPapers = await paperModel.find({ student: req.user.id });
    res.status(200).json({ papers: studentPapers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTeacherPapers = async (req, res) => {
  try {
    const teacherPapers = await paperModel.find({ teacherEmail: req.user.email });
    res.status(200).json({ papers: teacherPapers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
