import asyncHandler from '../middleware/async'
import { makeResponse } from '../utils/response'
import { addInterests, updateUser, getUser, deleteOne } from '../services/user'

function sanitizeInput(input) {
  // Remove leading/trailing white spaces and escape HTML characters
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const pickInterests = asyncHandler(async (req, res) => {
  //req.user wont work
  const result = await addInterests(req.user.email, sanitizeInput(req.body.interests))
  if (!result)
    return makeResponse({
      res,
      status: 400,
      message: 'Cannot add your interests, please try again.',
    })
  if (result.status) return makeResponse({ res, ...result })
  return makeResponse({ res, message: 'Interests Added Successfully!' })
})

export const editUser = asyncHandler(async (req, res) => {
  const result = await updateUser(req.body.email, sanitizeInput(req.body))
  if (!result)
    return makeResponse({
      res,
      status: 400,
      message: 'Cannot update your profile, please try again.',
    })
  if (result.status) return makeResponse({ res, ...result })
  return makeResponse({ res, message: 'Profile Updated Successfully!' })
})

export const getOneUser = asyncHandler(async (req, res) => {
  const result = await getUser(req.body.email)
  if (!result)
    return makeResponse({
      res,
      status: 400,
      message: 'Cannot get your profile, please try again.',
    })
  if (result.status) return makeResponse({ res, ...result })
  return makeResponse({ res, message: 'Profile Gotten Successfully!', data: result })
})
export const deleteUser = asyncHandler(async (req, res) => {
  const result = await deleteOne(req.body.email)
  if (!result)
    return makeResponse({
      res,
      status: 400,
      message: 'Cannot delete your profile, please try again.',
    })
  return makeResponse({ res, message: 'Profile Deleted Successfully!' })
})
