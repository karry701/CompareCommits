const { Octokit } = require('@octokit/rest');

// Initialize Octokit
const octokit = new Octokit();

// API route to get code differences for a commit
exports.gitCommitDiff = async function (req, res, next) {
    try {
        const { owner, repo, commitSHA } = req.query;

        // Fetch commit details
        const commitResponse = await octokit.repos.getCommit({
            owner,
            repo,
            ref: commitSHA,
        });
        const commit = commitResponse.data;

        // Fetch file diffs
        const fileDiffs = await Promise.all(commit.files.map(async file => {
            const diffResponse = await octokit.repos.compareCommits({
                owner,
                repo,
                base: commit.parents[0].sha,
                head: commitSHA,
            });

            const fileDiff = diffResponse.data.files.find(diffFile => diffFile.filename === file.filename);
            return {
                filename: file.filename,
                additions: fileDiff.additions,
                deletions: fileDiff.deletions,
                changes: fileDiff.changes,
                patch: fileDiff.patch,
            };
        }));

        res.json(fileDiffs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};
