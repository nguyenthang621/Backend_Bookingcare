const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailService = async (data, redirectLink) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Booking care 👻" ', // sender address
        to: data.email, // list of receivers
        subject:
            data.language === 'vi'
                ? 'Xác nhận thông tin dặt lịch khám bệnh'
                : 'Confirm medical appointment booking information', // Subject line
        html: changLanguageEmail(data, data.language, redirectLink),
    });
};

const changLanguageEmail = (data, language, redirectLink) => {
    let result = '';
    if (language === 'vi') {
        result = `
        <h2>Xin chào ${data.namePatient}</h2>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Bookingcare2</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${data.exactTime}</b></div>
        <div><b>Bác sĩ: ${data.nameDoctor}</b></div>
        <p>Nếu thông tin trên chính xác, vui lòng kích vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div><a href=${redirectLink} target="_blank">Click here</a></div>
        <div>Xin chân thành cảm ơn</div>
    `;
    }
    if (language === 'en') {
        result = `
        <h2>Dear ${data.namePatient}</h2>
        <p>You received this email because you booked an online medical appointment on Bookingcare2</p>
        <p>Information to book an appointment:</p>
        <div><b>Time: ${data.exactTime}</b></div>
        <div><b>Doctor: ${data.nameDoctor}</b></div>
        <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
        <div><a href=${redirectLink} target="_blank">Click here</a></div>
        <div>Thank you very much</div>
    `;
    }
    return result;
};

module.exports = {
    sendEmailService,
};
