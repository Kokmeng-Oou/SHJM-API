import sendEmail from './sendEmail'

type sendVerificationEmail = {
  name: string
  email: string
  verification: string
  origin: string
}

const sendVerificationEmail = async ({
  name,
  email,
  verification,
  origin,
}: sendVerificationEmail) => {
  const verifyEmail = `${origin}/user/verify-token?token=${verification}&email=${email}`

  const text = `<h4> Hello, ${name} </h4>`
  const subject = 'Please verify your account.'
  const body = `<p>please confirm your email by clicking on the following link : <a href="${verifyEmail}">Verify Email</a> </p> `
  return sendEmail(email, text, subject, `${text + body}`)
}

export default sendVerificationEmail
