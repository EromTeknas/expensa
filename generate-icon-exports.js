const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, 'src/assets/icons');
const EXPORT_FILE = path.join(__dirname, 'src/components/common/Icons.ts');

// Helper function to convert file names to PascalCase without special characters
function formatIconName(filename) {
  return filename
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase()) // Convert -x to X
    .replace(/^\w/, (c) => c.toUpperCase())                // Capitalize the first letter
    .replace('.svg', '') + 'Icon';                         // Append "Icon"
}

// Read all SVG files from the icons directory
const files = fs.readdirSync(ICONS_DIR).filter(file => file.endsWith('.svg'));

// Generate export lines for each file
const exportLines = files.map(file => {
  const iconName = formatIconName(file);
  return `export { default as ${iconName} } from '../../assets/icons/${file}';`;
});

// Write the exports to the icons.ts file
fs.writeFileSync(EXPORT_FILE, exportLines.join('\n') + '\n');
console.log('Icons exported successfully!');
