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
const db = new sqlite3.Database('./eventos.db', (err) => {
    if (err) {
        console.error('Error al conectar a SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');

        // Crear tabla 'events' si no existe
        db.run(
            `CREATE TABLE IF NOT EXISTS eventos (
                evento_id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                descripcion TEXT,
                fecha_inicio DATE NOT NULL,
                hora_inicio TIME NOT NULL,
                duracion INTEGER,
                ubicacion TEXT,
                cupo_max INTEGER,
                cupo_actual INTEGER,
                estado TEXT CHECK (estado IN ('activo', 'inactivo')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP 
            )`,
            (err) => {
                if (err) {
                    console.error('Error al crear la tabla eventos:', err.message);
                } else {
                    console.log('Tabla eventos verificada/creada correctamente');
                }
            }
        );
        
    }
});

// Ruta para obtener todos los eventos
app.get('/eventos', (req, res) => {
    db.all('SELECT * FROM eventos', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            console.log('Eventos en la base de datos:', rows); // Ver los datos aquí
            res.json(rows);
        }
    });
});


// Ruta para agregar un evento
app.post('/eventos', (req, res) => {
    const { titulo, descripcion, fecha_inicio, hora_inicio, duracion, ubicacion, cupo_max, cupo_actual, estado } = req.body;
    db.run(
        'INSERT INTO eventos (titulo, descripcion, fecha_inicio, hora_inicio, duracion, ubicacion, cupo_max, cupo_actual, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [titulo, descripcion, fecha_inicio, hora_inicio, duracion, ubicacion, cupo_max, cupo_actual, estado],
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
