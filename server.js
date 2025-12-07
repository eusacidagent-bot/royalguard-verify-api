const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Stores game → bot events
let pending = [];

// Stores Discord → Roblox events (MessagingService relay)
let relay = [];

// 🔵 BOT → ROBLOX: Send identity
app.post("/mrelay", (req, res) => {
    const { discordId, channelId, robloxId, realUsername } = req.body;

    if (!discordId || !channelId || !robloxId || !realUsername)
        return res.status(400).send("INVALID_PAYLOAD");

    relay.push(req.body);
    res.send("RELAY_RECEIVED");
});

app.get("/relay", (req, res) => {
    res.json(relay);
});

// ROBLOX → API when player types /v CODE
app.post("/verify", (req, res) => {
    const { robloxId, code } = req.body;

    if (!robloxId || !code)
        return res.status(400).send("INVALID_PAYLOAD");

    pending.push(req.body);
    res.send("RECEIVED");
});

app.get("/pending", (req, res) => {
    res.json(pending);
});

app.post("/clear", (req, res) => {
    const { robloxId } = req.body;
    pending = pending.filter(p => p.robloxId !== robloxId);
    res.send("CLEARED");
});

app.post("/relayclear", (req, res) => {
    const { robloxId } = req.body;
    relay = relay.filter(r => r.robloxId !== robloxId);
    res.send("CLEARED");
});

app.listen(process.env.PORT || 3000, () =>
    console.log("API running.")
);
