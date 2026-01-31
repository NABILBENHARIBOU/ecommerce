# API REST - Endpoints des Commandes et Paiements

## 🔗 Base URL
```
http://localhost:8080/api
```

---

## 📦 COMMANDES (`/commandes`)

### 1. Créer une commande (depuis panier)
```
POST /commandes/creer
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "idUtilisateur": 1,
  "idAdresse": 1,
  "total": 250.50,
  "lignesCommande": [
    {
      "idProduit": 1,
      "quantite": 2,
      "prixUnitaire": 75.25
    },
    {
      "idProduit": 3,
      "quantite": 1,
      "prixUnitaire": 100.00
    }
  ]
}

Response (201 Created):
{
  "idCommande": 1,
  "date": "2026-01-24T10:30:00",
  "total": 250.50,
  "idUtilisateur": 1,
  "nomUtilisateur": "John Doe",
  "emailUtilisateur": "john@example.com",
  "idAdresse": 1,
  "adresseComplete": "123 Rue de Paris, 75001 Paris, France",
  "idStatut": 1,
  "libelleStatut": "En attente",
  "lignesCommande": [
    {
      "idLigne": 1,
      "idProduit": 1,
      "nomProduit": "Produit A",
      "quantite": 2,
      "prixUnitaire": 75.25,
      "sousTotal": 150.50
    },
    {
      "idLigne": 2,
      "idProduit": 3,
      "nomProduit": "Produit C",
      "quantite": 1,
      "prixUnitaire": 100.00,
      "sousTotal": 100.00
    }
  ]
}
```

### 2. Récupérer toutes les commandes (Admin)
```
GET /commandes
Authorization: Bearer {token}

Response (200 OK):
[
  {
    "idCommande": 1,
    "date": "2026-01-24T10:30:00",
    "total": 250.50,
    "nomUtilisateur": "John Doe",
    "emailUtilisateur": "john@example.com",
    "libelleStatut": "En attente",
    "lignesCommande": [...]
  },
  ...
]
```

### 3. Récupérer une commande par ID
```
GET /commandes/{id}
Authorization: Bearer {token}

Response (200 OK):
{
  "idCommande": 1,
  "date": "2026-01-24T10:30:00",
  "total": 250.50,
  "idUtilisateur": 1,
  "nomUtilisateur": "John Doe",
  "emailUtilisateur": "john@example.com",
  "idAdresse": 1,
  "adresseComplete": "123 Rue de Paris, 75001 Paris, France",
  "idStatut": 1,
  "libelleStatut": "En attente",
  "lignesCommande": [...],
  "paiement": {
    "idPaiement": 1,
    "montant": 250.50,
    "datePaiement": "2026-01-24T10:31:00",
    "idMode": 1,
    "libelleMode": "Carte bancaire"
  }
}
```

### 4. Récupérer les commandes d'un utilisateur
```
GET /commandes/utilisateur/{userId}
Authorization: Bearer {token}

Response (200 OK):
[
  {
    "idCommande": 1,
    "date": "2026-01-24T10:30:00",
    "total": 250.50,
    "libelleStatut": "En attente",
    "lignesCommande": [...]
  },
  ...
]
```

### 5. Récupérer les commandes par statut et utilisateur
```
GET /commandes/utilisateur/{userId}/statut/{statusId}
Authorization: Bearer {token}

Response (200 OK):
[...]
```

### 6. Récupérer les commandes par statut (Admin)
```
GET /commandes/statut/{statusId}
Authorization: Bearer {token}

Response (200 OK):
[
  {
    "idCommande": 1,
    "date": "2026-01-24T10:30:00",
    "total": 250.50,
    "nomUtilisateur": "John Doe",
    "libelleStatut": "En attente",
    ...
  },
  ...
]

Statut IDs:
1 = En attente
2 = En cours
3 = Expédiée
4 = Livrée
5 = Annulée
```

### 7. Mettre à jour le statut d'une commande
```
PUT /commandes/{id}/statut/{newStatusId}
Authorization: Bearer {token}

Response (200 OK):
{
  "idCommande": 1,
  "libelleStatut": "En cours",
  ...
}
```

### 8. Supprimer une commande
```
DELETE /commandes/{id}
Authorization: Bearer {token}

Response (204 No Content)
```

---

## 💳 PAIEMENTS (`/paiements`)

### 1. Créer un paiement pour une commande
```
POST /paiements/commande/{orderId}/mode/{paymentModeId}
Authorization: Bearer {token}

Response (201 Created):
{
  "idPaiement": 1,
  "montant": 250.50,
  "datePaiement": "2026-01-24T10:31:00",
  "idMode": 1,
  "libelleMode": "Carte bancaire",
  "idCommande": 1
}

Note: Cet endpoint crée le paiement ET met à jour 
      automatiquement le statut de la commande à "En cours"

Mode IDs:
1 = Carte bancaire
2 = PayPal
3 = Virement bancaire
4 = À la livraison
```

