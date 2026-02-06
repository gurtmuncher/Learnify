const express = require('express');
const path = require('path');
const { promises: fs } = require('fs');

const app = express();
const PORT = 8001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/games', async (req, res) => {
    try {
        const gmsPath = path.join(__dirname, 'public', 'gms');
        const folders = await fs.readdir(gmsPath, { withFileTypes: true });
        let games = [];

        for (const folder of folders) {
            if (folder.isDirectory()) {
                const files = await fs.readdir(path.join(gmsPath, folder.name));
                const icon = files.find(f => f.endsWith('.png') || f.endsWith('.jpg'));

                games.push({
                    name: folder.name.replace(/-/g, ' '),
                    url: `/gms/${folder.name}/index.html`,
                    icon: icon ? `/gms/${folder.name}/${icon}` : null
                });
            }
        }

        res.json(games);
    } catch (e) {
        console.error(e);
        res.json([]);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});