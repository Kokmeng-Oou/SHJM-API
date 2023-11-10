import transporter from '../config/emailConfig'
// async..await is not allowed in global scope, must use a wrapper

type message = {
  text?: string
  subject: string
  html: string
}

export default async function main(
  receivers: string,
  text: string,
  subject: string,
  html: string
) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.USER_MAIL, // sender address
    to: receivers, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  })

  console.log('Message sent: %s', info.messageId)
}