### 2. Récupérer tous les paiements (Admin)
```
GET /paiements
Authorization: Bearer {token}

Response (200 OK):
[
  {
    "idPaiement": 1,
    "montant": 250.50,
    "datePaiement": "2026-01-24T10:31:00",
    "idMode": 1,
    "libelleMode": "Carte bancaire",
    "idCommande": 1
  },
  ...
]
```

### 3. Récupérer un paiement par ID
```
GET /paiements/{id}
Authorization: Bearer {token}

Response (200 OK):
{
  "idPaiement": 1,
  "montant": 250.50,
  "datePaiement": "2026-01-24T10:31:00",
  "idMode": 1,
  "libelleMode": "Carte bancaire",
  "idCommande": 1
}
```

### 4. Récupérer le paiement d'une commande
```
GET /paiements/commande/{orderId}
Authorization: Bearer {token}

Response (200 OK):
{
  "idPaiement": 1,
  "montant": 250.50,
  "datePaiement": "2026-01-24T10:31:00",
  "idMode": 1,
  "libelleMode": "Carte bancaire",
  "idCommande": 1
}

Response (404 Not Found):
Si aucun paiement existe pour cette commande
```

### 5. Mettre à jour un paiement
```
PUT /paiements/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "montant": 260.00,
  "modePaiement": {
    "idMode": 2
  }
}

Response (200 OK):
{
  "idPaiement": 1,
  "montant": 260.00,
  "datePaiement": "2026-01-24T10:31:00",
  "idMode": 2,
  "libelleMode": "PayPal",
  "idCommande": 1
}
```

### 6. Supprimer un paiement
```
DELETE /paiements/{id}
Authorization: Bearer {token}

Response (204 No Content)
```

---

## 📋 CODES DE RÉPONSE HTTP

| Code | Description |
|------|-------------|
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 204 | No Content - Suppression réussie |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Pas d'autorisation |
| 404 | Not Found - Ressource introuvable |
| 500 | Server Error - Erreur serveur |

---

## 🔐 AUTHENTIFICATION

Tous les endpoints requièrent un token JWT dans le header:
```
Authorization: Bearer {token}
```

Le token doit être obtenu lors de la connexion:
```
POST /api/utilisateurs/login
```

---

## ⚠️ GESTION D'ERREURS

### Erreur 400 - Données invalides
```json
{
  "timestamp": "2026-01-24T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Utilisateur non trouvé"
}
```

### Erreur 404 - Ressource introuvable
```json
{
  "timestamp": "2026-01-24T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Commande non trouvée"
}
```

### Erreur 401 - Non authentifié
```json
{
  "timestamp": "2026-01-24T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Token invalide ou expiré"
}
```

---

## 📱 EXEMPLES D'UTILISATION (JavaScript/Fetch)

### Créer une commande
```javascript
const orderData = {
  idUtilisateur: 1,
  idAdresse: 1,
  total: 250.50,
  lignesCommande: [
    { idProduit: 1, quantite: 2, prixUnitaire: 75.25 },
    { idProduit: 3, quantite: 1, prixUnitaire: 100.00 }
  ]
};

const response = await fetch('http://localhost:8080/api/commandes/creer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(orderData)
});

const order = await response.json();
console.log('Commande créée:', order.idCommande);
```

### Récupérer les commandes d'un utilisateur
```javascript
const response = await fetch(
  'http://localhost:8080/api/commandes/utilisateur/1',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const orders = await response.json();
orders.forEach(order => {
  console.log(`Commande #${order.idCommande} - ${order.libelleStatut}`);
});
```

### Créer un paiement
```javascript
const response = await fetch(
  'http://localhost:8080/api/paiements/commande/1/mode/1',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const payment = await response.json();
console.log('Paiement créé:', payment.idPaiement);
```

### Mettre à jour le statut
```javascript
const response = await fetch(
  'http://localhost:8080/api/commandes/1/statut/2',
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const updatedOrder = await response.json();
console.log('Nouveau statut:', updatedOrder.libelleStatut);
```

---

## 🔄 FLUX DE PAIEMENT RECOMMANDÉ

```
1. Utilisateur clique "Confirmer la commande"
   ↓
2. POST /commandes/creer
   - Crée la commande (statut: "En attente")
   - Crée les lignes de commande
   - Vide le panier
   ↓
3. POST /paiements/commande/{id}/mode/{mode}
   - Crée le paiement
   - Met à jour statut à "En cours"
   ↓
4. Rediriger vers /order-confirmation/{orderId}
   ↓
5. Admin: PUT /commandes/{id}/statut/3 (Expédiée)
   ↓
6. Admin: PUT /commandes/{id}/statut/4 (Livrée)
```
