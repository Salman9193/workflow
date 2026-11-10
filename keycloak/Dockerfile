FROM quay.io/keycloak/keycloak:26.0

# Copy the realm definition (client, roles, test user) so it's auto-imported on first boot.
COPY realm-export.json /opt/keycloak/data/import/realm-export.json

# Admin credentials are passed via environment at runtime (docker-compose),
# not baked in here — avoids secrets living in the image itself.

# Build an optimized image (recommended by Keycloak for anything beyond quick local testing)
RUN /opt/keycloak/bin/kc.sh build

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm"]

