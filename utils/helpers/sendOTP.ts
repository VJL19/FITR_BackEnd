import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const sendEmail = async ({
  email,
  code,
  subject,
  emailTitle,
  emailDescription,
  forgotPassword,
}: {
  email: string;
  code: number;
  subject: string;
  emailTitle: string;
  emailDescription: string;
  forgotPassword?: boolean;
}) => {
  const isForgotPasswordRequest = forgotPassword
    ? '<h1 style="text-transform: uppercase">Verify Your Account For Resetting Your Password</h1>'
    : '<h1 style="text-transform: uppercase">Thanks for Signing Up!</h1><h2>Please Verify Your Account</h2>';

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
      html: `<div>
      <div
        style="
          flex-direction: column;
          background-color: #ff2e00;
          height: auto;
          padding: 25px;
          color: #fff;
        "
      >
        ${isForgotPasswordRequest}
      </div>
      <h1>${emailTitle}</h1>
      <img src="cid:email_illustration" style="width: 400px; height: 400px" />
      <p style="font-size: 20px">
        ${emailDescription}
      </p>

      <div style="display: inline-block; width: 20%; background-color: #ff2e00">
        <p
          style="
            color: #fff;
            letter-spacing: 0.2rem;
            font-size: 35px;
            text-align: center;
          "
        >
          <b>${code}</b>
        </p>
      </div>
      <p style="font-size: 20px">
        Thanks, <br />
        The FITR Team
      </p>
      <br />
      <br />
      <div
        style="
          flex-direction: column;
          background-color: #ff552f;
          height: auto;
          padding: 25px;
          color: #fff;
        "
      >
        <h2 style="text-transform: uppercase">Contact Us</h2>
        <p>+63995 770 8858</p>
        <p>mjeshter.fg@yahoo.com</p>
      </div>
      <div
        style="
          height: 120px;
          background-color: #ff2e00;
          display: flex;
          padding-left: 25px;
          align-items: center;
          color: #fff;
          font-size: 22px;
        "
      >
        Copyright &copy; FITR Development. All Rights Reserved.
      </div>
    </div>`,
      attachments: [
        {
          filename: "email_illustration.jpg",
          path: "public/images/email_illustration.jpg",
          cid: "email_illustration",
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
