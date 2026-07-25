const fs = require('fs');
const s = fs.readFileSync('game.js', 'utf8');
const target = 'const Starters';
const idx = s.indexOf(target);
const block = s.substring(0, idx + target.length + 100);
try {
    new Function(block);
    console.log('Block before Starters parses OK');
} catch (e) {
    console.log('Parse error before Starters:', e.message);
}
