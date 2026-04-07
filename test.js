const fs = require('fs');
let data = JSON.parse(fs.readFileSync('biome.json'));
if (!data.css) data.css = {};
if (!data.css.parser) data.css.parser = {};
data.css.parser.tailwindDirectives = true; // Wait maybe?
fs.writeFileSync('biome2.json', JSON.stringify(data, null, 2));
