/**
 * jwt.ts
 * @packageDocumentation
 * @module @hono/jwt
 *
 * this file is for generating jwt token
 *
 */
import { Hono } from 'hono'
import { decode, jwt, sign, verify } from 'hono/jwt'
import { describe, expect, test } from 'vitest'

/**
 * jwt generate function
 */
const genJwt = async (payload) => {
  const mySecretKey = process.env.JWT_SECRET_KEY
  if (!mySecretKey) {
    throw new Error('JWT_SECRET_KEY is not defined')
  }
  return await sign(payload, mySecretKey)
}

export { genJwt }
