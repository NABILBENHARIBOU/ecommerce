-- Ajoute une image par défaut au produit id 5 si image_url est NULL
-- À exécuter dans votre base de données (e.g., mysql -u user -p ecommerce_db)

UPDATE produit
SET image_url = '/uploads/1763368669820-iaas.jpg'
WHERE id_produit = 5 AND (image_url IS NULL OR image_url = '');

-- Vérifier
SELECT id_produit, nom, image_url FROM produit WHERE id_produit = 5;
