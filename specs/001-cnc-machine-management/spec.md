# Feature Specification: Système de Gestion des Machines CNC

**Feature Branch**: `001-cnc-machine-management`  
**Created**: 2025-11-20  
**Status**: Draft  
**Input**: Site web de gestion des machines CNC avec login, gestion des utilisateurs (Admin, Utilisateur, Contrôleur), page principale avec grille des machines, gestion des clients et création de machines

## Clarifications

### Session 2025-11-20

- Q: Which authentication method should be used for user login? → A: Username/password with bcrypt/argon2 hashing
- Q: How long should user sessions remain active during inactivity? → A: 1 hour (convenience focused)
- Q: How should the system handle concurrent edits to the same record? → A: Last-write-wins with warning notification
- Q: What should happen when attempting to delete a client with associated machines? → A: Block deletion with error message (no cascade delete, client is never deleted when deleting a machine)
- Q: What format should the machine Type field use? → A: Free text field (no restrictions)
- Q: Should administrators set passwords when creating users? → A: Yes, password field required in user creation form

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Connexion Administrateur et Accès Initial (Priority: P1)

L'administrateur se connecte au portail Huron avec des identifiants pré-configurés pour accéder au système de gestion des machines CNC.

**Why this priority**: La connexion est le point d'entrée essentiel. Sans authentification fonctionnelle, aucune autre fonctionnalité n'est accessible. C'est la base du système de sécurité.

**Independent Test**: Peut être testé en tentant de se connecter avec les identifiants administrateur pré-configurés et en vérifiant l'accès à la page d'accueil du portail.

**Acceptance Scenarios**:

1. **Given** un utilisateur sur la page de connexion, **When** il entre les identifiants administrateur valides, **Then** il est redirigé vers la page principale du portail
2. **Given** un utilisateur sur la page de connexion, **When** il entre des identifiants invalides, **Then** un message d'erreur s'affiche en français
3. **Given** un administrateur connecté, **When** il ferme son navigateur et revient au site dans l'heure, **Then** sa session reste active
4. **Given** un utilisateur inactif pendant plus d'une heure, **When** il tente d'effectuer une action, **Then** il est redirigé vers la page de connexion

---

### User Story 2 - Consultation de la Liste des Machines (Priority: P1)

Les utilisateurs authentifiés peuvent consulter la liste complète des machines CNC dans une grille affichant le numéro #OL, le type de machine et le nom du client associé.

**Why this priority**: C'est la fonctionnalité principale du système. La visualisation des machines est le cas d'usage primaire pour tous les rôles utilisateur.

