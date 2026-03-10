# SSH

*A guide to configuring SSH connections and key management.*

## Basic Commands

### Connection

```shell
# Standard connection
ssh <USERNAME>@<IP_VPS>

# With SSH key
ssh -i ~/.ssh/<KEY_NAME>.pub <USERNAME>@<IP_VPS>
```

### Using an Alias

Create an alias in the SSH config file `~/.ssh/config`:

```shell
# ~/.ssh/config
Host <ALIAS_NAME>
    Hostname <IP_VPS>
    User <USERNAME>
    IdentityFile ~/.ssh/<KEY_NAME>
    IdentitiesOnly yes
```

```shell
# Connect using an alias
ssh <ALIAS_NAME>
```

### Setup

The `ssh-copy-id` command configures SSH access on the server:

1. Copies the public key to the remote server
2. Sets appropriate permissions automatically
3. Appends the key to the `authorized_keys` file

```shell
ssh-copy-id -i ~/.ssh/<key_name>.pub <username>@<ip_vps>
```

### Copy Files

```shell
# Copy a file over SSH
scp -r <FILE_NAME> <username>@<ip_vps>:~/

# Copy a file over SSH on a custom port
scp -r -P <PORT> <FILE_NAME> <username>@<ip_vps>:~/
```

### Remove a Host Key

```shell
ssh-keygen -R <IP_VPS>
```

## Connect to a Server

### 1. Generate an SSH Key

```shell
ssh-keygen -t rsa -b 4096 -C "email@example.com" -f ~/.ssh/<key_name>
```

### 2. Copy the Public Key

```shell
# macOS
pbcopy < ~/.ssh/<key_name>.pub
```

### 3. Connect to the VPS

```shell
ssh -i ~/.ssh/<key_name> root@<ip_vps>
```

## Key Management

Authorize the key by appending it to the `authorized_keys` file:

```shell
echo "<public_key>" >> ~/.ssh/authorized_keys
```
