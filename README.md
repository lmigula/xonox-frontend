# Xonox Docker Installation

## Installation Raspberry 💻

### Standard Raspberry image

Für die Installation kann das Standard Raspberry Image verwendet werden.

Nach dem Einspielen der Updates ist es noch wichtig für die kabel gebundene Netzwerkschnittstelle  eine statische IP zu verwenden, da diese nachher für die weiteren Dienste verwendet wird.

### Installation Docker

Da die Komponeten als Docker Container gestartet werden, muss als erster Docker installiert werden. In der Original Anleitung unter <https://docs.docker.com/engine/install/debian/> steht zwar man solle das  convenience script verwenden, da die einzelnen Schritte nicht funktionieren, aber bei mir war genau das Gegenteil der Fall 🤷 

Wenn ich aus der Original Anleitung keine Befehle vergessen habe, waren das die einzelnen Schritte.

```
$ sudo apt-get update
$ sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin


$ sudo groupadd docker
$ sudo usermod -aG docker $USER
```

Danach muss man sich einmal ab und anmelden, damit die Zuweisung zu der Gruppe docker zu dem angemeldeten User aus dem letzten Befehl greift, oder einfach gleich den Raspberry neu booten. Damit kann man auch gleich überprüfen kann ob der docker Dienst sauber startet. Danach sollte dieser Befehl auf jeden Fall erfolgreich sein.

```
$ docker run hello-world
```

### Installation Portainer

Zur Analyse und Überwachung ist das Tool Portainer sehr hilfreich, da über den Browser komfortabel auf Log-Files zugegriffen werden kann, oder einzelne Container zum Beispiel neu gestartet werden können.

Im Verzeichnis `portainer` liegt die Datei `docker-compose.yml` mit dem der Container erstellt werden kann. Falls das Verzeichnis `./portainer-data` in einem anderen Verzeichnis sein soll muss der Pfad entsprechen angepasst werden. In dem Beispiel wird der Pfad einfach in dem aktuellen Verzeichnis relativ zu der `docker-compose` Datei erstellt.

```
# docker-compose.yml 
version: '3'

services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./portainer-data:/data
    ports:
      - 9000:9000
```

Einfach in das Verzeichnis wechseln und mit dem Befehl `docker compose up -d` das Tool starten.
Über http://<raspberry-ip>:9000  sollte man nun die admin Oberfläche aufrufen können um einen admin User erstellen zu können.

### Installation pi-hole

Wenn man keinen DNS-Server im Heimnetz hat, kann dafür das Projekt [pi-hole](https://pi-hole.net/) genutzt werden.

Neben der Möglichkeit eigene DNS Einträge zu setzen filtert das Projekt auch schon sehr viele Anfragen an Tracking Dienste aus dem Netzwerk. Somit erfüllt das auch einen weiteren Zweck, wenn es für alle Rechner als erster DNS Server genutzt wird. 

Im Ordner `pi-hole` liegt bereits die benötigte `docker-compose.yml`.
Der Eintrag für den dhcp Server Port kann je nach Konfiguration gelöscht werden.

```
version: "3"

# More info at https://github.com/pi-hole/docker-pi-hole/ and https://docs.pi-hole.net/
services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    # For DHCP it is recommended to remove these ports and instead add: network_mode: "host"
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "67:67/udp" # Only required if you are using Pi-hole as your DHCP server
      - "8090:80/tcp"
    environment:
      TZ: 'Europe/Berlin'
      WEBPASSWORD: 'superSecretWebpassword'
    # Volumes store your data between container upgrades
    volumes:
      - './etc-pihole:/etc/pihole'
      - './etc-dnsmasq.d:/etc/dnsmasq.d'    
    #   https://github.com/pi-hole/docker-pi-hole#note-on-capabilities
    cap_add:
      - NET_ADMIN # Recommended but not required (DHCP needs NET_ADMIN)      
    restart: unless-stopped
```


Auch hier kann man mit dem Befehl `docker compose up -d` das Tool starten und danach kann über die url <http://<Server-IP>:8090/admin/> der Admin Bereich des pihole aufgerufen werden. Hierfür wird das `WEBPASSWORD` benötige, welches in der Datei festgelegt wurde.

Unter dem Punkt Local DNS -> DNS Records können nun die Einträge gesetzt werden die als Alternative für die ursprünglichen Noxon Server benötigt werden.

Für die  Domains `legacy.noxonserver.eu` und `gate1.noxonserver.eu` müssen Einträge erstellt werden, die auf IP Adresse verweisen auf dem der xonox Dienst nachher läuft.

Je nach Internet Router kann die IP Adresse des pi-hole Servers danach auch als DNS Server in der allgemeinen Internet-Konfiguration eingetragen werden, damit dieser bei allen Clients genutzt wird.

Eine Anleitung dafür findet sich hier <https://docs.pi-hole.net/routers/fritzbox-de/> ansonsten muss der Server mit der pi-hole Installtion im iRadio als DNS Server eingetragen werden.

### Installation xonox

In das Verzeichnis dieses Repositories werden nun  die benötigten Repositories direkt von github geklont.

```
$ git clone https://github.com/x789/xonox.git
$ git clone https://github.com/lmigula/xonox-frontend.git
```

Da in dem xonox repostitory das benötigte Dockerfile bisher nur im develop Branch existiert muss dieser erst noch ausgecheckt werden.

```
$ cd xonox
$ git checkout develop
$ cd ..
```

In der bestehenden `docker-compose.yml` Datei für den xonox Dienst kann der Pfad für die xonox.conf angepasst werden falls gewünscht:

```
version: '3'
services:
  xonox-back:
    build:
      context: ./xonox
      dockerfile: Dockerfile
    volumes:
       - ./xonox.conf:/usr/src/app/xonox.conf
    networks:
      - default
    restart: always
  xonox-front:
    build:
      context: ./xonox-frontend
      dockerfile: Dockerfile
    ports:
      - 80:80
    depends_on:
      - xonox-back
    restart: always 
networks:
  default:
```


Ist auf dem Rechner schon ein Webserver installiert, und der xonox Dienst soll hinter einem Reverse-Proxy betrieben werden, so muss der Eintrag `ports` geändert werden.

Beim Aufruf des Befehls `docker compose up` sollten nun beide Container erstellt und gestartet werden. Hierbei wird der Prozess noch nicht im Hintergrund gestartet um eventuelle Fehler zu sehen.

Starten alle Container ohne Fehler und die Weboberfläche ist über die IP des Rechners aufrufbar und die Senderliste kann editiert werden, so können über Strg+C die Container beendet werden, und danach über `docker compose up -d` im Hintergrund gestartet werden.

Das schöne an der Lösung ist, dass nun bei einem Update einer der Komponenten mit dem Befehl `docker-compose up -d --no-deps --build <service_name>`  ein einzelner Container neu erstellt werden kann, nachdem das dazugehörige git repository aktualisiert wurde.