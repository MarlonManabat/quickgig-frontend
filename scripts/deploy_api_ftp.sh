#!/usr/bin/env bash
set -euo pipefail
: "${FTP_SERVER:?}"; : "${FTP_PORT:?}"; : "${FTP_USERNAME:?}"; : "${FTP_PASSWORD:?}"; : "${HOSTINGER_SERVER_DIR:?}"
test -d api || { echo "api/ not found"; exit 1; }
lftp -e "
  set ftp:ssl-allow true;
  set ftp:ssl-force true;
  set ftp:passive-mode true;
  set net:max-retries 2;
  set net:timeout 30;
  mkdir -p ${HOSTINGER_SERVER_DIR};
  mirror -R --delete --only-newer --verbose api/ ${HOSTINGER_SERVER_DIR};
  bye
" -u "$FTP_USERNAME","$FTP_PASSWORD" -p "$FTP_PORT" "$FTP_SERVER"
