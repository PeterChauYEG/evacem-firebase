// based on google's script
/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

// Your organization name to include in the emails
const APP_NAME = 'Edmonton Vietnamese Alliance Church English Ministries';

// [START sendConfirmationEmail]
/**
 * Sends a confirmation email to a new registratant.
 */
// [START onCreateTrigger]
exports.sendConfirmationEmail = functions.database.ref('/registrations/{name}').onCreate(event => {
// [END onCreateTrigger]
  // [START eventAttributes]
  const registration = event.data.val(); // The Firebase registration.

  const email = registration.email; // The email of the user.
  const firstName = registration.firstName; // The first name of the user.
  const lastName = registration.lastName; // The last name of the user.
  // [END eventAttributes]

  sendDataEmail(registration)
  return sendConfirmationEmail(email, firstName, lastName);
});
// [END sendConfirmationEmail]

// Sends a confirmation email to the given registrant.
function sendConfirmationEmail(email, firstName, lastName) {
  const mailOptions = {
    from: `${APP_NAME} <webmaster.evacem@gmail.com>`,
    to: email
  };

  // send the email
  mailOptions.subject = `Winter Camp 2018 Registration Confirmation`;
  mailOptions.text = `Hey ${firstName || ''} ${lastName || ''}! Thanks for registering for Winter Camp.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New confirmation email sent to:', email);
  });
}

// Sends an email to the evacem team with registration data
function sendDataEmail(registration) {
  const mailOptions = {
    from: `${APP_NAME} <webmaster.evacem@gmail.com>`,
    to: 'general@evacem.com'
  };

  // send the email
  mailOptions.subject = `New Winter Camp 2018 Registration`;
  mailOptions.text = JSON.stringify(registration);
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New registration data email sent');
  });
}
