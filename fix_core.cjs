const fs = require('fs');

const oldIndexFile = '/tmp/old_index.html';
const newIndexFile = '/home/alexa/Documents/project/worldofanya/src/pages/core/index.astro';

const oldIndexContent = fs.readFileSync(oldIndexFile, 'utf8');
let newIndexContent = fs.readFileSync(newIndexFile, 'utf8');

// Fix overflow-hidden -> overflow-x-hidden in body class
newIndexContent = newIndexContent.replace('overflow-hidden', 'overflow-x-hidden');

// Extract all JS functions starting from loadDashboardData until the end of the module script
const jsStart = oldIndexContent.indexOf('// Load all data from Firestore');
const jsEndStr = '// Load Sasuke image on page load';
const jsEnd = oldIndexContent.indexOf(jsEndStr);

if (jsStart === -1 || jsEnd === -1) {
    console.error('Could not find JS block limits');
    process.exit(1);
}

let missingJS = oldIndexContent.substring(jsStart, jsEnd);

// Modify loadDashboardData to export globally (already present at the end of missingJS usually, but we ensure it)
if (!missingJS.includes('window.loadDashboardData = loadDashboardData;')) {
    missingJS += '\n        window.loadDashboardData = loadDashboardData;\n';
}

// In index.astro, we hook loadDashboardData inside onAuthStateChanged, which we just added
// We need to insert missingJS right before '// Init Plugins\n        if(window.lucide)'
const hookSpot = newIndexContent.indexOf('// Init Plugins');

if (hookSpot === -1) {
    console.error('Could not find injection point');
    process.exit(1);
}

// Add the method call into onAuthStateChanged
newIndexContent = newIndexContent.replace(
    '// Initialize CMS data after auth confirmed',
    '// Initialize CMS data after auth confirmed\n                loadDashboardData();'
);

// Inject missing javascript methods into the script block
newIndexContent = newIndexContent.slice(0, hookSpot) + missingJS + '\n        ' + newIndexContent.slice(hookSpot);

fs.writeFileSync(newIndexFile, newIndexContent);
console.log('Fixed index.astro scrolling and missing functions!');
