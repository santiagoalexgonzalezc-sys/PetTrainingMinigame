const fs = require('fs');
const s = fs.readFileSync('game.js', 'utf8');
let dq = 0, sq = 0, bad = [];
for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '"' && (i === 0 || s[i - 1] !== '\\')) dq++;
    if (ch === "'" && (i === 0 || s[i - 1] !== '\\')) sq++;
    if ((dq % 2 === 1 || sq % 2 === 1) && ch === '\n') {
        bad.push(s.substring(0, i).split('\n').length);
    }
}
console.log('Unclosed string at lines:', bad.join(', ') || 'none');
