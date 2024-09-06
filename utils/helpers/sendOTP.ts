import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const sendEmail = async ({
  email,
  code,
  subject,
  emailTitle,
  emailDescription,
}: {
  email: string;
  code: number;
  subject: string;
  emailTitle: string;
  emailDescription: string;
}) => {
  return new Promise((resolve, reject) => {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: "gretaglatch@gmail.com",
        pass: "pycv hzys lshe fqru",
      },
    });

    const mailConfig: Mail.Options = {
      from: "FITR_mobile@gmail.com",
      to: email,
      subject: subject,
      html: `<div><h1>${emailTitle}</h1><p>${emailDescription}</p><p><b>${code}</b></p><img src = "cid:fitr_logo" style="width:400px;height:400px;"/></div>`,
      attachments: [
        {
          filename: "fitr_logo4.png",
          path: "public/images/fitr_logo4.png",
          cid: "fitr_logo",
        },
      ],
    };

    transporter.sendMail(mailConfig, (error, result) => {
      if (error) {
        console.log(error);
        return reject({ message: error });
      }
      resolve({ message: "Email is sent successfully!", result: result });
    });
  });
};

export default sendEmail;
