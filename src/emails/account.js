const sgMail = require("@sendgrid/mail");
const sender = "ng_other@protonmail.com";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(name, email) {
  return sgMail.send({
    to: email,
    from: sender,
    subject: "Welcome to the Task Manager App!",
    text: `Good day ${name}!\nI am happy to welcome you to the Task Manager App.\nWith this app you can maintain all your tasks and mark them completed or incomplete whenever you wish.\nPlease let me know how do you feel about the app.\n\nThanks and Regards\nAdmin @ Task Manager`,
  });
}
function sendCancelEmail(name, email) {
  return sgMail.send({
    to: email,
    from: sender,
    subject: "We are very sad to see you go :(",
    text: `Hi ${name},\nWe at Task Manager are very sad to see you go.\nPlease let us know your feedback about the app so that we can keep on improving.\nHope to see you again soon!\n\nRegards\nAdmin @ Task Manager`,
  });
}

exports.module = { sendWelcomeEmail, sendCancelEmail };
