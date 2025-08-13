# Sistema de Gestión de Jugadores de Hockey - TLTC 2025

🏆 **Control de asistencias y formaciones para jugadoras de 7ma y 6ta división**

## 🚀 Demo en vivo

[Ver aplicación](https://migdulor.github.io/hockey-player-management/)

## ✨ Características

- ✅ **37 jugadoras** de 7ma y 6ta división
- 📊 **Conexión directa** con Google Sheets
- 📱 **Responsive** - funciona en móviles
- 📈 **Estadísticas** en tiempo real
- 🏒 **Formaciones tácticas** interactivas
- 📋 **Export** a texto e imagen
- 🔐 **Configuración** segura de API

## 🎯 Funcionalidades

### Registro de Asistencias
- **Presente (P)** - Jugadora asistió
- **Ausente (A)** - Jugadora no asistió  
- **Tardanza (T)** - Jugadora llegó tarde

### Estadísticas
- Gráficos de asistencia por fecha
- Porcentajes individuales de cada jugadora
- Comparaciones entre divisiones
- Filtros por división y rango de fechas

### Formaciones Tácticas
- Editor visual de formaciones en cancha
- Asignación de jugadoras a posiciones
- Sistema de suplentes
- Export de formaciones a imagen y texto
- Vista previa profesional

### Filtros
- Todas las divisiones
- Solo 7ma división (18 jugadoras)
- Solo 6ta división (18 jugadoras)

### Sincronización con Google Sheets
- Guardado automático en Google Sheets
- Estructura horizontal (fechas como columnas)
- Creación automática de columnas por fecha
- Actualización en tiempo real

## ⚙️ Configuración

### 1. Google Apps Script
La aplicación usa Google Apps Script como backend. La URL del script está configurada en:
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIW7BOmLmPrjUsokhsI4p4mi1wdg9JPpPFs8KTUmBhbgetp_RfaLew8RFB6V3BajrpmQ/exec';
```

### 2. Permisos del Google Sheet
1. Hacer el documento público
2. Permisos de "Editor" para la API
3. ID del documento configurado: `1pcyu6ME8JNOdUfGDa39fkSPoAHmWdvP3NwpN_uLqrW0`

## 🛠️ Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/migdulor/hockey-player-management.git
cd hockey-player-management

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📊 Estructura de datos

**Google Sheets - Hoja "Asistencias":**
- **Columna A**: IDJugadora
- **Columna B**: Nombre
- **Columna C**: Nombre Corto
- **Columna D**: División
- **Columna E en adelante**: Fechas de asistencia

**Google Sheets - Hoja "Partidos":**
- Formaciones guardadas por fecha
- Datos del partido (rival, lugar, horarios)
- Alineaciones titulares y suplentes

## 🏗️ Tecnologías

- **React 18** - Framework principal
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **html2canvas** - Export de imágenes
- **Google Apps Script** - Backend y API
- **Google Sheets** - Base de datos

## 👥 Jugadoras - TLTC 2025

### 7ma División (18 jugadoras)
1. Abdo Martina
2. Alzueta Esteban Zoe
3. Ayala Sofia
4. Buriek Ernestina
5. Buriek Sol
6. Cuadrado Justina
7. Fernandez Luz María
8. Fernández correa Morena
9. Kravtzov Mosqueira Luz
10. Oliver Ledesma Guillermina
11. Oviedo Tobchi Agustina
12. Pando Victoria
13. Rodríguez ledesma Rosario
14. Roqué Malena
15. Sagra Catalina
16. Tapie Leonor
17. Villacorta Ana Sofia
18. Zayun Trinidad

### 6ta División (18 jugadoras)
19. Alzueta Esteban Lara
20. Benci Lourdes
21. Benito Ángela
22. Cano Ledesma Amparo
23. Cano Ledesma Pilar
24. Corbalán Costilla Anita
25. Coria Vignolo Maria Candelaria
26. D'Andrea Candelaria
27. Fanjul Staffolani Guadalupe
28. Fuentes Solana
29. González Terraf Rocío
30. López Islas Valentina
31. Méndez waisman Mora
32. Morano Posse Sofia Candelaria
33. Pando Lucia
34. Rodríguez Ledesma Agustina Maria
35. Romano Olivia María
36. Sánchez Noli Federica
37. Torres Ana Paula

## 🚀 Despliegue

La aplicación se despliega automáticamente en GitHub Pages mediante GitHub Actions cuando se hace push a la rama `main`.

### Estado del despliegue:
[![Deploy to GitHub Pages](https://github.com/migdulor/hockey-player-management/actions/workflows/deploy.yml/badge.svg)](https://github.com/migdulor/hockey-player-management/actions/workflows/deploy.yml)

### URL de producción:
https://migdulor.github.io/hockey-player-management/

## 🔧 Troubleshooting

Si la aplicación no se despliega:

1. **Verificar GitHub Actions**: Ve a la pestaña Actions del repositorio
2. **Habilitar GitHub Pages**: Settings → Pages → Source: GitHub Actions
3. **Verificar permisos**: El workflow necesita permisos de escritura en Pages
4. **Verificar Vite config**: El `base` debe coincidir con el nombre del repositorio

### Errores comunes y soluciones:

#### Error: "Cannot resolve module"
```bash
npm install
```

#### Error: "Module not found: @vitejs/plugin-react"
```bash
npm install @vitejs/plugin-react --save-dev
```

#### Error: "html2canvas is not defined"
```bash
npm install html2canvas
```

#### Error en vite.config.js
Asegúrate de usar sintaxis ES modules:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
```

## 🔒 Seguridad

- Las APIs están configuradas para solo lectura/escritura específica
- No se exponen credenciales en el código cliente
- Google Apps Script maneja la autenticación del lado del servidor

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado para TLTC 2025** 🏆

*Sistema integral de gestión de jugadores diseñado específicamente para las divisiones juveniles del club.*
