
echo "======================="
echo "Before running Webpack:"
echo "======================="
echo "\n"
cat entry.js

webpack --output-filename bundle.js --entry ./entry.js

echo "\n\n\n"
echo "======================="
echo "After running Webpack:"
echo "======================="
echo "\n"
cat entry.js
