import AjouterModePaiement from '../../components/admin/AjouterModePaiement';
import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminModesPaiementPage() {
  const [modes, setModes] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    api.get('/api/modes-paiement').then(setModes);
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce mode de paiement ?')) {
      await api.del(`/api/modes-paiement/${id}`);
      setRefresh(r => !r);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Gestion des modes de paiement</h1>
      <AjouterModePaiement />
      <h3 style={{ marginTop: '2rem' }}>Liste des modes de paiement</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {modes.map(mode => (
          <li key={mode.id_mode} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ flex: 1 }}>{mode.libelle}</span>
            <button onClick={() => handleDelete(mode.id_mode)} style={{ color: 'red', marginLeft: 8 }}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
