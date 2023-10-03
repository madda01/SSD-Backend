import asyncHandler from '../middleware/async'
import { makeResponse } from '../utils/response'
import { sendTokenResponse } from '../utils/jwt'
import { authRegister, verifyUser, authLogin } from '../services/auth'

function sanitizeInput(input) {
  // Remove leading/trailing white spaces and escape HTML characters
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const register = asyncHandler(async (req, res) => {
  const result = await authRegister(sanitizeInput(req.body))
  if (!result) return makeResponse({ res, status: 500, message: 'Registration Failed' })
  if (result.status) return makeResponse({ res, ...result })
  return makeResponse({
    res,
    message: 'Registration Successfull. Please check your email to verify your account.',
  })
})

export const verify = asyncHandler(async (req, res) => {
  const result = await verifyUser(sanitizeInput(req.body))
  if (!result)
    return makeResponse({ res, status: 400, message: 'Verification failed, invalid user' })
  return makeResponse({ res, message: 'Verification Successful' })
})

export const login = asyncHandler(async (req, res) => {
  const user = await authLogin(sanitizeInput(req.body))
  if (!user)
    return makeResponse({ res, status: 401, message: 'Invalid email or password. Try again!' })
  if (!user.is_verified)
    return makeResponse({
      res,
      status: 401,
      message: 'Account not verified. Please check your email',
    })
  return sendTokenResponse(res, user, 'User logged in successfully')
})
