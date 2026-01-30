# Sistema de Detección de Caídas

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)

Un sistema integral de detección de caídas con alertas automáticas vía Telegram y email para cuidadores y familiares.

## Características

- **Detección de caídas en tiempo real**
- **Alertas automáticas vía Telegram**
- **Notificaciones por email**
- **Gestión de cuidadores**
- **Registro de alertas e incidentes**
- **Panel de administración seguro**
- **Simulación de dispositivos para testing**

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de datos**: MongoDB Atlas
- **Autenticación**: bcrypt
- **Notificaciones**: 
  - Telegram Bot API
  - Nodemailer
- **Frontend**: HTML, CSS, JavaScript vanilla

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/FxxMorgan/NodeFall.git
   cd NodeFall
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   # Base de datos
   MONGO_URI=tu_uri_de_mongodb_atlas
   
   # Telegram Bot
   TELEGRAM_BOT_TOKEN=tu_token_del_bot
   BOT_USERNAME=tu_username_del_bot
   
   # Email
   EMAIL_USER=tu_email@ejemplo.com
   EMAIL_PASSWORD=tu_contraseña_de_aplicación
   
   # API Keys
   MAPQUEST_API_KEY=tu_api_key_de_mapquest
   
   # Servidor
   PORT=3000
   NODE_ENV=development
   ```

4. **Inicia el servidor**
   ```bash
   npm start
   ```

## Configuración

### Base de Datos
- Configura una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
- Crea un cluster y obtén la URI de conexión
- Agrega la URI a tu archivo `.env`

### Bot de Telegram
1. Crea un bot con [@BotFather](https://t.me/botfather)
2. Obtén el token del bot
3. Configura el token en el archivo `.env`

### Email
- Usa Gmail con contraseña de aplicación
- O configura otro proveedor SMTP

## Uso

### Registro de Cuidadores
1. Accede a `/register.html`
2. Completa el formulario de registro
3. Proporciona tu username de Telegram para recibir alertas

### Panel de Administración
1. Accede a `/admin-login.html`
2. Usa las credenciales de administrador
3. Gestiona cuidadores y revisa alertas

### Simulación de Dispositivos
- Utiliza `mock-device.js` para simular eventos de caída
- Ejecuta pruebas automatizadas con el endpoint `/test`

## Endpoints API

### Cuidadores
- `POST /caregivers/register` - Registrar nuevo cuidador
- `GET /caregivers` - Listar cuidadores
- `DELETE /caregivers/:id` - Eliminar cuidador

### Alertas
- `POST /alerts` - Crear nueva alerta
- `GET /alerts` - Obtener alertas
- `GET /alerts/recent` - Alertas recientes

### Administración
- `POST /admin/login` - Login de administrador
- `GET /admin/caregivers` - Gestión de cuidadores

## Testing

Ejecuta las pruebas automatizadas:
```bash
node test.js
```

O usa el simulador de dispositivos:
```bash
node mock-device.js
```

## Estructura del Proyecto

```
detection/
├── models/              # Modelos de datos (MongoDB)
│   ├── Alert.js
│   └── Caregiver.js
├── routes/              # Rutas de la API
│   ├── admin.js
│   ├── alerts.js
│   ├── caregivers.js
│   └── test.js
├── utils/               # Utilidades
│   ├── email.js
│   └── telegramHelper.js
├── public/              # Archivos estáticos
│   ├── admin-login.html
│   ├── admin.html
│   ├── index.html
│   └── register.html
├── server.js            # Servidor principal
├── cron.js             # Tareas programadas
└── mock-device.js      # Simulador de dispositivos
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia GNU General Public License v3.0 (GPL-3.0).

Esto significa que:
- Tienes la libertad de usar, estudiar, compartir y modificar el software
- Cualquier trabajo derivado debe ser distribuido bajo la misma licencia
- Debes proporcionar el código fuente cuando distribuyas el software
- No hay garantía sobre el software

[Ver licencia completa](LICENSE)

## Contacto

- **Desarrollador**: FxxMorgan
- **GitHub**: [@FxxMorgan](https://github.com/FxxMorgan)
- **Repositorio**: [NodeFall](https://github.com/FxxMorgan/NodeFall)

## Reconocimientos

- MongoDB Atlas por la base de datos
- Telegram Bot API por las notificaciones
- La comunidad de Node.js por las herramientas

---

Si este proyecto te ha sido útil, ¡dale una estrella!
