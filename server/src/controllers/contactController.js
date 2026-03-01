import nodemailer from 'nodemailer';

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            res.status(400);
            throw new Error('Please provide name, email and message');
        }

        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: 'sagnikhit1@gmail.com', // Explicitly requested target email
            subject: `New Contact Request from ${name}`,
            text: `You have received a new message from your website contact form.

Name: ${name}
Email: ${email}
Message:
${message}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        // Log the actual error for debugging
        console.error('Nodemailer Error:', error);
        res.status(500);
        next(new Error('Email could not be sent. Please check your configuration.'));
    }
};
