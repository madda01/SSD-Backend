let Question = require('../models/question')
import mongoose from 'mongoose';
// const { addQuestionAnswer } = require('../services/question');
import { addQuestionAnswers, updateAnswers, deleteQuestionAnswers, getUserQuestion, getAllTheQuestion, deleteQuestions, getEveryQuestion, searchQuestions } from '../services/question'

function sanitizeInput(input) {
  // Remove leading/trailing white spaces and escape HTML characters
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Add a question or answer a question
export async function addQuestionAnswer(req, res) {
  let data = req.body;
  data.Answers = sanitizeInput(data.Answers);
  console.log(data.Answers)
  try{
      await addQuestionAnswers(data);
      res.status(200).send("Sequence commenced successfully!");
  }
  catch (e) {
      console.log(e);
      res.status(500).send("Internal server error");
  }
}


//update an Answer
export async function updateAnswer(req, res) {
  let data = req.body;
  try {
      const updatedQuestion = await updateAnswers(data);
  
      if (!updatedQuestion) {
          return res.status(404).json({ error: "No data found" });
      }
  
      return res.status(200).json(updatedQuestion);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    } 
}

// Delete an answer
export async function deleteAnswer(req, res) {
  try {
      const id = mongoose.Types.ObjectId(req.query.id);
      const answerId = mongoose.Types.ObjectId(req.query.answerId);
      const question = await deleteQuestionAnswers(id, answerId);

      if (!question || question.nModified === 0) {
          return res.status(404).json({ error: 'No matching question found or answer not found' });
      }

      return res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
  }
}

//delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const question = await deleteQuestions(req.query.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    return res.status(200).json(question);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// get group questions
export async function getAllQuestions(req, res) {
  try {
    const search = sanitizeInput(req.query.search);
    const questions = await getAllTheQuestion(search);
    res.status(200).json(questions);
  } catch (e) {
      console.log(e);
      res.status(500).send("Internal server error");
  }
}

//get questions of a single USER
export async function getSingleUserQuestions(req, res) {
  try {
    const userID = sanitizeInput(req.query.userID);
    const questions = await getUserQuestion(userID);
      res.status(200).json(questions);
  } catch (e) {
      console.log(e);
      res.status(500).send("Internal server error");
  }
}

//get all not used ATM
export async function getEveryQuestions(req, res){
  try {
      const questions = await getEveryQuestion();
      res.status(200).json(questions);
  } catch (e) {
      console.log(e);
      res.status(500).send("Internal server error");
  }
}

//Searching not used ATM
// export async function searchQuestion(req, res) {
//     try {
//       const questions = await Question.find({
//         Question: { $regex: new RegExp(req.query.question, 'i') }
//       });
//       if (questions.length === 0) {
//         return res.status(404).json({ message: 'Try different keywords' });
//       }
//       res.json(questions);
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).json({ message: 'Server error' });
//     }
// }

export async function searchQuestion(req, res){
  try {
    const question = sanitizeInput(req.query.question);
    const group = sanitizeInput(req.query.group);
    const questions = await searchQuestions(question, group);
      if (questions.length === 0) {
          return res.status(404).json({ message: 'Try different keywords' });
      }
      res.json(questions);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
  }
}



