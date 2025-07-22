const express = require('express');
const router = express.Router();
const db = require('./db');


// 1. GET / : liste complète
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM films');
  res.json(rows);
});

// 2. GET /:id : film par ID
router.get('/:id', async (req, res) => {
  //TODO : ECRIRE LA REQUETE PREPAREE
  const [rows] = await db.execute('SELECT * FROM films WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).send('Film non trouvé');
  res.json(rows[0]);
});

// 3. POST / : ajout d’un film
router.post('/', async (req, res) => {
  const { id, titre } = req.body;
  if (!id || !titre) return res.status(400).send('id et titre requis');

  try {
    //TODO : ECRIRE LA REQUETE PREPAREE
    await db.execute('INSERT INTO films (id, titre) VALUES (?, ?)', [id, titre]);
    res.status(201).send('Film ajouté');
  } catch (err) {
    res.status(500).send('Erreur : ' + err.message);
  }
});

// 4. PATCH /:id : modification du titre
router.patch('/:id', async (req, res) => {
  const { titre, realisateur, annee_sortie, genre, duree_minutes, note, age_film } = req.body;

  if (!titre || !realisateur || !annee_sortie || !genre || !duree_minutes || !note || !age_film) {
    return res.status(400).send('Tous les champs sont requis pour la mise à jour');
  }

  try {
    const [result] = await db.execute(
      `UPDATE films SET 
        titre = ?, 
        realisateur = ?, 
        annee_sortie = ?, 
        genre = ?, 
        duree_minutes = ?, 
        note = ?,
        age_film = ?
       WHERE id = ?`,
      [titre, realisateur, annee_sortie, genre, duree_minutes, note, age_film, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).send('Film non trouvé');
    res.send('Film mis à jour');
  } catch (err) {
    res.status(500).send('Erreur : ' + err.message);
  }
});

// 5. DELETE /:id : suppression
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM films WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).send('Film non trouvé');
    res.send('Film supprimé');
  } catch (err) {
    res.status(500).send('Erreur : ' + err.message);
  }
});


module.exports = router;
