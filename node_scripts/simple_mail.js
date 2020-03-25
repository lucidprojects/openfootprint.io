/*
Simple receiver script to receive html form submisson and post to a node js receive script

uses:
nodemailer for sending email
bodyParser for parsing form data

requires nginx reverse proxy to node app location / router eg '/handle_form
add nginx config here /etc/nginx/sites-available/openfootprint.io  (desired domain)

example config allows for the form action to submit to http://openfootprint.io/handle_form:

	location /handle_form {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        }

*/



"use strict";
const nodemailer = require("nodemailer");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

var formName, formEmail, formMessage;
var msgSent = false;


app.post('/handle_form', (req, res) => {
//  res.send(`name: ${req.body.name}, email: ${req.body.email} message: ${req.body.message}.`);
   formName = req.body.name;
   formEmail = req.body.email;
   formMessage = req.body.message;
   main().catch(console.error);

  return res.redirect('http://openfootprint.io/contact-form-thank-you.html');	
});


// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, //587,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'openfootprint2020@gmail.com', // generated ethereal user
      pass: 'openf00t2021' // generated ethereal password
    }
 });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Open Footprint 👻" <openfootprint2020@gmail.com>', // sender address
    to: "jakesherwood@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?2", // plain text body
    html: "message from " + formName + " <br> email:" + formEmail + " <br>" + formMessage // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

}


app.listen(port, () => {
  console.log(formName);
  console.log(`Server running on port${port}`);
});
