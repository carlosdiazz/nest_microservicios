# ==== DELETE ==========
docker-compose down
accion="$1"
# ==== UPDATE ==========
if [ "$accion" = "update" ]; then
  echo "[RUN IN 8 SEG] ==== UPDATE =========="
  docker rmi registry.gitlab.com/orkapi/herramientas/telegram_bot/telegram_bot:latest
fi
docker-compose up -d
