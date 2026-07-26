# Instalación de los cuatro mini PC (modo kiosco)

Guía para configurar cada reproductor de pantalla (sección 11 y 30 del prompt
maestro). **Un mini PC por televisor.**

## 1. Hardware por pantalla

- Mini PC Intel N100 (o equivalente), 8 GB RAM, SSD ≥ 128 GB.
- Salida HDMI al televisor (55"–65").
- Ethernet (recomendado) + Wi-Fi de respaldo.
- Protector de voltaje; UPS donde sea necesario.

## 2. Sistema operativo

- Windows 11 o Linux.
- Navegador Chrome / Chromium actualizado.
- Zona horaria correcta (crítico para la sincronización por hora oficial).

## 3. Activación de la pantalla (primera vez)

La primera vez, cada mini PC abre la ruta de activación:

```
https://carteleria-posgrado.vercel.app/player/activar
```

La pantalla mostrará un **código de 6 dígitos**. En el panel, vaya a
**Centro de pantallas → Activar una pantalla**, introduzca el código y asigne
nombre y ubicación. La pantalla queda asociada al grupo
`PANTALLAS GENERALES POSGRADO`, guarda su identidad y arranca sola en:

```
https://carteleria-posgrado.vercel.app/player?screen=SU-CODIGO
```

Tras la activación, el reproductor recuerda su identidad; en arranques
posteriores basta con abrir `/player`.

## 4. Modo kiosco a pantalla completa

### Chrome / Chromium (Windows y Linux)

```bash
chrome --kiosk --incognito --noerrdialogs \
  --disable-session-crashed-bubble --disable-infobars \
  --autoplay-policy=no-user-gesture-required \
  "https://carteleria-posgrado.vercel.app/player"
```

> `--autoplay-policy=no-user-gesture-required` permite el autoplay de los
> videos (que siempre inician **silenciados**, sección 13).

## 5. Inicio automático

### Windows

Cree un acceso directo con el comando anterior en:

```
shell:startup
```

### Linux (autostart de escritorio)

`~/.config/autostart/carteleria.desktop`:

```ini
[Desktop Entry]
Type=Application
Name=Carteleria UABJB
Exec=chromium --kiosk --autoplay-policy=no-user-gesture-required https://carteleria-posgrado.vercel.app/player
X-GNOME-Autostart-enabled=true
```

## 6. Prevención de pantalla en negro

- Desactive el ahorro de energía y el apagado de pantalla del SO.
- Desactive el salvapantallas.
- El reproductor nunca queda en negro: ante errores muestra la vista de
  respaldo institucional (sección 28).

## 7. Comportamiento diario (sección 30)

- **Al iniciar:** encender TV + mini PC → el reproductor abre solo → vista de
  sincronización → cálculo de posición → programación general. No importa que
  los equipos se enciendan con minutos de diferencia: cada uno se ubica solo.
- **Durante la jornada:** reproducción continua, sincronización periódica,
  recuperación automática.
- **Al finalizar:** apagar mini PC, televisores y reguladores/UPS según
  procedimiento (no hay vista de cierre nocturno: los equipos se apagan
  físicamente).

## 8. Pruebas de instalación (sección 32)

- Encendido de las cuatro pantallas en horarios distintos.
- Sincronización automática (diferencia 1–3 s).
- Pérdida y recuperación de Internet.
- Reinicio de una sola pantalla sin afectar las demás.
- Emergencia simultánea en las cuatro.
- Legibilidad a distancia y lectura del código QR.
