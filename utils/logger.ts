type LogLevel = 'info' | 'success' | 'error';

const colors = {
  info: '\x1b[36m', // cyan
  success: '\x1b[32m', // green
  error: '\x1b[31m', // red
  reset: '\x1b[0m', // reset
};

const icons = {
  info: '🔍 ',
  success: '✅ ',
  error: '❌ ',
};

export const log = {
  separator: () => console.log('\n' + '='.repeat(50) + '\n'),
  message: (message: string, level: LogLevel = 'info') => {
    console.log(`${colors[level]}${icons[level]} ${message}${colors.reset}`);
  },
  header: (title: string) => {
    console.log('\n' + '='.repeat(50));
    console.log(`${colors.info}📌 ${title.toUpperCase()}${colors.reset}`);
    console.log('='.repeat(50) + '\n');
  },
  debug: (message: string) => {
    if (process.env.DEBUG_MODE === 'true') {
      console.log(`${colors.info}🔍 DEBUG: ${message}${colors.reset}`);
    }
  },
};
