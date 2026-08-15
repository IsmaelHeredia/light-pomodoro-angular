**Light Pomodoro** es una aplicación de temporizador Pomodoro con gestión de tareas, cuyo diseño y experiencia de usuario están inspirados en Pomofocus, construida en Angular y estilizada con TailwindCSS bajo la paleta **Gruvbox Light**. Todo el estado (tareas, configuración y progreso del temporizador) persiste localmente en el navegador, sin necesidad de backend ni base de datos.

## Funcionalidades principales

### Temporizador Pomodoro

- **Tres modos de trabajo:** Pomodoro, Descanso Corto y Descanso Largo, con cambio instantáneo entre ellos.
- **Theming dinámico:** Toda la interfaz se adapta automáticamente según el modo activo.
- **Conteo real:** El temporizador calcula el tiempo restante contra un timestamp real, por lo que no se desincroniza si se cierra o recarga la pestaña mientras corre.
- **Transición automática:** Al completar un pomodoro, la app avanza sola a Descanso Corto o Descanso Largo según el intervalo configurado, y viceversa.
- **Notificaciones:** Sonido y notificación del sistema operativo al finalizar cada ciclo, incluso con la pestaña en segundo plano.

### Gestión de tareas

- **Control total:** Creación, edición inline, marcado como completada y eliminación de tareas.
- **Reordenamiento:** Organización de tareas mediante Drag & Drop.
- **Persistencia:** Las tareas y su orden se mantienen guardadas en el navegador aunque se cierre la aplicación.

### Configuración

- **Modal de ajustes:** Duración personalizada (en minutos) de Pomodoro, Descanso Corto y Descanso Largo.
- **Auto Inicio:** Activación opcional de inicio automático para breaks y pomodoros.
- **Intervalo de Descanso Largo:** Configuración de cada cuántos pomodoros corresponde un descanso largo.
- **Validación:** Los campos numéricos solo aceptan enteros positivos.

## Capturas de pantalla

A continuación, se muestran algunas imágenes de la aplicación en funcionamiento:

![screenshot]()

### Instalación del proyecto

**1.** Clonar el repositorio

```
git clone https://github.com/IsmaelHeredia/light-pomodoro-angular.git
cd light-pomodoro-angular
```

**2.** Instalación de dependencias

```
npm install
```

**3.** Ejecución del proyecto en modo desarrollo

```
ng serve
```

Una vez iniciado, se podrá acceder desde la siguiente URL:

```
http://localhost:4200
```

**4.** Build de producción

```
ng build
```

### Pruebas E2E

El proyecto incluye tests end-to-end reales sobre la interfaz, cubriendo navegación entre modos, conteo del temporizador, CRUD de tareas, drag & drop, persistencia en `localStorage` y validación de configuración.

Para ejecutar los tests:

```
npm run test:e2e
```

También están disponibles los siguientes modos:

```
npm run test:e2e:ui
npm run test:e2e:headed
```