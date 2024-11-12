const express = require("express");

const sgMail = require("@sendgrid/mail");

require("dotenv").config();

const port = process.env.PORT || 3000;

const sendGridApiKey = process.env.SENDGRID_API_KEY;

const senderEmail = process.env.SECRET_EMAIL;

const app = express();

app.use(express.json());

app.post("/email", async (req, res, next) => {
  const { destination, subject, text } = req.body;

  if (!destination || !subject || !text) {
    return res.status(404).send("All fields must be completed....!");
  }

  try {
    sgMail.setApiKey(sendGridApiKey);
    const msg = {
      to: destination,
      from: senderEmail, // Use the email address or domain you verified above
      subject: subject,
      text: text,
      //   html: `<strong>${text}</strong>`,
    };

    await sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent !");
        res.status(200).send("Email sent !");
      })
      .catch((error) => {
        console.error(error);
        res.status(200).send("Error...! Email not sent !");
      });
  } catch (error) {
    res.status(200).send("Error...! Email not sent !");
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
