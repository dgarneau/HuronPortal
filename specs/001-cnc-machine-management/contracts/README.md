# API Contracts Summary

This directory contains OpenAPI 3.0 specifications for all Huron Portal APIs.

## Files

- **auth.openapi.yaml** - Authentication endpoints (login, logout, session)
- **machines.openapi.yaml** - Machine CRUD operations
- **clients.openapi.yaml** - Client CRUD operations and search
- **users.openapi.yaml** - User management (Admin only)

## Key Features

### Custom Error Handling
All endpoints return French error messages with machine-readable codes:
- `INVALID_CREDENTIALS` - Identifiants invalides
- `SESSION_EXPIRED` - Session expirée  
- `FORBIDDEN_ROLE` - Permissions insuffisantes
- `VALIDATION_ERROR` - Erreur de validation avec détails par champ
- `DUPLICATE_*` - Contrainte d'unicité violée
- `CONCURRENT_MODIFICATION` - Modification concurrente détectée

### Custom Validation
All validation errors include field-specific messages in French:
```json
{
  "error": "Données invalides",
  "code": "VALIDATION_ERROR",
  "details": {
    "numeroOL": ["Ce champ est requis"],
    "type": ["Minimum 1 caractères requis"],
    "clientId": ["Client invalide"]
  }
}
```

### Role-Based Access
- **Admin**: Full access (CRUD all entities)
- **Contrôleur**: Create/Edit machines and clients, no delete
- **Utilisateur**: Read-only access

### Concurrency Control
All PUT requests support `_etag` for optimistic concurrency:
- Include `_etag` in request body
- 412 Precondition Failed if mismatch
- French error message with guidance

## Testing

Use these contracts with:
- **Postman/Insomnia**: Import YAML for API testing
- **OpenAPI Generator**: Generate client SDKs
- **Swagger UI**: Interactive API documentation
