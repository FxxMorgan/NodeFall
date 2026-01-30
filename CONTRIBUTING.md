# Guía de Contribución

Gracias por tu interés en contribuir al Sistema de Detección de Caídas. Esta guía te ayudará a participar en el desarrollo del proyecto.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)

## Código de Conducta

Este proyecto adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables.

## Cómo Contribuir

### Reportar Bugs

Antes de crear un reporte de bug:
- Verifica que el bug no haya sido reportado anteriormente
- Asegúrate de estar usando la última versión
- Revisa la documentación para confirmar que es un bug

Cuando crees un reporte de bug, incluye:
- **Título claro y descriptivo**
- **Pasos para reproducir** el problema
- **Comportamiento esperado** vs **comportamiento actual**
- **Capturas de pantalla** si aplica
- **Información del entorno** (OS, Node.js version, etc.)

### Sugerir Mejoras

Para sugerir una mejora:
- Usa un título claro y descriptivo
- Proporciona una descripción detallada de la mejora
- Explica por qué esta mejora sería útil
- Lista cualquier alternativa que hayas considerado

## Proceso de Desarrollo

### Configuración del Entorno

1. Haz fork del repositorio
2. Clona tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/detection.git
   cd detection
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita .env con tus configuraciones
   ```

5. Crea una rama para tu feature:
   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```

### Estructura de Ramas

- `main`: Código estable listo para producción
- `develop`: Rama de desarrollo principal
- `feature/*`: Nuevas características
- `bugfix/*`: Corrección de bugs
- `hotfix/*`: Correcciones urgentes para producción

## Estándares de Código

### Estilo de Código

- Usa **camelCase** para variables y funciones
- Usa **PascalCase** para clases y constructores
- Usa **UPPER_SNAKE_CASE** para constantes
- Indentación: 2 espacios
- Usa punto y coma al final de cada declaración
- Longitud máxima de línea: 100 caracteres

### Convenciones de Nomenclatura

#### Archivos
- Modelos: `PascalCase.js` (ej. `Alert.js`, `Caregiver.js`)
- Rutas: `camelCase.js` (ej. `alerts.js`, `caregivers.js`)
- Utilidades: `camelCase.js` (ej. `emailHelper.js`)

#### Base de Datos
- Colecciones: plural en minúsculas (ej. `alerts`, `caregivers`)
- Campos: camelCase (ej. `createdAt`, `telegramUsername`)

### Comentarios

```javascript
/**
 * Envía una alerta de caída a todos los cuidadores registrados
 * @param {Object} alertData - Datos de la alerta
 * @param {string} alertData.location - Ubicación de la caída
 * @param {Date} alertData.timestamp - Momento de la caída
 * @returns {Promise<boolean>} - True si se enviaron todas las alertas
 */
async function sendFallAlert(alertData) {
    // Implementación...
}
```

### Manejo de Errores

```javascript
try {
    const result = await someAsyncOperation();
    return result;
} catch (error) {
    console.error('Error en operación:', error.message);
    throw new Error(`Falló la operación: ${error.message}`);
}
```

## Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests específicos
npm test -- --grep "descripción del test"

# Ejecutar con coverage
npm run test:coverage
```

### Escribir Tests

```javascript
const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');

describe('Alerts API', () => {
    describe('POST /alerts', () => {
        it('debería crear una nueva alerta', async () => {
            const alertData = {
                location: 'Sala de estar',
                severity: 'high'
            };

            const response = await request(app)
                .post('/alerts')
                .send(alertData)
                .expect(201);

            expect(response.body).to.have.property('id');
            expect(response.body.location).to.equal(alertData.location);
        });
    });
});
```

## Proceso de Pull Request

### Antes de Enviar

1. **Asegúrate de que los tests pasen**:
   ```bash
   npm test
   ```

2. **Verifica el estilo de código**:
   ```bash
   npm run lint
   ```

3. **Actualiza la documentación** si es necesario

4. **Haz commit con mensajes descriptivos**:
   ```bash
   git commit -m "feat: agregar validación de email en registro de cuidadores"
   ```

### Formato de Commits

Usa el formato [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva característica
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` cambios de formato (espacios, punto y coma, etc.)
- `refactor:` refactorización de código
- `test:` agregar o modificar tests
- `chore:` cambios en herramientas de build, etc.

### Envío del Pull Request

1. Haz push de tu rama:
   ```bash
   git push origin feature/nombre-de-tu-feature
   ```

2. Crea el Pull Request en GitHub

3. Completa la plantilla de PR con:
   - Descripción clara de los cambios
   - Tipo de cambio (bug fix, nueva feature, etc.)
   - Checklist de verificación
   - Capturas de pantalla si aplica

### Revisión de Código

Los mantenedores revisarán tu PR considerando:
- Funcionalidad y corrección
- Calidad del código y adherencia a estándares
- Tests y cobertura
- Documentación
- Impacto en el rendimiento

## Preguntas

Si tienes preguntas sobre cómo contribuir, puedes:
- Abrir un issue con la etiqueta `question`
- Contactar a los mantenedores del proyecto

¡Gracias por contribuir al Sistema de Detección de Caídas!
