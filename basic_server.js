const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS to allow cross-origin requests
app.use(cors());

// Enable JSON parsing for incoming requests
app.use(express.json());

// Define a server port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
