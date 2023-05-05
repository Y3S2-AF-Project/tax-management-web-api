import jwt from 'jsonwebtoken'

export const sendTokenResponse = async (res, user, message) => {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  res.status(200).json({
    data: { user, access_token: accessToken, refresh_token: refreshToken },
    message
  })
}

export const sendRefreshTokenResponse = async (token) => {
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
  const refreshToken = generateRefreshToken(user)
  res.status(200).json({
    data: { user, access_token: accessToken, refresh_token: refreshToken },
    message
  })
}

export const generateAccessToken = (user) => {
  return jwt.sign({ data: user }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRE}d`
  })
}

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
}

export const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET)
}

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET)
}
