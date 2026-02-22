import { useState } from 'react';
import api from '../../services/api';

export default function AjouterModePaiement() {
  const [libelle, setLibelle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/modes-paiement', { libelle });
      setMessage('Mode de paiement ajouté avec succès !');
      setLibelle('');
    } catch (err) {
      setMessage("Erreur lors de l'ajout");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Ajouter un mode de paiement</h2>
      <input
        type="text"
        value={libelle}
        onChange={e => setLibelle(e.target.value)}
        placeholder="Libellé du mode de paiement"
        required
        style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>Ajouter</button>
      {message && <div style={{ marginTop: '1rem' }}>{message}</div>}
    </form>
  );
}
