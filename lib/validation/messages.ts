// French validation error messages dictionary

export const messages = {
  // Common validation
  required: 'Ce champ est requis',
  invalid: 'Valeur invalide',
  
  // String validation
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  
  // Email validation
  email: 'Adresse courriel invalide',
  
  // Password validation
  password: {
    required: 'Le mot de passe est requis',
    minLength: 'Le mot de passe doit contenir au moins 8 caractères',
    maxLength: 'Le mot de passe ne peut pas dépasser 128 caractères',
  },
  
  // User validation
  user: {
    usernameRequired: 'Le nom d\'utilisateur est requis',
    usernameMin: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
    usernameMax: 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères',
    usernameFormat: 'Le nom d\'utilisateur ne peut contenir que des lettres minuscules, chiffres, points, traits d\'union et underscores',
    nameRequired: 'Le nom complet est requis',
    nameMax: 'Le nom ne peut pas dépasser 100 caractères',
    emailRequired: 'Le courriel est requis',
    emailInvalid: 'Adresse courriel invalide',
    emailMax: 'Le courriel ne peut pas dépasser 100 caractères',
    roleRequired: 'Le rôle est requis',
    roleInvalid: 'Rôle invalide. Choisir: Admin, Contrôleur ou Utilisateur',
    duplicateUsername: (username: string) => `Le nom d'utilisateur "${username}" est déjà utilisé. Veuillez en choisir un autre.`,
    duplicateEmail: (email: string) => `Le courriel "${email}" est déjà utilisé. Veuillez en choisir un autre.`,
  },
  
  // Machine validation
  machine: {
    numeroOLRequired: 'Le numéro #OL est requis',
    numeroOLMax: 'Le numéro #OL ne peut pas dépasser 50 caractères',
    numeroOLFormat: 'Le numéro #OL ne peut contenir que des lettres majuscules, chiffres et tirets',
    duplicateOL: (numeroOL: string) => `Le numéro #OL "${numeroOL}" existe déjà`,
    typeRequired: 'Le type de machine est requis',
    typeMax: 'Le type ne peut pas dépasser 200 caractères',
    clientRequired: 'Le client est requis',
    clientInvalid: 'Client invalide',
  },
  
  // Client validation
  client: {
    companyNameRequired: 'Le nom de l\'entreprise est requis',
    companyNameMax: 'Le nom de l\'entreprise ne peut pas dépasser 200 caractères',
    addressRequired: 'L\'adresse est requise',
    addressMax: 'L\'adresse ne peut pas dépasser 300 caractères',
    provinceRequired: 'La province est requise',
    provinceInvalid: 'Province invalide',
    postalCodeRequired: 'Le code postal est requis',
    postalCodeFormat: 'Format de code postal invalide (A1A 1A1 ou A1A1A1)',
    hasMatches: (count: number) => `Ce client a ${count} machine(s) associée(s). Veuillez d'abord supprimer ou réassigner les machines.`,
  },
  
  // Authentication
  auth: {
    invalidCredentials: 'Identifiants invalides',
    sessionExpired: 'Votre session a expiré. Veuillez vous reconnecter.',
    unauthorized: 'Authentification requise',
    forbidden: 'Accès interdit',
    forbiddenRole: (action: string) => `Vous n'avez pas les permissions nécessaires pour ${action}`,
  },
  
  // Concurrent modification
  concurrency: {
    modified: 'Cet enregistrement a été modifié par un autre utilisateur. Veuillez rafraîchir et réessayer.',
    machineModified: 'Cette machine a été modifiée par un autre utilisateur. Veuillez rafraîchir et réessayer.',
    clientModified: 'Ce client a été modifié par un autre utilisateur. Veuillez rafraîchir et réessayer.',
    userModified: 'Cet utilisateur a été modifié par un autre administrateur. Veuillez rafraîchir et réessayer.',
  },
  
  // Deletion
  deletion: {
    cannotDeleteSelf: 'Vous ne pouvez pas supprimer votre propre compte utilisateur.',
    cannotDeleteLastAdmin: 'Impossible de supprimer le dernier administrateur du système.',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet élément?',
  },
  
  // Success messages
  success: {
    created: (entity: string) => `${entity} créé avec succès`,
    updated: (entity: string) => `${entity} modifié avec succès`,
    deleted: (entity: string) => `${entity} supprimé avec succès`,
    loginSuccess: 'Connexion réussie',
    logoutSuccess: 'Déconnexion réussie',
  },
  
  // Server errors
  server: {
    error: 'Une erreur est survenue',
    unavailable: 'Le service est temporairement indisponible',
  },
};
