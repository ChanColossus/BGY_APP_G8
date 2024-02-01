const Quiz = require('../models/quiz');
const Disaster = require("../models/disaster");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");
exports.newQuiz = async (req, res, next) => {
    const { qname, qtopic, disasterNames,question,answer} = req.body;
    console.log(req.body)
    console.log(disasterNames)
    console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
    try {

        let disasters;

        // Check if disasterNames is an array
        if (Array.isArray(disasterNames)) {
            console.log('Disaster Names Array:', disasterNames);

            // Fetch disasters based on the provided disasterNames
            disasters = await Disaster.find({ name: { $in: disasterNames } });

            console.log('Disasters Found:', disasters);

            // Check if all provided disasterNames correspond to valid disasters
            if (disasters.length !== disasterNames.length) {
                console.log('Invalid disasterNames:', disasterNames.filter(name => !disasters.some(disaster => disaster.name === name)));
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }
        } else {
            // If disasterNames is not an array, handle it as a single disaster name
            console.log('Single Disaster Name:', disasterNames);

            const singleDisaster = await Disaster.findOne({ name: disasterNames });

            // Check if the single disaster name is valid
            if (!singleDisaster) {
                console.log('Invalid disasterName:', disasterNames);
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }

            disasters = [singleDisaster];
        }
        const QandA = [];

        for (let i = 0; i < question.length; i++) {
          QandA.push({ question: question[i], answer: answer[i] });
        }
        // Create the Tool with the associated disasters and uploaded images
        const quizData = {
            qname,
            qtopic,
            disasterProne: disasters.map((disaster) => ({
                name: disaster.name,
            })),
            QandA,
        };

        const createdQuiz = await Quiz.create(quizData);
        return res.json(createdQuiz);

    } catch (error) {
        console.error('Error creating quiz:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getQuiz = async (req, res, next) => {
    const resPerPage = 4;
    const quizCount = await Quiz.countDocuments();
    const apiFeatures = new APIFeatures(Quiz.find(), req.query)
        .search()
        .filter();

    apiFeatures.pagination(resPerPage);
    const quiz = await apiFeatures.query;
    let filteredQuizCount = quiz.length;
    res.status(200).json({
        success: true,
        filteredQuizCount,
        quizCount,
        quiz,
        resPerPage,
    });
};
exports.updateQuiz = async (req, res, next) => {
    const { quizId } = req.params;
    const { qname, qtopic, disasterNames, question, answer } = req.body;
  
    try {
      // Check if the quiz exists
      const existingQuiz = await Quiz.findById(quizId);
  
      if (!existingQuiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
  
      let disasters;
  
      // Check if disasterNames is an array
      if (Array.isArray(disasterNames)) {
        // Fetch disasters based on the provided disasterNames
        disasters = await Disaster.find({ name: { $in: disasterNames } });
  
        // Check if all provided disasterNames correspond to valid disasters
        if (disasters.length !== disasterNames.length) {
          return res.status(400).json({ error: 'Invalid disasterName provided' });
        }
      } else {
        // If disasterNames is not an array, handle it as a single disaster name
        const singleDisaster = await Disaster.findOne({ name: disasterNames });
  
        // Check if the single disaster name is valid
        if (!singleDisaster) {
          return res.status(400).json({ error: 'Invalid disasterName provided' });
        }
  
        disasters = [singleDisaster];
      }
  
      // Update the quiz with the associated disasters and QandA
      existingQuiz.qname = qname;
      existingQuiz.qtopic = qtopic;
      existingQuiz.disasterProne = disasters.map(disaster => ({
        name: disaster.name,
      }));
  
      // Clear existing QandA and add the updated values
      existingQuiz.QandA = [];
      for (let i = 0; i < question.length; i++) {
        existingQuiz.QandA.push({ question: question[i], answer: answer[i] });
      }
  
      // Save the updated quiz
      const updatedQuiz = await existingQuiz.save();
  
      return res.json(updatedQuiz);
    } catch (error) {
      console.error('Error updating quiz:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.deleteQuiz = async (req, res, next) => {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
    if (!quiz) {
        return res.status(404).json({
            success: false,
            message: "Quiz not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "Quiz deleted",
    });
};
