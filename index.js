const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const gitHubRepository = require("./routes/gitHubRepository");
app.use("/git", gitHubRepository);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

