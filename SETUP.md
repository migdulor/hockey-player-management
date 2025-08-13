# 🚀 Instrucciones para Levantar la Aplicación

## ✅ Problemas Corregidos

He solucionado los siguientes errores críticos en tu repositorio:

### 1. **vite.config.js** - ✅ CORREGIDO
- **Problema**: Usaba sintaxis CommonJS (`require`) en lugar de ES modules
- **Solución**: Cambiado a `import` y `export default`

### 2. **package.json** - ✅ CORREGIDO  
- **Problema**: Nombre inconsistente del proyecto
- **Solución**: Actualizado nombre y descripción

### 3. **index.html** - ✅ CORREGIDO
- **Problema**: Título no descriptivo
- **Solución**: Actualizado título y meta descripción

### 4. **README.md** - ✅ CORREGIDO
- **Problema**: Enlaces rotos y documentación desactualizada
- **Solución**: Actualizado con información correcta y troubleshooting

## 📋 Pasos para Levantar la Aplicación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/migdulor/hockey-player-management.git
cd hockey-player-management
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### 4. Construir para Producción
```bash
npm run build
```

### 5. Vista Previa de Producción
```bash
npm run preview
```

## 🌐 Despliegue Automático

El repositorio ya tiene configurado GitHub Actions para despliegue automático:

1. **Cada push a `main`** activará el deployment
2. **GitHub Pages** está configurado para usar GitHub Actions
3. **URL de producción**: https://migdulor.github.io/hockey-player-management/

## 🔧 Verificación del Estado

### Verificar que todo funciona:
1. Ejecuta `npm install`
2. Ejecuta `npm run dev`
3. Abre `http://localhost:5173`
4. Verifica que la aplicación carga sin errores en la consola

### Si hay errores:

#### Error: "Cannot resolve dependencies"
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Module not found"
```bash
npm install
npm run dev
```

#### Error: "Build failed"
```bash
npm run build --verbose
```

## 📊 Verificación de Funcionalidades

Una vez levantada la aplicación, verifica:

✅ **Navegación**: Las 3 pestañas (Asistencias, Estadísticas, Formación)
✅ **Asistencias**: Formulario de marcar presentes/ausentes/tardanzas
✅ **Estadísticas**: Gráficos y porcentajes de asistencia
✅ **Formación**: Editor visual de formaciones tácticas
✅ **Responsive**: Funciona en móvil y desktop

## 🔗 Conexión con Google Sheets

La aplicación está configurada para conectarse con Google Apps Script:
- **URL del Script**: `https://script.google.com/macros/s/AKfycbxIW7BOmLmPrjUsokhsI4p4mi1wdg9JPpPFs8KTUmBhbgetp_RfaLew8RFB6V3BajrpmQ/exec`
- **Google Sheet ID**: `1pcyu6ME8JNOdUfGDa39fkSPoAHmWdvP3NwpN_uLqrW0`

## 📝 Próximos Pasos

1. **Verifica la aplicación localmente**
2. **Haz push de los cambios** para activar el deployment automático
3. **Configura GitHub Pages** si no está habilitado:
   - Ve a Settings → Pages
   - Source: GitHub Actions
4. **Verifica el deployment** en la pestaña Actions

## 🆘 Soporte

Si encuentras algún problema:

1. **Revisa la consola del navegador** para errores de JavaScript
2. **Verifica GitHub Actions** en la pestaña Actions del repositorio
3. **Comprueba que todas las dependencias están instaladas**

---

¡La aplicación debería funcionar perfectamente ahora! 🎉
