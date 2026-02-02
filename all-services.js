#!/usr/bin/env node

/**
 * EcoHub - Start All Services Script
 * This script starts all services including Docker containers and applications
 * 
 * Services:
 * - Docker containers (MySQL databases)
 * - Auth Service (Node.js)
 * - Daily Challenges (Java/Maven)
 * - Reward Wallet (Java/Maven)
 * - Shop (Java/Maven)
 * - Workshop (Java/Maven)
 * - Frontend (Vite + React)
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const isWindows = os.platform() === 'win32';
const projectRoot = __dirname;
const backendPath = path.join(projectRoot, 'Backend');
const frontendPath = path.join(projectRoot, 'Frontend');
const infraPath = path.join(backendPath, 'infra');
const servicesPath = path.join(backendPath, 'services');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

const log = (color, label, message) => {
  console.log(`${color}[${label}]${colors.reset} ${message}`);
};

const logSuccess = (label, message) => log(colors.green, label, message);
const logInfo = (label, message) => log(colors.cyan, label, message);
const logWarning = (label, message) => log(colors.yellow, label, message);
const logError = (label, message) => log(colors.red, label, message);

const services = [];
let failedServices = [];

/**
 * Check and set JAVA_HOME if not already set
 */
function ensureJavaHome() {
  let javaHome = process.env.JAVA_HOME;
  
  if (!javaHome) {
    const possiblePaths = [
      'C:\\Program Files\\Java\\jdk-21',
      'C:\\Program Files\\Java\\jdk-20',
      'C:\\Program Files\\Java\\jdk-19',
      'C:\\Program Files\\Java\\jdk-18',
      'C:\\Program Files\\Java\\jdk-17',
      'C:\\Program Files (x86)\\Java\\jdk-21',
      '/usr/lib/jvm/java-21-openjdk',
      '/usr/lib/jvm/java-17-openjdk',
      process.env.JAVA_HOME_11 || '',
    ];

    for (const checkPath of possiblePaths) {
      if (checkPath && fs.existsSync(checkPath)) {
        javaHome = checkPath;
        process.env.JAVA_HOME = checkPath;
        logInfo('JAVA', `JAVA_HOME auto-detected: ${checkPath}`);
        break;
      }
    }

    if (!javaHome) {
      logError('JAVA', 'JAVA_HOME not set and could not auto-detect Java installation');
      logError('JAVA', 'Attempted paths:');
      possiblePaths.forEach(p => logError('JAVA', `  - ${p}`));
      logError('JAVA', '\nPlease install Java JDK 17+ or set JAVA_HOME environment variable');
      return false;
    }
  } else {
    logInfo('JAVA', `Using JAVA_HOME: ${javaHome}`);
  }

  // Verify JAVA_HOME exists
  if (!fs.existsSync(javaHome)) {
    logError('JAVA', `JAVA_HOME path does not exist: ${javaHome}`);
    return false;
  }

  return true;
}

/**
 * Spawn a child process and handle its output
 */
function startService(label, command, args, options = {}) {
  return new Promise((resolve) => {
    logInfo(label, `Starting: ${command} ${args.join(' ')}`);

    const childEnv = {
      ...process.env,
      JAVA_HOME: process.env.JAVA_HOME,
      ...options.env,
    };

    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: options.cwd || projectRoot,
      shell: isWindows,
      env: childEnv,
      ...options,
    });

    services.push({ label, process: child });

    child.on('error', (error) => {
      logError(label, `Failed to start: ${error.message}`);
      failedServices.push(label);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        logWarning(label, `Exited with code ${code}`);
        if (!failedServices.includes(label)) {
          failedServices.push(label);
        }
      }
    });

    // Resolve after a short delay to allow service to start
    setTimeout(() => resolve(child), 1500);
  });
}

/**
 * Main execution
 */
