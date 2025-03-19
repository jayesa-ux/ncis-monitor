# NCIS Monitor

![NCIS Monitor Logo](/logo.svg)

## Descripción

NCIS Monitor es una aplicación web moderna diseñada para monitorear y gestionar sistemas y playbooks de seguridad. La aplicación proporciona una interfaz de usuario intuitiva para visualizar el estado de los sistemas, ejecutar playbooks y seguir su progreso en tiempo real.

## Tecnologías

- React 19
- TypeScript
- Redux Toolkit
- React Router 7
- Material UI 6
- Vite 6

## Características

- **Autenticación de usuario:** Sistema de login seguro
- **Dashboard de sistemas:** Visualización y gestión de múltiples sistemas
- **Monitoreo de playbooks:** Seguimiento en tiempo real del estado de los playbooks
- **Consola de ejecución:** Visualización de logs de ejecución
- **Flujo de ejecución:** Seguimiento visual de los pasos del playbook
- **Interfaz adaptativa:** Diseño responsive para diferentes dispositivos

## Requisitos previos

- Node.js 18+
- npm o yarn

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/ncis-monitor.git
   cd ncis-monitor
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Para producción, construye la aplicación:
   ```bash
   npm run build
   ```

## Uso

### Credenciales de acceso

- **Usuario:** admin
- **Contraseña:** admin

### Estructura de la aplicación

- **Login:** Página de inicio de sesión
- **Home:** Lista de sistemas disponibles y sus playbooks
- **Dashboard:** Monitorización detallada de un playbook específico
  - Información del playbook
  - Consola de ejecución
  - Flujo de ejecución (pasos del playbook)

## Desarrollo

### Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Ejecuta el linter para verificar el código
- `npm run preview` - Previsualiza la versión construida

### Estructura de archivos

```
ncis-monitor/
├── public/
│   └── logo.svg
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Páginas principales
│   ├── services/        # Servicios para API y autenticación
│   ├── redux/           # Configuración de Redux
│   ├── types/           # Tipos de TypeScript
│   ├── Context/         # Contextos de React
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Punto de entrada
└── ...
```

## API Backend

La aplicación está configurada para conectarse a un backend a través de un proxy en http://localhost:5000. Puedes modificar esta configuración en el archivo `vite.config.ts`.

## Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.