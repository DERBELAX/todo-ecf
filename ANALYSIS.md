# Audit de Testabilité – Projet TodoList

## Classification des fichiers

| Fichier/Classe                             | Type de test recommandé     | Outils utilisables                   | Justification                                                                 | Priorité |
|-------------------------------------------|-----------------------------|--------------------------------------|-------------------------------------------------------------------------------|----------|
| `src/controllers/todoController.js`       | Unitaire + Mock             | Jest                                 | Gère la logique métier principale : création, modification, lecture de todos | 1     |
| `front/src/services/api.js`               | Unitaire + Stub             | Jest                                 | Contient les appels `fetch` à l’API, à isoler pour les tests                  |  1     |
| `front/src/utils/validateTodo.js`         | Unitaire                    | Jest                                 | Fonction pure, facilement testable                                           | 1     |
| `src/routes/todoRoutes.js`                | Intégration                 | Jest + Supertest                     | Définit les endpoints REST                                                   | 2     |
| `front/src/components/AddTodoForm.js`     | Unitaire                    | RTL + Jest                           | Gère l'ajout de tâche, interaction utilisateur                                | 2     |
| `front/src/components/TodoItem.js`        | Unitaire                    | RTL + Jest                           | Composant React simple, interactions testables                                |  2     |
| `front/src/components/TodoList.js`        | Intégration UI              | RTL + Jest                           | Coordonne les appels API + rendu liste                                       | 2     |
| `src/middlewares/authMiddleware.js`       | Unitaire + Mock             | Jest                                 | Middleware dépendant du header JWT                                           |  2     |
| `src/models/Todo.js`                      | Intégration                 | Jest + MongoMemoryServer             | Définit le schéma de Todo avec validation                                    |  3     |
| `src/config/db.js`                        | Intégration + Mock          | Jest                                 | Gère la connexion Mongo — à mocker pour isoler                               | 3     |

## Stratégie de tests

### Priorité 1 – Tests immédiats

| Cible                          | Raison                                                                                                                                 |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `todoController.js`           | Cœur métier (getAll, create, update), facile à mocker                                                                                 |
| `api.js`                      | Fichier critique pour communication backend, nécessite stubs de `fetch`                                                               |
| `validateTodo.js`             | Fonctions pures à tester rapidement                                                                                                   |

### Priorité 2 – Tests importants

| Cible                    | Raison                                                                                             |
|-------------------------|----------------------------------------------------------------------------------------------------|
| `AddTodoForm.js`        | Teste l’envoi de données utilisateurs                                                              |
| `TodoList.js`           | Combine logique, appels API, et rendu                                                              |
| `todoRoutes.js`         | Vérifie bout-à-bout les endpoints REST                                                             |
| `TodoItem.js`           | Composant avec interaction utilisateur                                                             |

### Priorité 3 – Tests avancés

| Cible              | Raison                                                                                  |
|-------------------|-----------------------------------------------------------------------------------------|
| `Todo.js`         | Nécessite test de persistance                                                           |
| `db.js`           | Connecte à MongoDB, complexe à mocker car side-effect                                   |

## Difficultés techniques rencontrées

| Défi technique                                    | Solution apportée                                                      |
|--------------------------------------------------|-------------------------------------------------------------------------|
| Appels à `fetch` dans `api.js`                   | Stub avec `global.fetch`                                               |
| Middleware JWT dépendant des headers             | Non testé (hors scope)                                                 |
| `mongoose.connect` impossible à mocker complètement | Tests isolés dans fichiers simples, pas d'assertion sur connect()      |
| Tests Express + Mongo                            | Utilisation de `mongodb-memory-server` + `supertest`                   |