async function main() {
  console.log(`\n${colors.bright}${colors.cyan}
╔═══════════════════════════════════════════════════════════╗
║                  EcoHub - Start All Services              ║
║                                                           ║
║  Starting Docker containers and all application services  ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  // Check JAVA_HOME before starting
  if (!ensureJavaHome()) {
    logError('STARTUP', 'Java is required for Maven services. Please install Java and set JAVA_HOME.');
    process.exit(1);
  }

  try {
    // Step 1: Start Docker containers
    logSuccess('DOCKER', 'Starting Docker containers...');
    await startService(
      'DOCKER',
      isWindows ? 'docker-compose' : 'docker-compose',
      ['up', '-d'],
      { cwd: infraPath }
    );
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for Docker to start

    // Step 2: Start API Gateway (Node.js)
    logSuccess('API-GATEWAY', 'Starting API Gateway...');
    await startService(
      'API-GATEWAY',
      isWindows ? 'npm.cmd' : 'npm',
      ['run', 'dev'],
      { cwd: path.join(servicesPath, 'api-gateway') }
    );

    // Step 3: Start Auth Service (Node.js)
    logSuccess('AUTH-SERVICE', 'Starting Auth Service...');
    await startService(
      'AUTH-SERVICE',
      isWindows ? 'npm.cmd' : 'npm',
      ['run', 'dev'],
      { cwd: path.join(servicesPath, 'auth-service') }
    );

    // Step 4: Start Java services (Maven projects)
    const javaServices = ['daily-challenges', 'reward-wallet', 'shop', 'workshop'];
    
    for (const service of javaServices) {
      logSuccess(service.toUpperCase(), `Starting ${service} service...`);
      const servicePath = path.join(servicesPath, service);
      const mavenCmd = isWindows ? 'mvnw.cmd' : './mvnw';
      
      await startService(
        service.toUpperCase(),
        mavenCmd,
        ['spring-boot:run'],
        { cwd: servicePath }
      );
      
      // Stagger Java service starts
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Step 5: Start Frontend
    logSuccess('FRONTEND', 'Starting Frontend...');
    await startService(
      'FRONTEND',
      isWindows ? 'npm.cmd' : 'npm',
      ['run', 'dev'],
      { cwd: frontendPath }
    );

    console.log(`\n${colors.bright}${colors.green}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           ✓ All services started successfully!            ║
║                                                           ║
║  Services running:                                        ║
║  • Docker MySQL Databases                                ║
║  • API Gateway (Port: 3000)                               ║
║  • Auth Service (Port: 5000)                              ║
║  • Daily Challenges (Port: 8080)                          ║
║  • Reward Wallet (Port: 8081)                             ║
║  • Shop (Port: 8082)                                      ║
║  • Workshop (Port: 8083)                                  ║
║  • Frontend (Port: 5173)                                  ║
║                                                           ║
║  API Gateway available at: http://localhost:3000          ║
║  Press Ctrl+C to stop all services                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  } catch (error) {
    logError('STARTUP', `Error during startup: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', () => {
  console.log(`\n${colors.bright}${colors.yellow}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                  Shutting down services...                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  // Kill all child processes
  services.forEach(({ label, process: child }) => {
    logInfo(label, 'Stopping...');
    if (child && !child.killed) {
      if (isWindows) {
        try {
          spawn('taskkill', ['/pid', child.pid, '/f', '/t']);
        } catch (e) {
          // Ignore errors
        }
      } else {
        child.kill('SIGTERM');
      }
    }
  });

  // Stop Docker containers
  logInfo('DOCKER', 'Stopping Docker containers...');
  spawn(isWindows ? 'docker-compose' : 'docker-compose', ['down'], {
    cwd: infraPath,
    stdio: 'inherit',
    shell: isWindows,
  });

  setTimeout(() => {
    console.log(`${colors.green}✓ All services stopped${colors.reset}\n`);
    process.exit(0);
  }, 2000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logError('UNCAUGHT', error.message);
  process.exit(1);
});

// Start all services
main().catch((error) => {
  logError('MAIN', error.message);
  process.exit(1);
});
