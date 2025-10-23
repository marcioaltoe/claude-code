# Troubleshooting Audio Notifications

Se o hook de áudio não está funcionando, siga este guia de troubleshooting.

## Verificações Rápidas

### 1. Verifique se os scripts estão executáveis

```bash
ls -l plugins/audio-notifications/hooks/
```

Deve mostrar permissões `rwxr-xr-x`:
```
-rwxr-xr-x  audio_notification_hook.sh
-rwxr-xr-x  audio_notification_hook.py
```

**Se não estiver executável:**
```bash
chmod +x plugins/audio-notifications/hooks/audio_notification_hook.sh
chmod +x plugins/audio-notifications/hooks/audio_notification_hook.py
```

### 2. Verifique se o comando de áudio está disponível

```bash
which say  # macOS
# ou
which spd-say  # Linux
# ou
which espeak  # Linux
```

**Deve retornar o caminho do comando**, por exemplo: `/usr/bin/say`

### 3. Teste o hook manualmente

```bash
echo '{"message": "Test notification", "hook_event_name": "Notification"}' | \
  plugins/audio-notifications/hooks/audio_notification_hook.py
```

**Deve falar "Test notification"**

### 4. Verifique se o áudio não está desabilitado

```bash
cat ~/.claude/audio_notifications.json
```

Se retornar `{"audio_off": true}`, o áudio está desabilitado.

**Para habilitar:**
```bash
echo '{"audio_off": false}' > ~/.claude/audio_notifications.json
```

**Ou remova o arquivo:**
```bash
rm ~/.claude/audio_notifications.json
```

## Problemas Comuns

### ❌ Hook não dispara

**Sintoma:** Script está executável e teste manual funciona, mas não fala automaticamente.

**Possíveis causas:**

1. **Plugin não está carregado**
   ```bash
   # Verifique se o plugin existe
   ls -la plugins/audio-notifications/.claude-plugin/plugin.json
   ```

2. **Hook configurado para evento errado**
   - Verifique `hooks/hooks.json`
   - Deve ter `"Notification"` como hook event

3. **Claude Code não está disparando notificações**
   - Notificações só disparam em cenários específicos
   - Tente executar uma operação que gera notificação

### ❌ "Command not found: python3"

**Sintoma:** Erro ao executar o script Python.

**Solução:**
```bash
# Verifique se Python 3 está instalado
which python3

# Se não estiver, instale:
# macOS:
brew install python3

# Linux:
sudo apt-get install python3
```

### ❌ "Command not found: say"

**Sintoma:** No macOS, comando `say` não encontrado.

**Solução:**

O comando `say` é nativo do macOS. Se não estiver disponível:

1. **Verifique a versão do macOS** (deve ser 10.7+)
2. **Use comando customizado**:
   ```bash
   echo '{"speech_command": "afplay /System/Library/Sounds/Glass.aiff"}' > \
     ~/.claude/audio_notifications.json
   ```

### ❌ No Linux: "Command not found: spd-say"

**Solução - Instale speech-dispatcher:**

```bash
# Ubuntu/Debian
sudo apt-get install speech-dispatcher

# Fedora
sudo dnf install speech-dispatcher

# Arch
sudo pacman -S speech-dispatcher
```

**Ou use espeak:**
```bash
# Ubuntu/Debian
sudo apt-get install espeak

# Fedora
sudo dnf install espeak

# Arch
sudo pacman -S espeak
```

### ❌ Hook executa mas não ouve nada

**Sintoma:** Script executa sem erro, mas não ouve o áudio.

**Possíveis causas:**

1. **Volume do sistema está mudo**
   - Verifique o volume do macOS/Linux

2. **Saída de áudio errada**
   - Verifique as configurações de som do sistema
   - Certifique-se de que a saída está nos alto-falantes corretos

3. **Script está em background e morrendo**
   - O script roda em background (`>/dev/null 2>&1 &`)
   - Pode morrer antes de completar

