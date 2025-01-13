const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const  json =  require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(json());

// Conexión a SQLite
const db = new sqlite3.Database('./events.db', (err) => {
    if (err) {
        console.error('Error al conectar a SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');

        // Crear tabla 'events' si no existe
        db.run(
            `CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                date TEXT NOT NULL,
                location TEXT
            )`,
            (err) => {
                if (err) {
                    console.error('Error al crear la tabla events:', err.message);
                } else {
                    console.log('Tabla events verificada/creada correctamente');
                }
            }
        );
    }
});

// Ruta para obtener todos los eventos
app.get('/events', (req, res) => {
    db.all('SELECT * FROM events', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            console.log('Eventos en la base de datos:', rows); // Ver los datos aquí
            res.json(rows);
        }
    });
});


// Ruta para agregar un evento
app.post('/events', (req, res) => {
    const { title, description, date, location } = req.body;
    db.run(
        'INSERT INTO events (title, description, date, location) VALUES (?, ?, ?, ?)',
        [title, description, date, location],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID });
            }
        }
    );
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
