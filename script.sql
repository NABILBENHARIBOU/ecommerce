CREATE DATABASE ecommerce_open;
USE ecommerce_open;

-- =======================
-- TABLES DE REFERENCE
-- =======================
CREATE TABLE TypeUtilisateur (
    id_type INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

CREATE TABLE StatutCommande (
    id_statut INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);


CREATE TABLE ModePaiement (
    id_mode INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

CREATE TABLE TypeAdresse (
    id_type INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

-- =======================
-- UTILISATEUR
-- =======================
CREATE TABLE Utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    id_type INT,
    FOREIGN KEY (id_type) REFERENCES TypeUtilisateur(id_type) ON DELETE SET NULL
);

-- =======================
-- ADRESSE
-- =======================
CREATE TABLE Adresse (
    id_adresse INT AUTO_INCREMENT PRIMARY KEY,
    rue VARCHAR(200) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(20),
    pays VARCHAR(100) NOT NULL,
    id_type INT,
    id_utilisateur INT,
    FOREIGN KEY (id_type) REFERENCES TypeAdresse(id_type) ON DELETE SET NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- =======================
-- CATEGORIE
-- =======================
CREATE TABLE Categorie (
    id_categorie INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- =======================
-- PRODUIT
-- =======================
CREATE TABLE Produit (
    id_produit INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

-- Relation N-N Produit - Catégorie
CREATE TABLE ProduitCategorie (
    id_produit INT,
    id_categorie INT,
    PRIMARY KEY (id_produit, id_categorie),
    FOREIGN KEY (id_produit) REFERENCES Produit(id_produit) ON DELETE CASCADE,
    FOREIGN KEY (id_categorie) REFERENCES Categorie(id_categorie) ON DELETE CASCADE
);

-- =======================
-- COMMANDE
-- =======================
CREATE TABLE Commande (
    id_commande INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    id_utilisateur INT,
    id_adresse INT,
    id_statut INT,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_adresse) REFERENCES Adresse(id_adresse) ON DELETE SET NULL,
    FOREIGN KEY (id_statut) REFERENCES StatutCommande(id_statut) ON DELETE SET NULL
);

-- =======================
-- LIGNE DE COMMANDE
-- =======================
CREATE TABLE LigneCommande (
    id_ligne INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT,
    id_produit INT,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_commande) REFERENCES Commande(id_commande) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES Produit(id_produit) ON DELETE CASCADE
);

-- =======================
-- PAIEMENT
-- =======================
CREATE TABLE Paiement (
    id_paiement INT AUTO_INCREMENT PRIMARY KEY,
    montant DECIMAL(10,2) NOT NULL,
    date_paiement DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_mode INT,
    id_commande INT UNIQUE,
    FOREIGN KEY (id_mode) REFERENCES ModePaiement(id_mode) ON DELETE SET NULL,
    FOREIGN KEY (id_commande) REFERENCES Commande(id_commande) ON DELETE CASCADE
);

-- =======================
-- PANIER
-- =======================
CREATE TABLE Panier (
    id_panier INT AUTO_INCREMENT PRIMARY KEY,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INT UNIQUE,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);

CREATE TABLE Panier_Produit (
    id_panier INT,
    id_produit INT,
    quantite INT DEFAULT 1,
    PRIMARY KEY (id_panier, id_produit),
    FOREIGN KEY (id_panier) REFERENCES Panier(id_panier) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES Produit(id_produit) ON DELETE CASCADE
);
