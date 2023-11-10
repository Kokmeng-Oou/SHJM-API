import sendEmail from './sendEmail'

const sendResetPasswordEmail = async ({
  name,
  email,
  verification,
  origin,
}: any) => {
  const resetURL = `${origin}/user/reset-password?token=${verification}&email=${email}`
  const subject = 'Reset Password.'
  const text = `<h4> Hello, ${name} </h4>`
  const message = `
    <html>
      <head></head>
      <body style="font-family: Arial; font-size:14px;">
      <div style="margin:0 auto; width:65%; padding:20px">
      <h3 style="color:#78909c; text-align:center;">You have requested a password reset</h3
      ><p style="text-align:center;">Please click on the following link to reset your password.</p><a href="${resetURL}/
      ><br />
      <p style="text-align:left; color:#78909c;">Hello ${name}, </p><br />
      <p style="text-align:left; color:#78909c;">Someone (hopefully you!) has requested
      that the password be reset for your account. If this was indeed you, please click on the following link to set a new password.</p>
      </body>
    </html>
      `
  return sendEmail(email, text, subject, `${text + message}`)
}

export default sendResetPasswordEmail
