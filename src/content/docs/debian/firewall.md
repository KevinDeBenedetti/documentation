---
title: Debian | Pare-feu
lastUpdated: 2024-02-25
description: Un guide pour configurer le pare-feu de debian 12.
sidebar:
    order: 2
    label: Pare-feu
---

## Iptables

:::note[DOCUMENTATION]
[debian.org](https://wiki.debian.org/iptables) <br>
[OVH](https://help.ovhcloud.com/csm/fr-dedicated-servers-firewall-iptables?id=kb_article_view&sysparm_article=KB0043442) <br>
[Tuto](https://upcloud.com/resources/tutorials/configure-iptables-debian)
:::

Voir les règles définies. [Documentation OVH](https://help.ovhcloud.com/csm/fr-vps-firewall-iptables?id=kb_article_view&sysparm_article=KB0056989)

```bash title="Voir les règles"
sudo iptables -L
```

```bash title="Création d'un fichier de test iptables"
sudo editor /etc/iptables.test.rules
```

```yml title="Ajout de règles"
*filter

  # Allows all loopback (lo0) traffic and drop all traffic to 127/8 that doesn't use lo0
  -A INPUT -i lo -j ACCEPT
  -A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT

  # Accepts all established inbound connections
  -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

  # Allows all outbound traffic
  # You could modify this to only allow certain traffic
  -A OUTPUT -j ACCEPT

  # Allows HTTP and HTTPS connections from anywhere (the normal ports for websites)
  -A INPUT -p tcp --dport 80 -j ACCEPT
  -A INPUT -p tcp --dport 443 -j ACCEPT

  # Allows SSH connections
  # The --dport number is the same as in /etc/ssh/sshd_config
  -A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT
  # Add an authorised IP
  # -A INPUT -p tcp -m state --state NEW --dport 22 -s IP_ADRESS -j ACCEPT
  
  # Now you should read up on iptables rules and consider whether ssh access
  # for everyone is really desired. Most likely you will only allow access from certain IPs.

  # Allow ping
  #  note that blocking other types of icmp packets is considered a bad idea by some
  #  remove -m icmp --icmp-type 8 from this line to allow all kinds of icmp:
  #  https://security.stackexchange.com/questions/22711
  -A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

  # log iptables denied calls (access via 'dmesg' command)
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

  # Reject all other inbound - default deny unless explicitly allowed policy:
  -A INPUT -j REJECT
  -A FORWARD -j REJECT

  COMMIT
```

```bash title="Activer les règles"
sudo iptables-restore < /etc/iptables.test.rules
```

### Autoriser le trafic sur des ports spécifiques

:::tip[Options]
- `-p`: Vérifie le protocole spécifié (tcp)
- `--dport`: Spécifie le port de destination
- `-jjump`: Effectue l'action
:::

```bash title="Autoriser le trafic du système (le localhost)"
sudo iptables -A INPUT -i lo -j ACCEPT
```

```bash title="Autoriser le trafic Web HTTP"
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
```

```bash title="Autoriser le trafic Internet HTTPS"
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

```bash title="Autoriser le trafic SSH"
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

### Rendre les changements permanents

```bash title="Installer le paquet"
sudo apt install iptables-persistent
```

Les fichiers `/etc/iptables/rules.v4` et `/etc/iptables/rules.v6` seront créés.

```bash title="Sauvegarder la configuration iptables"
sudo sh -c 'iptables-save > /etc/iptables/rules.v4'
```

```bash title="Restaurer les règles"
sudo iptables-restore < /etc/iptables/rules.v4
```

```bash title="Ajouter les nouvelles règles en gardant les actuelles"
sudo iptables-restore -n < /etc/iptables/rules.v4
```