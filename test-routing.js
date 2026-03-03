// Check if elements exist in index.html
const fs = require('fs');
const idx = fs.readFileSync('index.html', 'utf8');
const settingsTabMatch = idx.match(/data-target="settings"/);
const teamTabMatch = idx.match(/data-target="team"/);
console.log("Found data-target settings?", !!settingsTabMatch);
console.log("Found data-target team?", !!teamTabMatch);
