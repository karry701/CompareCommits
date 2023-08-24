const express = require('express');
const { Octokit } = require('@octokit/rest');
const rateLimit = require('express-rate-limit')
const app = express();
const port = 4000;

const octokit = new Octokit();

// Create the rate limit rule
const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1 // limit each IP to 2 requests per windowMs
})

// Use the limit rule as an application middleware
app.use(apiRequestLimiter);

app.get('/commit/:owner/:repo/:commitSha', async (req, res) => {
    const { owner, repo, commitSha } = req.params;

    try {
        const response = await octokit.repos.getCommit({
            owner,
            repo,
            ref: commitSha,
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/commit-diff/:owner/:repo/:base/:head', async (req, res) => {
    const { owner, repo, base, head } = req.params;

    try {
        const response = await octokit.repos.compareCommits({
            owner,
            repo,
            base,
            head,
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
