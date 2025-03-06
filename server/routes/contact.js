
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
//sendgrid api key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//handles contact form submition
router.post('/', async (req, res) => {
  try {
    //get contact form data
    const { name, email, message } = req.body;
    //create email object 
    const msg = {
      to: 'clubemail@wcupa.edu', // email we want to get messages from
      from: 'no-reply@yourdomain.com', // email we send from
      subject: `Contact Form Message from ${name}`,
      text: `Message from ${name} (${email}):\n\n${message}`
    };
    //sends email using sendgrid
    await sgMail.send(msg);
    res.json({ message: "Message sent successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
