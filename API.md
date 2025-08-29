# Documentación de la API

## Descripción General

La API del Sistema de Detección de Caídas proporciona endpoints RESTful para gestionar cuidadores, alertas y administración del sistema.

**Base URL**: `http://localhost:3000`

## Autenticación

Actualmente, la API no requiere autenticación para la mayoría de endpoints. El panel de administración utiliza autenticación básica.

## Endpoints

### Cuidadores

#### Registrar Cuidador
```http
POST /caregivers/register
```

**Body Parameters**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "telegramUsername": "string",
  "relationship": "string"
}
```

**Response** (201):
```json
{
  "message": "Caregiver registered successfully",
  "caregiver": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "telegramUsername": "string",
    "relationship": "string",
    "createdAt": "datetime"
  }
}
```

#### Obtener Cuidadores
```http
GET /caregivers
```

**Response** (200):
```json
{
  "caregivers": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "telegramUsername": "string",
      "relationship": "string",
      "createdAt": "datetime"
    }
  ]
}
```

#### Eliminar Cuidador
```http
DELETE /caregivers/:id
```

**Response** (200):
```json
{
  "message": "Caregiver deleted successfully"
}
```

### Alertas

#### Crear Alerta
```http
POST /alerts
```

**Body Parameters**:
```json
{
  "type": "fall",
  "severity": "high|medium|low",
  "location": "string",
  "deviceId": "string",
  "timestamp": "datetime",
  "metadata": {
    "coordinates": {
      "lat": "number",
      "lng": "number"
    },
    "sensorData": "object"
  }
}
```

**Response** (201):
```json
{
  "message": "Alert created and notifications sent",
  "alert": {
    "id": "string",
    "type": "fall",
    "severity": "high",
    "location": "string",
    "deviceId": "string",
    "timestamp": "datetime",
    "status": "active",
    "notificationsSent": "number",
    "createdAt": "datetime"
  }
}
```

#### Obtener Alertas
```http
GET /alerts
```

**Query Parameters**:
- `limit` (opcional): Número máximo de alertas a retornar
- `status` (opcional): Filtrar por estado (active, resolved, dismissed)
- `severity` (opcional): Filtrar por severidad (high, medium, low)

**Response** (200):
```json
{
  "alerts": [
    {
      "id": "string",
      "type": "fall",
      "severity": "high",
      "location": "string",
      "deviceId": "string",
      "timestamp": "datetime",
      "status": "active",
      "createdAt": "datetime"
    }
  ],
  "total": "number"
}
```

#### Obtener Alertas Recientes
```http
GET /alerts/recent
```

**Response** (200):
```json
{
  "alerts": [
    {
      "id": "string",
      "type": "fall",
      "severity": "high",
      "location": "string",
      "timestamp": "datetime",
      "status": "active"
    }
  ]
}
```

#### Actualizar Estado de Alerta
```http
PATCH /alerts/:id
```

**Body Parameters**:
```json
{
  "status": "resolved|dismissed",
  "notes": "string"
}
```

**Response** (200):
```json
{
  "message": "Alert updated successfully",
  "alert": {
    "id": "string",
    "status": "resolved",
    "updatedAt": "datetime"
  }
}
```

### Administración

#### Login de Administrador
```http
POST /admin/login
```

**Body Parameters**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "token": "string"
}
```

#### Obtener Estadísticas
```http
GET /admin/stats
```

**Response** (200):
```json
{
  "stats": {
    "totalCaregivers": "number",
    "totalAlerts": "number",
    "activeAlerts": "number",
    "alertsToday": "number",
    "averageResponseTime": "number"
  }
}
```

#### Gestionar Cuidadores (Admin)
```http
GET /admin/caregivers
```

**Response** (200):
```json
{
  "caregivers": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "telegramUsername": "string",
      "relationship": "string",
      "isActive": "boolean",
      "lastNotification": "datetime",
      "createdAt": "datetime"
    }
  ]
}
```

### Testing

#### Simular Caída
```http
POST /test/simulate-fall
```

**Body Parameters**:
```json
{
  "deviceId": "string",
  "location": "string",
  "severity": "high|medium|low"
}
```

**Response** (200):
```json
{
  "message": "Fall simulation completed",
  "alertId": "string",
  "notificationsSent": "number"
}
```

#### Test de Conectividad
```http
GET /test/health
```

**Response** (200):
```json
{
  "status": "healthy",
  "timestamp": "datetime",
  "services": {
    "database": "connected",
    "telegram": "connected",
    "email": "connected"
  }
}
```

## Códigos de Estado HTTP

- `200` - OK: La solicitud fue exitosa
- `201` - Created: El recurso fue creado exitosamente
- `400` - Bad Request: La solicitud contiene datos inválidos
- `401` - Unauthorized: Se requiere autenticación
- `403` - Forbidden: No tiene permisos para acceder al recurso
- `404` - Not Found: El recurso no fue encontrado
- `500` - Internal Server Error: Error interno del servidor

## Ejemplos de Uso

### Registrar un nuevo cuidador
```bash
curl -X POST http://localhost:3000/caregivers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+56912345678",
    "telegramUsername": "juanperez",
    "relationship": "hijo"
  }'
```

### Crear una alerta de caída
```bash
curl -X POST http://localhost:3000/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "type": "fall",
    "severity": "high",
    "location": "Dormitorio principal",
    "deviceId": "sensor_001",
    "timestamp": "2025-08-29T10:30:00Z"
  }'
```

### Obtener alertas recientes
```bash
curl http://localhost:3000/alerts/recent
```

## Notificaciones

El sistema envía notificaciones automáticamente cuando se crea una nueva alerta:

1. **Telegram**: Mensaje instantáneo a todos los cuidadores registrados
2. **Email**: Correo electrónico con detalles de la alerta
3. **Logs**: Registro en el sistema para auditoría

## Rate Limiting

Actualmente no hay límites de tasa implementados. Se recomienda implementar rate limiting en producción.

## Versionado

La API sigue el versionado semántico. Los cambios que rompan la compatibilidad incrementarán la versión mayor.
