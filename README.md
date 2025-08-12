# Formulario de Asistencias - TLTC 2025

🏆 **Control de asistencias para jugadoras de 7ma y 6ta división**

## 🚀 Demo en vivo

[Ver aplicación](https://migdulor.github.io/formulario-asistencias-tltc/)

## ✨ Características

- ✅ **37 jugadoras** de 7ma y 6ta división
- 📊 **Conexión directa** con Google Sheets
- 📱 **Responsive** - funciona en móviles
- 📈 **Estadísticas** en tiempo real
- 📋 **Export** a CSV
- 🔐 **Configuración** segura de API

## 🎯 Funcionalidades

### Registro de Asistencias
- **Presente (P)** - Jugadora asistió
- **Ausente (A)** - Jugadora no asistió  
- **Tardanza (T)** - Jugadora llegó tarde

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

### 1. Google Sheets API
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita "Google Sheets API"
3. Crea una API Key
4. Configúrala en la aplicación

### 2. Permisos del Google Sheet
1. Hacer el documento público
2. Permisos de "Editor" para la API
3. ID del documento configurado: `1pcyu6ME8JNOdUfGDa39fkSPoAHmWdvP3NwpN_uLqrW0`

## 🛠️ Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/migdulor/formulario-asistencias-tltc.git
cd formulario-asistencias-tltc

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
- **Columna C**: División
- **Columna D en adelante**: Fechas de asistencia

## 🏗️ Tecnologías

- **React 18** - Framework principal
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **Google Sheets API** - Base de datos

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

El proyecto se despliega automáticamente en GitHub Pages mediante GitHub Actions cuando se hace push a la rama `main`.

### URL de producción:
https://migdulor.github.io/formulario-asistencias-tltc/

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

*Sistema de control de asistencias diseñado específicamente para las divisiones juveniles del club.*