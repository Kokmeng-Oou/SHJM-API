import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  host: process.env.HOST_MAIL,
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.USER_MAIL,
    pass: process.env.PASSWORD_MAIL,
  },
})

export default transporter
