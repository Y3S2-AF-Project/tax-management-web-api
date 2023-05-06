import mailgen from 'mailgen'
import 'dotenv/config'
import logger from '../utils/logger'
import nodemailer from 'nodemailer'

const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendGeneratedPassord = async (adminObj, autoGeneratedPassword) => {
  const MailGenerator = new mailgen({
    theme: 'cerberus',
    product: {
      name: 'Tax Management System',
      link: 'http://localhost:3000/',
      logo: 'https://drive.google.com/file/d/1L5LeUn4dhoYdNIJLoY5uHnPFONAXcvwF/view'
    }
  })

  const email = {
    body: {
      name: `${adminObj.firstName} ${adminObj.lastName}`,
      intro: `You have been added as an ${adminObj.role} to the Tax Management System. We have generated a temporary password for you to access your admin profile.`,
      action: {
        instructions: `Your temporary password is:<br><h1>${autoGeneratedPassword}</h1>`,
        button: {
          color: '#22BC66',
          text: 'Go to Admin Dashboard',
          link: 'http://localhost:3000/admin/login/'
        }
      },
      outro: 'To ensure security, we advise you to change your password when you first log in. If you have any queries or concerns, please feel free to contact our support team.'
    }
  }

  //convert mailgen body into HTML
  const mail = MailGenerator.generate(email)

  //nodemailer sending credentials
  const details = {
    from: process.env.EMAIL_USER,
    to: `${adminObj.email}`,
    subject: `You are registered in to the Tax Management System`,
    html: mail
  }

  //send mail through nodemailer
  await mailTransporter
    .sendMail(details)
    .then(() => {
      logger.info(`Email sent to ${adminObj.email}`)
    })
    .catch((error) => {
      logger.error(`An error occurred when sending email - err: ${error.message}`)
    })
}

const AdminEmailService = {
  sendGeneratedPassord
}

export default AdminEmailService