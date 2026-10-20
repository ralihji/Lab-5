# SEG3502 · Laboratoire 5 · Persistance avec Cloud Firestore

Application Angular **Employee** : le formulaire **Employee Entry Form** enregistre chaque employé dans
**Cloud Firestore** (collection `employees`) et le bouton **Employee List** affiche dans un tableau tous les
employés enregistrés.

| Membre | Numéro étudiant | Rôle |
|---|---|---|
| Brayan Adou | 300433616 | Interface : HTML, CSS et design, README et rapport |
| Hjiyej Andaloussi Elghali | 300379897 | Logique : service Firestore, configuration Firebase, tests |

## Installer et exécuter

Prérequis : **Node.js 18.19+, 20.11+ ou 22+** (`node -v`), npm (fourni avec Node.js) et Git.
Une connexion Internet est nécessaire, car les données sont lues et écrites dans Firestore.

```bash
git clone https://github.com/ralihji/Lab-5.git
cd Lab-5/SEG3502_Lab5
npm install
npm start          # ou : npx ng serve
```

Ouvrir ensuite <http://localhost:4200/>, remplir le formulaire, cliquer sur **Submit**, puis sur
**Employee List**. Arrêter le serveur avec `Ctrl + C`.

Tests et version de production :

```bash
npx ng test --watch=false   # 10 tests
npx ng build                # version de production dans dist/employee-app/
```

### Configuration Firebase

La configuration Web du projet Firebase de l'équipe (`seg3502lab5-34327`) est déjà dans
`src/environments/environment.ts` et `src/environments/environment.development.ts`.
Pour utiliser un autre projet Firebase, remplacer ces valeurs par celles de votre application Web
(console Firebase > Paramètres du projet > Vos applications) et créer la base Firestore (mode test).

## Travail réalisé (exercice du lab 5)

1. **Persistance dans Cloud Firestore** : `EmployeeService.addEmployee()` enregistre chaque employé soumis
   dans la collection `employees` (`addDoc`). La date de naissance est stockée comme `Timestamp`.
2. **Récupération et affichage** : `EmployeeService.$` lit tous les employés de la collection
   (`collectionData`, triés par nom). Le bouton **Employee List** ouvre `/employees`, qui les affiche dans
   le tableau. Le composant lit ce flux **une seule fois** (`employees$`) ; appeler le getter directement
   dans le template créait un nouvel Observable à chaque détection de changements et bloquait la page.

| Fichier | Rôle |
|---|---|
| `app.config.ts` | Fournisseurs Firebase et Firestore (`provideFirebaseApp`, `provideFirestore`) |
| `service/employee.service.ts` | Écriture (`addDoc`) et lecture (`collectionData`) dans la collection `employees` |
| `model/employee.ts` | Modèle `Employee` avec le champ `id` (identifiant du document Firestore) |
| `employee/*` | Formulaire, validation, attente de l'enregistrement, message d'erreur |
| `employees/*` | Tableau des employés, liste vide, chargement, fiches sur téléphone |
| `app.component.*` | Bandeau du haut, `<router-outlet>`, pied de page |
| `styles.css` | Couleurs (variables CSS), police Barlow, boutons, carte blanche, focus clavier |

## Interface (HTML et CSS)

- Bandeau foncé commun aux deux pages, avec le rappel « Cloud Firestore » (source des données).
- Formulaire dans une carte blanche, en deux colonnes ; astérisque rouge pour les champs obligatoires,
  étiquette « optional » pour les autres, préfixe `$` pour le salaire.
- Bord rouge et message sous le champ quand une entrée est invalide, bord vert quand elle est valide ;
  le bouton **Submit** reste désactivé tant que le formulaire est invalide.
- Tableau : en-tête foncé, lignes alternées, numéro de ligne, salaire formaté (`CurrencyPipe`),
  « Not provided » pour un champ facultatif vide, email cliquable (`mailto:`), nombre d'employés.
- La date est affichée en UTC (`date: 'd/MMM/y' : 'UTC'`) : une date `aaaa-mm-jj` est enregistrée à
  minuit UTC, et sans cela le tableau affichait la veille à Ottawa.
- Message « No employees saved yet » si la collection est vide, indicateur de chargement en attendant
  Firestore.
- Sur téléphone (moins de 640 px) : formulaire sur une colonne, boutons pleine largeur, chaque ligne du
  tableau devient une fiche.
- Bootstrap n'est plus chargé (`angular.json`) : tout le style est dans nos propres feuilles CSS.
