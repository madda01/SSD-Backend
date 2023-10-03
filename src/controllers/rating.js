import asyncHandler from '../middleware/async'
import { makeResponse } from '../utils/response'
import {
  addReview,
  deleteReview,
  updateReviewService,
  getMyReviewsService,
  getAllReviewsService,
  getReviewService,
} from '../services/rating'

function sanitizeInput(input) {
  // Remove leading/trailing white spaces and escape HTML characters
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Function to handle adding a review
export const postReview = asyncHandler(async (req, res) => {
  // Call the addReview service with request body
  const result = await addReview(sanitizeInput(req.body))
  // If result is false, return an error response
  if (!result)
    return makeResponse({
      res,
      status: 400,
      message: 'Cannot add your review, please try again.',
    })
  if (result.status) return makeResponse({ res, ...result })
  console.log('controller', result)
  return makeResponse({ res, message: 'Review Added Successfully!' })
})

// Function to handle removing a review
export const removeReview = asyncHandler(async (req, res) => {
  console.log('req.body in remove review', req.params)
  // Call the deleteReview service with request params
  const result = await deleteReview(req.params)
  // If result is false, return an error response
  if (!result)
    return makeResponse({
      res,
      status: 400,
      message: 'Cannot delete your review, please try again.',
    })
  if (result.status) return makeResponse({ res, ...result })
  console.log('controller', result)
  return makeResponse({ res, message: 'Review Deleted Successfully!' })
})

// Function to handle updating a review
export const updateReview = asyncHandler(async (req, res) => {
  // Call the updateReview  service with request params
  const result = await updateReviewService(sanitizeInput(req.body))
  // If result is false, return an error response
  if (!result)
    return makeResponse({
      res,
      status: 400,
      message: 'Cannot edit your review, please try again.',
    })
  if (result.status) return makeResponse({ res, ...result })
  console.log('controller', result)
  return makeResponse({ res, message: 'Review Edited Successfully!' })
})

// Function to handle getting all reviews for a user
export const getMyReviews = asyncHandler(async (req, res) => {
  // Call the getMyReviews  service
  const result = await getMyReviewsService(req.params)
  // If result is false, return an error response
  if (!result)
    return makeResponse({
      res,
      status: 400,
      message: 'Cannot get your reviews, please try again.',
    })
  if (result.status) return makeResponse({ res, ...result })
  console.log('controller', result)
  return makeResponse({ res, message: 'Reviews Retrieved Successfully!' })
})

// Function to handle getting all reviews
export const getAllReviews = asyncHandler(async (req, res) => {
  // Call the getAllReviews  service
  const result = await getAllReviewsService()
  // If result is false, return an error response
  if (!result)
    return makeResponse({
      res,
      status: 400,
      message: 'Cannot get your reviews, please try again.',
    })
  if (result.status) return makeResponse({ res, ...result })
  console.log('controller', result)
  return makeResponse({ res, data: result, message: 'Reviews Retrieved Successfully!' })
})

// Function to handle getting a review
export const getReview = asyncHandler(async (req, res) => {
  // Call the getReview  service
  const result = await getReviewService(req.params)
  // If result is false, return an error response
  if (!result)
    return makeResponse({
      res,
      status: 400,
      message: 'Cannot get your review, please try again.',
    })
  if (result.status) return makeResponse({ res, ...result })
  console.log('controller', result)
  return makeResponse({ res, data: result, message: 'Review Retrieved Successfully!' })
})
