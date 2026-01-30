// utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'hotmail', // Esto funciona mejor para Office 365
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendEmail(to, subject, message, deviceId, coordinates, mapUrl) {
    // Si no se pasan parámetros adicionales, extraer del mensaje (compatibilidad)
    if (!deviceId || !coordinates || !mapUrl) {
        const lines = message.split('\n');
        deviceId = lines.find(line => line.includes('Device ID'))?.split(': ')[1] || 'N/A';
        coordinates = lines.find(line => line.includes('Coordenadas'))?.split(': ')[1] || 'N/A';
        const time = lines.find(line => line.includes('Hora'))?.split(': ')[1] || 'N/A';
        mapUrl = lines.find(line => line.includes('https://'))?.trim() || '#';
    }
    
    const time = new Date().toLocaleString();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #ff4444, #cc0000); color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
                        🚨 ALERTA DE EMERGENCIA
                    </h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                        Caída detectada - Acción inmediata requerida
                    </p>
                </div>

                <!-- Content -->
                <div style="padding: 30px;">
                    
                    <!-- Alert Info -->
                    <div style="background-color: #fff8dc; border-left: 4px solid #ffa500; padding: 20px; margin-bottom: 25px; border-radius: 5px;">
                        <h3 style="margin: 0 0 15px 0; color: #cc0000; font-size: 18px;">
                            📍 Detalles del Incidente
                        </h3>
                        
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #333;">🔹 Dispositivo:</strong>
                            <span style="background-color: #e8f4fd; padding: 4px 8px; border-radius: 4px; margin-left: 10px; font-family: monospace;">
                                ${deviceId}
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #333;">🔹 Coordenadas:</strong>
                            <span style="background-color: #e8f4fd; padding: 4px 8px; border-radius: 4px; margin-left: 10px; font-family: monospace;">
                                ${coordinates}
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 0;">
                            <strong style="color: #333;">🔹 Hora del incidente:</strong>
                            <span style="background-color: #e8f4fd; padding: 4px 8px; border-radius: 4px; margin-left: 10px;">
                                ${time}
                            </span>
                        </div>
                    </div>

                    <!-- Map Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${mapUrl}" 
                           style="display: inline-block; background: linear-gradient(135deg, #4285f4, #1a73e8); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 3px 10px rgba(66, 133, 244, 0.3); transition: all 0.3s ease;">
                            🗺️ VER UBICACIÓN EN MAPA
                        </a>
                    </div>

                    <!-- Instructions -->
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                        <h4 style="margin: 0 0 10px 0; color: #dc3545;">⚠️ Instrucciones de Emergencia:</h4>
                        <ul style="margin: 0; padding-left: 20px; color: #495057;">
                            <li style="margin-bottom: 5px;">Dirígete inmediatamente a la ubicación</li>
                            <li style="margin-bottom: 5px;">Verifica el estado de la persona</li>
                            <li style="margin-bottom: 5px;">Contacta servicios de emergencia si es necesario</li>
                            <li>Mantén la calma y actúa con rapidez</li>
                        </ul>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #6c757d; font-size: 12px;">
                        🤖 Este es un mensaje automatizado del Sistema de Detección de Caídas<br>
                        Generado el ${new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </body>
        </html>
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