**Solução temporária para debug:**
```bash
# Edite audio_notification_hook.sh
# Remova o redirecionamento para debug:
cat | python3 "${CLAUDE_PLUGIN_ROOT}/hooks/audio_notification_hook.py"
```

### ❌ "Operation timed out"

**Sintoma:** Script falha com timeout.

**Causa:** Comando de áudio demorou mais de 10 segundos.

**Solução:**
```python
# Edite audio_notification_hook.py
# Linha 77, aumente o timeout:
subprocess.run(speech_command + [message], check=True, timeout=30)
```

## Configuração Customizada

Crie ou edite `~/.claude/audio_notifications.json`:

```json
{
  "audio_off": false,
  "speech_command": "say -v Samantha"
}
```

**Opções:**

- `audio_off`: `true` para desabilitar, `false` para habilitar
- `speech_command`: Comando customizado de áudio

**Exemplos de comandos customizados:**

```json
// macOS - Voz diferente
{"speech_command": "say -v Alex"}

// macOS - Velocidade diferente
{"speech_command": "say -r 200"}

// Linux - espeak
{"speech_command": "espeak"}

// Linux - spd-say com voz
{"speech_command": "spd-say -t female1"}

// Som simples (macOS)
{"speech_command": "afplay /System/Library/Sounds/Glass.aiff"}
```

## Debug Avançado

### Habilitar logs

Edite `audio_notification_hook.sh` para capturar erros:

```bash
#!/bin/bash
set -e

LOG_FILE="$HOME/.claude/audio_hook.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "[$(date)] Hook triggered" >> "$LOG_FILE"

cat | python3 "${CLAUDE_PLUGIN_ROOT}/hooks/audio_notification_hook.py" \
  >> "$LOG_FILE" 2>&1 &

exit 0
```

Depois verifique os logs:
```bash
tail -f ~/.claude/audio_hook.log
```

### Testar o hook completo

```bash
# Teste com o wrapper bash
echo '{"message": "Test notification", "hook_event_name": "Notification"}' | \
  plugins/audio-notifications/hooks/audio_notification_hook.sh

# Aguarde 1-2 segundos para o processo em background completar
sleep 2
```

### Verificar processos em background

```bash
# Verifique se o Python está rodando
ps aux | grep audio_notification_hook.py

# Se encontrar processos antigos travados, mate-os:
pkill -f audio_notification_hook.py
```

## Checklist de Verificação

Use esta checklist para verificar tudo:

- [ ] Scripts estão executáveis (`chmod +x`)
- [ ] Comando de áudio está disponível (`which say`)
- [ ] Teste manual funciona (comando `echo | python3...`)
- [ ] Config não está desabilitando (`audio_off: false`)
- [ ] Plugin está na pasta correta (`plugins/audio-notifications/`)
- [ ] `hooks.json` está correto (evento "Notification")
- [ ] Volume do sistema não está mudo
- [ ] Python 3 está instalado (`which python3`)

## Suporte

Se o problema persistir:

1. **Colete informações:**
   ```bash
   # Sistema
   uname -a

   # Python
   python3 --version

   # Comando de áudio
   which say || which spd-say || which espeak

   # Permissões
   ls -l plugins/audio-notifications/hooks/

   # Config
   cat ~/.claude/audio_notifications.json 2>/dev/null || echo "No config"
   ```

2. **Teste simples:**
   ```bash
   say "This is a test"  # macOS
   # ou
   spd-say "This is a test"  # Linux
   ```

3. **Verifique os logs do Claude Code** para mensagens de erro relacionadas aos hooks

## Desabilitar Temporariamente

Para desabilitar o áudio temporariamente sem remover o plugin:

```bash
echo '{"audio_off": true}' > ~/.claude/audio_notifications.json
```

Para reabilitar:

```bash
echo '{"audio_off": false}' > ~/.claude/audio_notifications.json
```

Ou simplesmente remova o arquivo de config para usar os padrões.
