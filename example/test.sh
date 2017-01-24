
echo "Before running Webpack:"
cat entry.js

webpack --output-filename bundle.js --entry ./entry.js

echo "After running Webpack:"
cat entry.js
