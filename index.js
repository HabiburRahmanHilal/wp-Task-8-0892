const express = require('express');
const fs = require('fs').promises;
const app = express();
app.use(express.json());

const jsonFileName = 'data.json'; 


const initialJSONContent = { message: 'Initial content' };
fs.writeFile(jsonFileName, JSON.stringify(initialJSONContent, null, 2), (err) => {
    if (err) throw err;
    console.log('JSON file created with initial content!');
});


app.get('/readFile', async (req, res) => {
    try {
        const jsonData = await fs.readFile(jsonFileName, 'utf8');
        res.send(JSON.parse(jsonData));
    } catch (error) {
        res.status(404).send('File not found.');
    }
});


app.post('/writeFile', async (req, res) => {
    const { data } = req.body;
    try {
        if (!data) throw new Error('No data provided.');
        await fs.writeFile(jsonFileName, JSON.stringify(data, null, 2));
        res.send('File written successfully.');
    } catch (error) {
        res.status(400).send(error.message);
    }
});


app.put('/updateFile', async (req, res) => {
    const { newData } = req.body;
    try {
        if (!newData) throw new Error('No new data provided.');

        
        const jsonData = await fs.readFile(jsonFileName, 'utf8');
        const existingData = JSON.parse(jsonData);

    
        existingData.message += `\n${newData}`;

        
        await fs.writeFile(jsonFileName, JSON.stringify(existingData, null, 2));
        res.send('File updated successfully.');
    } catch (error) {
        res.status(400).send(error.message);
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost: ${PORT}`);
});
