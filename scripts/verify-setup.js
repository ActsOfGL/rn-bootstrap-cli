#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying React Native Bootstrap CLI Setup...\n');

const requiredFiles = [
  'cli.js',
  'package.json',
  'README.md',
  'LICENSE',
  '.env.example',
  'CHANGELOG.md',
  'babel.config.js',
  'tsconfig.json',
  'src/components/GlobalModal.tsx',
  'src/components/NetworkStatusProvider.tsx',
  'src/navigation/AppNavigator.tsx',
  'src/store/index.ts',
  'src/types/index.ts',
  'src/constants/index.ts',
  'src/services/apolloClient.ts',
  'src/services/databaseService.ts',
  'src/services/notificationService.ts',
  'src/services/sentryService.ts',
  'src/services/reactotronService.ts',
  'src/splash/containers/SplashScreen.tsx',
  'src/login/containers/LoginScreen.tsx',
  'src/login/services/authService.ts',
  'src/home/containers/HomeScreen.tsx',
  'src/list/containers/ListScreen.tsx',
  'src/list/services/listService.ts',
  'src/about/containers/AboutScreen.tsx',
  'App.tsx'
];

const requiredDirectories = [
  'src',
  'src/components',
  'src/navigation',
  'src/store',
  'src/types',
  'src/constants',
  'src/services',
  'src/splash',
  'src/splash/containers',
  'src/login',
  'src/login/containers',
  'src/login/services',
  'src/home',
  'src/home/containers',
  'src/list',
  'src/list/containers',
  'src/list/services',
  'src/about',
  'src/about/containers',
  'env',
  'scripts'
];

let allGood = true;

// Check directories
console.log('📁 Checking directories...');
requiredDirectories.forEach(dir => {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    console.log(`  ✅ ${dir}`);
  } else {
    console.log(`  ❌ ${dir} - Missing or not a directory`);
    allGood = false;
  }
});

console.log('\n📄 Checking files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - Missing or not a file`);
    allGood = false;
  }
});

// Check package.json structure
console.log('\n📦 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredFields = ['name', 'version', 'description', 'main', 'bin', 'scripts', 'dependencies', 'devDependencies'];
  requiredFields.forEach(field => {
    if (packageJson[field]) {
      console.log(`  ✅ ${field}`);
    } else {
      console.log(`  ❌ ${field} - Missing`);
      allGood = false;
    }
  });

  // Check CLI bin configuration
  if (packageJson.bin && (packageJson.bin['rn-bootstrap'] || packageJson.bin['rn-bootstrap-cli'])) {
    console.log('  ✅ CLI bin configuration');
  } else {
    console.log('  ❌ CLI bin configuration - Missing');
    allGood = false;
  }

} catch (error) {
  console.log('  ❌ package.json - Invalid JSON');
  allGood = false;
}

// Check CLI executable
console.log('\n🔧 Checking CLI executable...');
try {
  const stats = fs.statSync('cli.js');
  if (stats.mode & parseInt('111', 8)) {
    console.log('  ✅ cli.js is executable');
  } else {
    console.log('  ❌ cli.js is not executable');
    allGood = false;
  }
} catch (error) {
  console.log('  ❌ cli.js - Cannot check permissions');
  allGood = false;
}

// Check TypeScript configuration
console.log('\n🔷 Checking TypeScript configuration...');
try {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  if (tsConfig.compilerOptions && tsConfig.compilerOptions.paths) {
    console.log('  ✅ Path aliases configured');
  } else {
    console.log('  ❌ Path aliases not configured');
    allGood = false;
  }
} catch (error) {
  console.log('  ❌ tsconfig.json - Invalid JSON');
  allGood = false;
}

// Check Babel configuration
console.log('\n🔄 Checking Babel configuration...');
try {
  const babelConfig = require(path.join(process.cwd(), 'babel.config.js'));
  if (babelConfig.plugins && babelConfig.plugins.some(plugin => 
    Array.isArray(plugin) && plugin[0] === 'module-resolver'
  )) {
    console.log('  ✅ Module resolver plugin configured');
  } else {
    console.log('  ❌ Module resolver plugin not configured');
    allGood = false;
  }
} catch (error) {
  console.log('  ❌ babel.config.js - Cannot load or invalid');
  allGood = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 All checks passed! React Native Bootstrap CLI is ready to use.');
  console.log('\n📋 Next steps:');
  console.log('  1. Test the CLI: node cli.js TestProject');
  console.log('  2. Publish to npm: npm publish');
  console.log('  3. Install globally: npm install -g rn-bootstrap-cli');
  console.log('  4. Use anywhere: rn-bootstrap MyAwesomeApp');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  process.exit(1);
}

console.log('\n🚀 Happy coding!');