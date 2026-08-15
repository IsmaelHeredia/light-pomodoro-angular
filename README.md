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

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgeKw3MlfyqhOf78XIafJTeqZPL-kzFj2NlwNTUXQy4LTWEpgHzIOQ38mRuSaoHvwte2S2KpE31gR7hGN3P3hEaIs4yNDfboLUbaLLzJNV0qT5G9bd73sirOod-w7dn7Tjx8CoGFN2Yhac4heWUdn5EKKMkQ5wYf4hI466Vo2vv0q1qq3lNDtcTDqpsOX4/s1845/1.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRTB4klf5Tt-3DcCdKGoAbHhyzUERNw9Zu5aPTmAOzZT3OvTYo0L63NeqoyD7Sfq31VofV26MF-XT_XI-Mn2LOhhK50Fpb1grhyphenhyphenrYC3I008Lt2S7VYn8z2dtmYYZKt8pZfNxQAoJoXZoQimnopkVzMKdKlGwiCRxiyzLLgHFo7Bf5WQ3JO6aqVCSfpuuk/s1844/2.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiezAVVDCrGgABSqt20S4KKqg7_5hrMuKoGlB2bBgGvYF7-P8TzLvfJhWOnGpquh19VZtzcLEEwKEObp976R1zoUux27wpvPOR8LSFwk3qqbp5q0tuZGeBlUKXGEVaGIAlRINuo6qphNeUuSyLEEEpiDEH4AW952phMGXC2u_JD2GQLHa0RTi6Wa2M45YI/s1843/3.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiW_KvUCOge8CRkl-bzn8n1QhpX1c5R_YJ_hKOOy9wGpVYM9moB0ocg6aqbCZO_TX-NfTJo7Ds_P6zT_LprxeMEmpmkMQrS5HduzsaZGGOBpjx9klWMbXBtdq3GbKrs6sST2legS-DnARNF-iPyzu4T_kewnrT1F71-yUC0IpXRsi8KHGYmqvW96U9311s/s1846/4.png)

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