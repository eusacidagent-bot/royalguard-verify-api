const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Store pending verification requests
let pending = [];

// ROBLOX sends a request here
app.post("/verify", (req, res) => {
    const { username, code, discordId, channelId } = req.body;

    if (!username || !code || !discordId || !channelId) {
        return res.status(400).send("INVALID_PAYLOAD");
    }

    console.log("New verification request:", req.body);

    pending.push({
        username,
        code,
        discordId,
        channelId
    });

    res.send("RECEIVED");
});

// BOT fetches pending verifications
app.get("/pending", (req, res) => {
    res.json(pending);
});

// BOT clears completed one
app.post("/clear", (req, res) => {
    const { username } = req.body;

    pending = pending.filter(p => p.username !== username);

    res.send("CLEARED");
});

// Home page
app.get("/", (req, res) => {
    res.send("Royal Guard Verification API running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running on port", PORT));
