const fs = require('fs');
let data = JSON.parse(fs.readFileSync('biome.json'));
if (!data.css) data.css = {};
if (!data.css.parser) data.css.parser = {};
data.css.parser.tailwindDirectives = true;
fs.writeFileSync('biome.json', JSON.stringify(data, null, 2));
