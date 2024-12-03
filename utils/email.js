// utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: true
    }
});

const MAPQUEST_API_KEY = process.env.MAPQUEST_API_KEY;

async function sendEmail(to, subject, text, latitude, longitude, address) {
    if (!MAPQUEST_API_KEY) {
        throw new Error('La clave API de MapQuest no está configurada');
    }

    const mapUrl = `https://www.mapquestapi.com/staticmap/v5/map?key=${MAPQUEST_API_KEY}&center=${latitude},${longitude}&size=600,300&zoom=15&locations=${latitude},${longitude}|marker-red&defaultMarker=marker-num`;
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff0000;">🚨 ¡Alerta de Caída Detectada!</h2>
            <p>${text}</p>
            ${address ? `<p><strong>Dirección:</strong> ${address}</p>` : ''}
            <p>
                <a href="${googleMapsLink}" 
                   style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Ver Ubicación en Google Maps
                </a>
            </p>
            <img src="${mapUrl}" alt="Mapa de Ubicación" style="max-width: 100%; height: auto; margin-top: 20px;">
            <p style="color: #666; font-size: 12px;">
                Esta es una alerta automatizada. Por favor, dirígete de inmediato hacia el usuario.
            </p>
        </div>
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado con éxito:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error(`Error al enviar el correo: ${error.message}`);
    }
}

module.exports = { sendEmail };