import nodeMailer from 'nodemailer';

const transporter = nodeMailer.createTransport({
    service:"Gmail",
    auth : {
        user:"yassinedebich214@gmail.com",
        pass:"yourpassword"
    },
});

export const sendEmail = async (email, activationCode) => {
    try{
        await transporter.sendMail({
            from:"yassinedebich214@gmail.com",
            to:email,
            subject:"Account activation",
            html :`
            `,
        })
    }catch(err){
        console.log(err)
    }
}