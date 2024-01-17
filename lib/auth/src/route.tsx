import { Bindings } from '@quantic/lib'
import { Context, Hono, Next } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { logger } from 'hono/logger'
import { genJwt } from './middleware/jwt'

const endpoints = {
  root: '/auth',
  login: {
    root: '/auth/login',
    basic: '/auth/login/basic',
    oauth: '/auth/login/oauth',
  },
  jwt: {
    root: '/auth/jwt',
    sign: '/auth/jwt/sign',
    verify: '/auth/jwt/verify',
    decode: '/auth/jwt/decode',
  },
  basic: '/auth/basic',
  oauth: '/auth/oauth',
  otp: {
    root: '/auth/otp',
    send: '/auth/otp/send',
  },
  success: '/auth/success',
}

const app = new Hono<{ Bindings: Bindings }>()

app
  .use(logger())

  .use(cors())

  // .use('/*', async (c: Context<{ Bindings: Bindings }>, next: Next) =>
  //   jwt({ secret: c.env.SECRET_KEY })(c, next),
  // )

  .get(endpoints.root, async (c) => {
    return c.text('Hello Hono!')
  })

  // .post(endpoints.otp.root, (c) => {
  //   const { email } = c.req.parseBody()
  //   const otp = genOTP()

  //   const mailOptions = {
  //     from: 'your-email@example.com',
  //     to: email,
  //     subject: 'Your OTP',
  //     html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  //   }

  //   const transporter = nodemailer.createTransport({
  //     SES: ses,
  //   })

  //   transporter.sendMail(mailOptions, (err, info) => {
  //     if (err) {
  //       console.error(err)
  //       res.status(500).send('Error sending OTP')
  //     } else {
  //       console.log('Email sent: ' + info.response)
  //       res.send('OTP sent successfully')
  //     }
  //   })
  // })

  .get(`${endpoints.jwt.root}/:userId`, (c) => {
    // payloadの取得
    const userId = c.req.param('userId')
    const { result } = c.env.D1DB.prepare(`SELECT * FROM users where userId = ${userId}`).all()
    const payload = {
      userId: result.userId,
      name: result.name,
      email: result.email,
    }

    const secret = c.env.SECRET_KEY
    // jwtの生成
    // ここでjwtを生成して、それを返す
    // トークンの生成

    const token = genJwt(payload, secret)

    c.status(200)
    c.json({ token })
    return c.text('/auth/jwt')
  })

  .post(endpoints.jwt.sign, async (c) => {
    // email検証後ここに来る
    // userIdでjwtを生成
    const { userId } = await c.req.parseBody()

    // TODO: このライブラリはnode上では動かしづらい
    // viteはNode前提
    const jwtToken = await jwt.sign(
      {
        name: userId,
        nbf: Math.floor(Date.now() / 1000) + 60 * 60,
        exp: Math.floor(Date.now() / 1000) + 2 * (60 * 60),
      },
      'secret',
    )
    c.status(200)
    return c.text('')
  })

  .get(endpoints.jwt.verify, async (c) => {
    // const isValid = await jwt.verify(c.req.header('token'), 'secret')
    // return !isValid ? c.json('', 200) : c.json('', 401)
  })

  .get(endpoints.jwt.decode, (c) => {
    // const { payload } = jwt.decode(c.req.header('token'))
    // // userのデータを返したり
  })

const authHonoApp = {
  endpoint: endpoints.root,
  app: app,
}

export { authHonoApp }
