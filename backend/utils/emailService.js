const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - PM Internship Scheme',
    html: `
      <h2>Email Verification</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you didn't create an account with us, please ignore this email.</p>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send application status update
const sendApplicationStatusEmail = async (email, studentName, internshipTitle, status) => {
  const statusMessages = {
    applied: 'received',
    shortlisted: 'shortlisted for',
    rejected: 'not selected for',
    selected: 'selected for',
    withdrawn: 'withdrawn from'
  };
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Application Update: ${internshipTitle}`,
    html: `
      <h2>Application Status Update</h2>
      <p>Dear ${studentName},</p>
      <p>Your application for <strong>${internshipTitle}</strong> has been <strong>${status}</strong>.</p>
      <p>Login to your dashboard for more details.</p>
      <br>
      <p>Best regards,<br>PM Internship Scheme Team</p>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - PM Internship Scheme',
    html: `
      <h2>Password Reset</h2>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendApplicationStatusEmail,
  sendPasswordResetEmail
};