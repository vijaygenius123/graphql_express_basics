const express = require('express');

const PORT = process.env.PORT || 5000;
const app = express();


app.listen(PORT, () => {
    console.log(`Started Server On ${PORT}`)
});
