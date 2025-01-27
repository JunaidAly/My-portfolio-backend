const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;
const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Contact Form API
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // SMTP Transporter Setup
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use "SendGrid", "Outlook", etc., for production
    auth: {
      user: process.env.SMTP_EMAIL, // Your email
      pass: process.env.SMTP_PASSWORD, // App password (if using Gmail 2FA)
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: process.env.ADMIN_EMAIL, // Your admin email
    subject: "New Contact Form Submission",
    text: `You have a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ success: false, message: "Email sending failed!" });
  }
});

// User routes
app.use("/api", userRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
