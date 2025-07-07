#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🚀 React Native Bootstrap CLI');
  console.log('=====================================\n');

  const projectName = process.argv[2];
  
  if (!projectName) {
    console.error('❌ Please provide a project name');
    console.log('Usage: npx rn-bootstrap-cli <ProjectName>');
    process.exit(1);
  }

  // Validate project name
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(projectName)) {
    console.error('❌ Project name must start with a letter and contain only letters and numbers');
    process.exit(1);
  }

  console.log(`📱 Creating React Native project: ${projectName}\n`);

  try {
    // Ask for configuration options
    console.log('🔧 Configuration Options:');
    const useExpo = await askQuestion('Use Expo? (y/N): ');
    const includeStorybook = await askQuestion('Include Storybook? (Y/n): ');
    const includeDetox = await askQuestion('Include Detox E2E testing? (Y/n): ');
    
    rl.close();

    const isExpo = useExpo.toLowerCase() === 'y';
    const withStorybook = includeStorybook.toLowerCase() !== 'n';
    const withDetox = includeDetox.toLowerCase() !== 'n';

    console.log('\n📋 Project Configuration:');
    console.log(`  • Framework: ${isExpo ? 'Expo' : 'React Native CLI'}`);
    console.log(`  • Storybook: ${withStorybook ? 'Yes' : 'No'}`);
    console.log(`  • E2E Testing: ${withDetox ? 'Yes' : 'No'}`);
    console.log('');

    // Create React Native project
    console.log('📱 Initializing React Native project...');
    
    if (isExpo) {
      execSync(`npx create-expo-app ${projectName} --template blank-typescript`, {
        stdio: 'inherit',
      });
    } else {
      execSync(`npx react-native init ${projectName} --template react-native-template-typescript`, {
        stdio: 'inherit',
      });
    }

    // Change to project directory
    process.chdir(projectName);

    // Copy bootstrap files
    console.log('📋 Setting up bootstrap template...');
    await setupBootstrapFiles(isExpo, withStorybook, withDetox);

    // Install dependencies
    console.log('📦 Installing dependencies...');
    await installDependencies(isExpo, withStorybook, withDetox);

    // Setup platform-specific configurations
    if (!isExpo) {
      if (process.platform === 'darwin') {
        console.log('🍎 Installing iOS pods...');
        execSync('cd ios && pod install', { stdio: 'inherit' });
      }
    }

    // Final setup
    console.log('🔧 Final setup...');
    await finalSetup();

    console.log('\n✅ Project created successfully!');
    console.log(`\n📁 Navigate to your project: cd ${projectName}`);
    console.log('🏃 Run the app:');
    
    if (isExpo) {
      console.log('  • Start: npm start');
      console.log('  • iOS: npm run ios');
      console.log('  • Android: npm run android');
    } else {
      console.log('  • iOS: npm run ios');
      console.log('  • Android: npm run android');
      console.log('  • Start Metro: npm start');
    }
    
    console.log('\n🔧 Development tools:');
    console.log('  • Run tests: npm test');
    console.log('  • Lint code: npm run lint');
    console.log('  • Type check: npm run type-check');
    
    if (withStorybook) {
      console.log('  • Storybook: npm run storybook');
    }
    
    if (withDetox) {
      console.log('  • E2E tests: npm run test:e2e');
    }
    
    console.log('\n📚 Demo credentials:');
    console.log('  • Email: demo@example.com');
    console.log('  • Password: password123');
    
    console.log('\n🎉 Happy coding!');

  } catch (error) {
    console.error('❌ Error creating project:', error.message);
    process.exit(1);
  }
}

async function setupBootstrapFiles(isExpo, withStorybook, withDetox) {
  const currentDir = process.cwd();
  const templateDir = path.join(__dirname, 'template');

  // Copy core files
  const coreFiles = [
    'src/',
    'App.tsx',
    'babel.config.js',
    'tsconfig.json',
    '.env',
    '.env.example',
    '.prettierrc.js',
    '.eslintrc.js',
    'jest.config.js',
    'metro.config.js'
  ];

  // Copy environment files
  const envFiles = ['env/'];

  // Copy all core files
  [...coreFiles, ...envFiles].forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(currentDir, file);
    
    if (fs.existsSync(srcPath)) {
      copyRecursive(srcPath, destPath);
    }
  });

  // Copy conditional files
  if (withStorybook) {
    const storybookFiles = ['.storybook/', 'stories/'];
    storybookFiles.forEach(file => {
      const srcPath = path.join(__dirname, file);
      const destPath = path.join(currentDir, file);
      
      if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, destPath);
      }
    });
  }

  if (withDetox) {
    const detoxFiles = ['__tests__/', '.detoxrc.js'];
    detoxFiles.forEach(file => {
      const srcPath = path.join(__dirname, file);
      const destPath = path.join(currentDir, file);
      
      if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, destPath);
      }
    });
  }
}

async function installDependencies(isExpo, withStorybook, withDetox) {
  // Base dependencies
  const dependencies = [
    '@react-navigation/native',
    '@react-navigation/stack',
    '@react-navigation/bottom-tabs',
    '@react-navigation/drawer',
    'react-native-screens',
    'react-native-safe-area-context',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'zustand',
    'react-native-mmkv',
    'axios',
    '@apollo/client',
    'graphql',
    '@tanstack/react-query',
    'react-hook-form',
    '@hookform/resolvers',
    'yup',
    'react-native-vector-icons',
    'react-native-modal',
    'react-native-toast-message',
    'react-native-config',
    '@react-native-community/netinfo',
    '@react-native-async-storage/async-storage'
  ];

  // Platform-specific dependencies
  if (!isExpo) {
    dependencies.push(
      'react-native-splash-screen',
      'react-native-sqlite-storage',
      'react-native-push-notification',
      '@react-native-firebase/app',
      '@react-native-firebase/messaging',
      '@react-native-firebase/analytics',
      'react-native-keychain',
      '@rnmapbox/maps',
      '@sentry/react-native',
      'react-native-fs',
      'react-native-document-picker',
      'react-native-image-picker',
      'react-native-permissions'
    );
  }

  // Dev dependencies
  const devDependencies = [
    'babel-plugin-module-resolver',
    '@types/react-native-sqlite-storage',
    '@types/react-native-vector-icons'
  ];

  if (withStorybook) {
    devDependencies.push(
      '@storybook/react-native',
      '@storybook/addon-actions',
      '@storybook/addon-controls',
      '@storybook/addon-ondevice-actions',
      '@storybook/addon-ondevice-controls'
    );
  }

  if (withDetox) {
    devDependencies.push('detox');
  }

  if (!isExpo) {
    devDependencies.push(
      'reactotron-react-native',
      'reactotron-redux',
      'reactotron-flipper'
    );
  }

  // Install dependencies
  console.log('  Installing production dependencies...');
  execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });

  console.log('  Installing development dependencies...');
  execSync(`npm install --save-dev ${devDependencies.join(' ')}`, { stdio: 'inherit' });
}

async function finalSetup() {
  // Update package.json scripts
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  packageJson.scripts = {
    ...packageJson.scripts,
    'type-check': 'tsc --noEmit',
    'lint:fix': 'eslint . --fix',
    'test:watch': 'jest --watch',
    'test:coverage': 'jest --coverage',
    'clean': 'react-native clean',
    'clean:android': 'cd android && ./gradlew clean && cd ..',
    'clean:ios': 'cd ios && xcodebuild clean && cd ..',
    'pod-install': 'cd ios && pod install && cd ..'
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

main().catch(console.error);