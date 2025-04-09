#!/bin/bash

echo "Sprawdzanie kontenerów..."

containers=("frontend" "backend" "database")
for name in "${containers[@]}"; do
  if docker ps --format '{{.Names}}' | grep -q "^$name$"; then
    echo "Kontener '$name' jest uruchomiony"
  else
    echo "Kontener '$name' NIE jest uruchomiony"
  fi
done

echo ""
echo "Sprawdzanie połączenia backend → database..."
docker exec backend node test-connection.js

echo ""
echo "Sprawdzanie połączenia frontend → backend (curl z kontenera)..."
docker exec frontend sh -c "apk add --no-cache curl > /dev/null && curl -s http://backend:3000/ || echo 'Brak odpowiedzi od backendu'"