**Independent Test**: Après connexion, accéder à la page principale et vérifier que la grille affiche les machines existantes avec toutes les colonnes requises (Numéro #OL, Type, Nom du client).

**Acceptance Scenarios**:

1. **Given** un utilisateur authentifié sur la page principale, **When** la page se charge, **Then** une grille affiche toutes les machines disponibles avec les colonnes: Numéro #OL, Type, Nom du client
2. **Given** un utilisateur consultant la grille, **When** aucune machine n'existe, **Then** un message informatif s'affiche indiquant qu'aucune machine n'est enregistrée
3. **Given** un utilisateur avec le rôle Utilisateur, **When** il consulte la grille, **Then** il peut uniquement visualiser les données sans possibilité de modification

---

### User Story 3 - Gestion des Clients (Priority: P2)

Les utilisateurs autorisés peuvent créer, modifier et consulter les informations des clients pour associer les machines aux bonnes entreprises.

**Why this priority**: Les clients sont nécessaires pour créer des machines (relation de dépendance), mais la consultation des machines peut fonctionner avec des clients existants. C'est une fonctionnalité support essentielle.

**Independent Test**: Accéder à la page de gestion des clients et vérifier la création, modification et consultation des informations client selon les permissions de rôle.

**Acceptance Scenarios**:

1. **Given** un administrateur sur la page de gestion des clients, **When** il clique sur "Ajouter un client", **Then** un formulaire s'affiche avec les champs: Nom de la compagnie, Adresse complète, Ville, Province, Code postal, Téléphone, Email, Personne-ressource
2. **Given** un administrateur remplissant le formulaire client, **When** il soumet les informations valides, **Then** le client est créé et apparaît dans la liste
3. **Given** un contrôleur sur la page des clients, **When** il modifie les informations d'un client existant, **Then** les changements sont sauvegardés et visibles immédiatement
4. **Given** un utilisateur (lecture seule) sur la page des clients, **When** il consulte la liste, **Then** il ne voit pas les boutons d'ajout, modification ou suppression

---

### User Story 4 - Création et Modification de Machines CNC (Priority: P2)

Les utilisateurs autorisés (Admin et Contrôleur) peuvent créer et modifier des machines en saisissant les informations requises et en les associant à un client existant.

**Why this priority**: La création et modification de machines sont des fonctionnalités opérationnelles clés, mais nécessitent que les clients soient déjà en place. Elles complètent le cycle de gestion des données.

**Independent Test**: Naviguer vers la page de création de machine, remplir le formulaire avec les données requises et vérifier que la machine apparaît dans la grille principale.

**Acceptance Scenarios**:

1. **Given** un administrateur ou contrôleur sur la page de création de machine, **When** il accède au formulaire, **Then** il voit les champs: Numéro #OL, Type, Client (liste déroulante avec recherche)
2. **Given** un utilisateur remplissant le formulaire de machine, **When** il sélectionne un client dans la liste déroulante, **Then** une fonction de recherche permet de filtrer les clients par nom
3. **Given** un utilisateur sur le formulaire de création, **When** il clique dans le champ Type, **Then** il peut saisir n'importe quel texte libre pour décrire le type de machine
4. **Given** un administrateur soumettant une nouvelle machine, **When** toutes les informations sont valides, **Then** la machine est créée et apparaît immédiatement dans la grille principale
5. **Given** un utilisateur soumettant le formulaire, **When** le numéro #OL existe déjà, **Then** un message d'erreur s'affiche indiquant que ce numéro est déjà utilisé
6. **Given** un utilisateur soumettant le formulaire avec des champs vides, **When** il clique sur soumettre, **Then** des messages de validation s'affichent en français pour chaque champ requis
7. **Given** un administrateur ou contrôleur consultant la grille, **When** il clique sur une machine existante, **Then** il peut modifier les informations (Numéro #OL, Type, Client)
8. **Given** un contrôleur modifiant une machine, **When** il sauvegarde les changements, **Then** les modifications sont enregistrées et visibles immédiatement dans la grille
9. **Given** un contrôleur créant une machine, **When** il tente de la supprimer après création, **Then** l'action est refusée (seul l'admin peut supprimer)

---

### User Story 5 - Gestion des Utilisateurs (Priority: P3)

L'administrateur peut créer, modifier et supprimer des utilisateurs du système avec différents niveaux d'accès (Admin, Utilisateur, Contrôleur).

**Why this priority**: Nécessaire pour la gestion à long terme du système, mais un utilisateur admin initial suffit pour démarrer. C'est une fonctionnalité administrative secondaire.

**Independent Test**: Se connecter en tant qu'administrateur, accéder à la page de gestion des utilisateurs et vérifier la création d'un nouvel utilisateur avec attribution de rôle.

**Acceptance Scenarios**:

1. **Given** un administrateur sur la page de gestion des utilisateurs, **When** il clique sur "Ajouter un utilisateur", **Then** un formulaire s'affiche avec les champs: Nom, UserName, Email, Mot de passe, Rôle (Admin, Utilisateur, Contrôleur)
2. **Given** un administrateur créant un utilisateur, **When** il remplit tous les champs incluant le mot de passe, **Then** le mot de passe est haché avant d'être stocké dans la base de données
3. **Given** un administrateur créant un utilisateur, **When** il sélectionne le rôle "Utilisateur", **Then** cet utilisateur aura un accès en lecture seule sur toutes les pages
4. **Given** un administrateur créant un utilisateur, **When** il sélectionne le rôle "Contrôleur", **Then** cet utilisateur pourra ajouter/modifier mais pas supprimer des machines
5. **Given** un administrateur sur la liste des utilisateurs, **When** il clique sur supprimer, **Then** l'utilisateur est retiré du système après confirmation
6. **Given** un administrateur modifiant un utilisateur, **When** il change le rôle d'Utilisateur à Contrôleur, **Then** les permissions sont mises à jour immédiatement

---

### User Story 6 - Suppression de Machines (Priority: P3)

L'administrateur peut supprimer des machines du système lorsqu'elles ne sont plus pertinentes ou ont été retirées du service.

**Why this priority**: Fonctionnalité de maintenance importante mais non critique pour le fonctionnement quotidien. La plupart des opérations concernent la consultation et l'ajout.

**Independent Test**: Se connecter en tant qu'administrateur, sélectionner une machine dans la grille et vérifier qu'elle peut être supprimée avec confirmation.

**Acceptance Scenarios**:

1. **Given** un administrateur consultant la grille des machines, **When** il sélectionne une machine et clique sur supprimer, **Then** une confirmation est demandée avant suppression
2. **Given** un administrateur confirmant la suppression, **When** il valide l'action, **Then** la machine est retirée de la base de données et disparaît de la grille
3. **Given** un contrôleur consultant la grille, **When** il tente d'accéder à la fonction de suppression, **Then** le bouton n'est pas visible ou l'action est interdite
4. **Given** un utilisateur (lecture seule) consultant la grille, **When** il visualise les machines, **Then** aucune option de suppression n'est disponible

---

### Edge Cases

- Que se passe-t-il lorsqu'un administrateur tente de supprimer le dernier compte administrateur du système?
- **Suppression client avec machines**: Si un administrateur tente de supprimer un client qui a des machines associées, le système bloque l'opération et affiche un message d'erreur indiquant le nombre de machines liées. L'administrateur doit d'abord supprimer ou réassigner toutes les machines avant de pouvoir supprimer le client.
- **Modification simultanée**: Si deux utilisateurs modifient la même machine, le dernier enregistrement écrase le premier, mais le système affiche un avertissement au deuxième utilisateur indiquant que des modifications récentes ont été effectuées
- Comment le système réagit-il lorsqu'un utilisateur reste inactif pendant une longue période?
- Que se passe-t-il si le numéro #OL d'une machine est dupliqué lors de la création?
- Comment le système gère-t-il les caractères spéciaux dans les noms de clients ou de machines?
- Que se passe-t-il lorsqu'un utilisateur avec des machines créées est supprimé du système?

## Requirements *(mandatory)*

### Functional Requirements

#### Authentification et Sécurité

- **FR-001**: Le système DOIT fournir une page de connexion en français avec champs Username et Mot de passe
- **FR-002**: Le système DOIT inclure un compte administrateur pré-configuré pour l'accès initial
- **FR-002a**: Le système DOIT stocker les mots de passe avec hachage sécurisé (bcrypt ou argon2)
- **FR-003**: Le système DOIT maintenir des sessions utilisateur sécurisées avec expiration automatique après 1 heure d'inactivité
- **FR-004**: Le système DOIT afficher tous les messages d'erreur de connexion en français
- **FR-005**: Le système DOIT implémenter trois niveaux de rôles: Admin, Utilisateur (lecture seule), Contrôleur

#### Gestion des Utilisateurs

- **FR-006**: Les administrateurs DOIVENT pouvoir créer des utilisateurs avec les champs: Nom, UserName, Email, Mot de passe, Rôle
- **FR-006a**: Le champ Mot de passe DOIT être obligatoire lors de la création d'un utilisateur et haché avec bcrypt ou argon2 avant stockage
- **FR-007**: Les administrateurs DOIVENT pouvoir supprimer des utilisateurs existants
- **FR-008**: Les administrateurs DOIVENT pouvoir modifier le rôle d'un utilisateur existant
- **FR-009**: Le système DOIT valider l'unicité des UserName et Email lors de la création d'utilisateur
- **FR-010**: Le système DOIT empêcher la suppression du dernier compte administrateur

#### Gestion des Machines CNC

- **FR-011**: Le système DOIT afficher une grille principale listant toutes les machines avec les colonnes: Numéro #OL, Type, Nom du client
- **FR-012**: Les administrateurs et contrôleurs DOIVENT pouvoir ajouter des machines via un formulaire avec: Numéro #OL, Type, Client
- **FR-012a**: Le champ Type DOIT être un champ texte libre permettant la saisie de tout type de machine CNC sans restriction
- **FR-012b**: Le système DOIT fournir une page/formulaire dédiée pour la création de machines accessible depuis le menu principal ou la grille
- **FR-012c**: Tous les champs du formulaire de création (Numéro #OL, Type, Client) DOIVENT être obligatoires avec validation
- **FR-012d**: Les administrateurs et contrôleurs DOIVENT pouvoir modifier les machines existantes (Numéro #OL, Type, Client)
- **FR-013**: Le champ Client DOIT être une liste déroulante avec fonction de recherche permettant de filtrer les clients par nom
- **FR-014**: Les administrateurs DOIVENT pouvoir supprimer des machines de la grille
- **FR-015**: Les contrôleurs NE DOIVENT PAS pouvoir supprimer des machines
- **FR-016**: Les utilisateurs avec rôle "Utilisateur" DOIVENT avoir un accès en lecture seule (aucune action de création/modification/suppression)
- **FR-017**: Le système DOIT valider l'unicité du Numéro #OL lors de la création et modification d'une machine
- **FR-018**: Le système DOIT afficher un message informatif lorsque aucune machine n'existe dans la base de données

#### Gestion des Clients

- **FR-019**: Le système DOIT fournir une page de gestion des clients accessible depuis le menu principal
- **FR-020**: Les administrateurs DOIVENT pouvoir créer des clients avec les champs: Nom de la compagnie, Adresse complète, Ville, Province, Code postal, Téléphone, Email, Personne-ressource
- **FR-021**: Les administrateurs DOIVENT pouvoir modifier toutes les informations d'un client existant
- **FR-022**: Les administrateurs DOIVENT pouvoir supprimer des clients
- **FR-023**: Les contrôleurs DOIVENT pouvoir créer et modifier des clients mais PAS les supprimer
- **FR-024**: Les utilisateurs avec rôle "Utilisateur" DOIVENT avoir un accès en lecture seule sur la page des clients
- **FR-025**: Le système DOIT bloquer la suppression d'un client ayant des machines associées et afficher un message d'erreur indiquant le nombre de machines liées
- **FR-025a**: La suppression d'une machine NE DOIT JAMAIS supprimer le client associé (pas de suppression en cascade)

#### Interface Utilisateur et Localisation

- **FR-026**: Toutes les interfaces DOIVENT être en français (canadien de préférence)
- **FR-027**: Le système DOIT utiliser un design moderne, épuré et simple conforme à l'identité de marque CNC
- **FR-028**: Le système DOIT être responsive et utilisable sur desktop, tablette et mobile
- **FR-029**: Les formulaires DOIVENT afficher des messages de validation en français
- **FR-030**: Le système DOIT utiliser le format de date français (JJ/MM/AAAA)

#### Performance et Données

- **FR-031**: La grille des machines DOIT se charger en moins de 2 secondes pour jusqu'à 500 machines
- **FR-032**: Le système DOIT persister toutes les données dans Azure Cosmos DB
- **FR-033**: Le système DOIT afficher des indicateurs de chargement lors des opérations longues
- **FR-034**: Le système DOIT confirmer visuellement les actions de création, modification et suppression
- **FR-035**: Le système DOIT avertir l'utilisateur lorsqu'un enregistrement a été modifié par un autre utilisateur pendant qu'il effectuait ses propres modifications (détection de conflit avec notification)

### Key Entities

- **Utilisateur**: Représente un compte d'accès au système. Attributs: Nom, UserName, Email, Rôle (Admin/Utilisateur/Contrôleur), DateCréation
- **Machine CNC**: Représente une machine dans l'inventaire. Attributs: Numéro #OL (unique), Type (texte libre), ClientId (référence au client associé), DateCréation, CrééPar
- **Client**: Représente une entreprise cliente. Attributs: Nom de la compagnie, Adresse, Ville, Province, Code postal, Téléphone, Email, Personne-ressource, DateCréation, DernièreMiseÀJour

### Relationships

- Une Machine appartient à un seul Client (relation 1:N)
- Un Utilisateur peut créer plusieurs Machines (relation 1:N)
- Un Utilisateur peut créer plusieurs Clients (relation 1:N)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Les utilisateurs peuvent se connecter au système en moins de 10 secondes
- **SC-002**: Un administrateur peut créer un nouvel utilisateur en moins de 1 minute
- **SC-003**: La grille des machines se charge et affiche les données en moins de 2 secondes pour 500 machines
- **SC-004**: Un administrateur ou contrôleur peut créer une nouvelle machine en moins de 2 minutes
- **SC-005**: La recherche de client dans la liste déroulante retourne des résultats en temps réel (< 500ms)
- **SC-006**: Les contrôles de permission (lecture seule, création uniquement, admin complet) fonctionnent correctement à 100% des cas
- **SC-007**: Le système affiche tous les textes et messages en français sans erreur de traduction
- **SC-008**: 95% des utilisateurs peuvent accomplir leurs tâches principales sans formation (création machine, consultation) grâce à l'interface intuitive
- **SC-009**: Le système fonctionne correctement sur les navigateurs Chrome, Edge et Firefox (dernières versions)
- **SC-010**: Toutes les opérations de base de données réussissent avec un taux de succès de 99.9%
