import nodemailer from "nodemailer";

const sendMail = async (to: String, content) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "boikojin888@gmail.com",
      pass: "inowjlkltsohtoiu",
    },
  });

  // Use the transporter to send emails
  try {
    const res = await transporter.sendMail({
      from: "boikojin888@gmail.com",
      to,
      subject: "Hello",
      html: content,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
