const Report = require("../models/report");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.newReport = async (req, res, next) => {
    const { date, disaster, area, affectedPersons,casualties } = req.body;
    console.log(req.body)
    const reportData = {
        date,
        disaster,
        area,
        affectedPersons,
        casualties
    };

    const createdReport = await Report.create(reportData);
    return res.json(createdReport);
  };

  exports.getReport = async (req, res, next) => {
    try {
        const reports = await Report.find()
            .populate('disaster') // Populate the 'disaster' field with data from the Disaster collection
            .populate('area'); // Populate the 'area' field with data from the Area collection

        res.status(200).json({
            success: true,
            reports,
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.updateReport = async (req, res, next) => {
    try {
     
      console.log(req.params.id);
      reports = await Report.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindandModify: false,
      });
  
      return res.status(200).json({
        success: true,
        reports,
      });
    } catch (error) {
      console.error("Error updating report:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  exports.getSingleReport = async (req, res, next) => {
    const report = await Report.findById(req.params.id);
  
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Disaster not found",
      });
    }
    res.status(200).json({
      success: true,
      report
    });
  };