# Ejercicio CiberKillChain - Defensa

Hacer una copia de este documento para utilizar con plantilla para el ejercicio

## Alumno

Erik Hromek

## Enunciado

Desarrollar la defensa en función del ataque planteado en orden inverso.

Para cada etapa elegir una sola defensa, la más importante, considerar recursos limitados.

## Resolución

**Nota**: nos paramos del lado de la empresa proveedora del servicio para hacer el ejercicio de defensa.

**Enunciado original**: El sistema consiste en una plataforma web usada para la prevención ciudadana. Se entrega a los beneficiarios botones antipánico (dispositivo físicos) que están conectado al componente web (cloud) de la solución. Cuando la persona presiona el botón manda un alerta a la plataforma web y esta es gestionada por las autoridades de seguridad de un centro de monitoreo, disparando acciones (enviando a la policía, contactando a la persona, etc.).

Este sistema se implementa tanto en municipios, como empresas de seguridad privadas.

### Ataque realizado

El atacante logró el objetivo de mal-utilizar la plataforma para inutilizar el uso por parte de los usuarios reales, impidiendo hacer uso de la aplicación web y atendiendo situaciones de emergencia reales (para perjudicar al cliente).

Debido a las quejas levantadas, como empresa proveedor del software, correspondería comenzar a revisar el funcionamiento de la aplicación (ir de atrás hacia adelante).

### Acciones a tomar para defenderse de cada paso

7. Actions on Objectives (acciones sobre los objetivos del sistema con el propósito original):

El equipo técnico procede a realizar una revisión y análisis de todos los sucesos reportados:

- alertas que no llegan o llegan tarde
- acciones no realizadas por nadie del personal de monitoreo
- situaciones de emergencia que el equipo de monitoreo no pudo atender a tiempo
- modificaciones sobre usuarios actuales

Debe entenderse que muchas de estas acciones no son fáciles de detectar, ya que corresponden al uso de **funcionalidades** existentes de la plataforma. Lo primero que se notarán son acciones repudiadas por los usuarios legítimos.

Podemos aplicar del lado de la plataforma web los siguientes mecanismos para atender a tiempo estos eventos (detectarlos y mitigarlos):


- DS0002 - User Account Modification: deteccion
- DS0002 - User Account Deletion: deteccion
 	- DS0029 Network Traffic Flow
- M1053 	Data Backup 

La única medida que podemos proporcionar aquí, es asegurarnos de tener backups, y aplicar medidas de detección como las listas.



6. Command & Control (establecer medio para controlar al sistema):

Anteriormente se detectó que hay un acceso de un intruso al sistema, por lo que el método más "barato" y rápido de implementar, es el siguiente:

-- Network Traffic Flow (DS0029): detección, rápidamente se detectaría un acceso desde una dirección/región desconocida, que no coincide con la del centro de monitoreo del cliente (https://attack.mitre.org/datasources/DS0029/#Network%20Traffic%20Flow)

- M1037 - Filter Network Traffic (https://attack.mitre.org/mitigations/M1037/): mitigacion

Medida escogida (dada la limitación de recursos para implementar _features_ asociadas a auditoría, seguridad): limitación de accesos, a una serie de direcciones IPs conocidas por el centro de monitoreo del cliente. 
La unica desventaja que NO nos da proteccion, es si se acceden por dentro de la red del centro de monitoreo, pero consideramos que tal red está correctamente asegurada por el área de sistemas del cliente.


5. Installation (ejecución del ataque):

Sobre este punto, no tenemos ninguna actividad adicional (ver TP de ataque) ya que una vez que el atacante accede al sistema con el usuario de administrador, ya está "instalado":

- M1026 	Privileged Account Management. Podría aplicar, pero eso hace referencia a limitar los accesos a usuarios privilegios a nivel SERVIDOR/INFRA; en este caso nos referimos a usuarios de la APLICACION, por lo que el equivalente sería "principio de menor privilegio": NO dar este tipo de permisos a los usuarios del cliente, no importa si tiene un usuario administrador (ver paso siguiente)

4. Exploitation (acceso inicial al sistema):

El objetivo aquí es impedir que, desde un usuario de un cliente, se puedan ejecutar acciones que comprometan el uso correcto del sistema. Tenemos varias alternativas para agregar un "paso adicional" al momento de ejecutar alguna acción sensible:

- M1018 	User Account Management
- M1032 	Multi-factor Authentication 
-  M1036 	Account Use Policies 
- M1026 	Privileged Account Management 
- M1017 	User Training 

Aquí se repite la acción más valiosa (a nuestro criterio) del paso anterior. Creo que la política más rápida de implementar y con mayor valor agregado (siguiendo con la restricción de recursos) es la de  M1036 	Account Use Policies y podría ser también  M1026 	Privileged Account Management  (considero que todas son valiosas y de implementarse, podrían dotar al sistema de muchas "capas" necesarias para romper por parte de un atacante)..

3. Delivery (envío de los recursos creados a la víctima para intentar acceder al sistema):

En este caso, el método para engañar al usuario y obtener las credenciales legítimas, es mediante correo haciendose pasa por la empresa. La única medida que puede "mitigar" (y no completamente, por eso consideramos que las actividades del paso de Exploitation darían solidez al sistema) sería la de M1017 	User Training para capacitar a los clientes, y explicar cuales son las comunicaciones **oficiales** de la empresa proveedora del servicio.

2. Weaponization (juntar toda la información para preparar el ataque, y conseguir los recursos necesarios para llevar a cabo el plan):

Para este caso, consideramos que no se puede impedir la creación y aprovisionamiento de infraestructura "falsa".

1. Reconnaissance (obtener información que servirá para planes futuros)

La única forma de saber **qué** información está disponible publicamente sobre los empleados, usuarios de la aplicación, información sobre la empresa y sus comunicaciones, manuales de la empresa, etc. es investigando en Internet, de la misma forma que lo haría el atacante, y actuar en consonancia para prevenir "ataques" sobre los **objetivos** (usuario legítimos).

DS0035 - https://attack.mitre.org/datasources/DS0035/
M1056 	Pre-compromise (hhttps://attack.mitre.org/mitigations/M1056/)

Solo podemos tomar acciones **preventivas*.




