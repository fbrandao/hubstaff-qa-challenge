type LogLevel = 'info' | 'success' | 'error';

class Logger {
  private static instance: Logger;
  private readonly colors = {
    info: '\x1b[36m', // cyan
    success: '\x1b[32m', // green
    error: '\x1b[31m', // red
    warn: '\x1b[33m', // yellow
    reset: '\x1b[0m', // reset
  };

  private readonly icons = {
    info: '🔍 ',
    success: '✅ ',
    error: '❌ ',
    warn: '⚠️ ',
  };

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public separator(): void {
    console.log('\n' + '='.repeat(50) + '\n');
  }

  public message(message: string, level: LogLevel = 'info'): void {
    console.log(`${this.colors[level]}${this.icons[level]} ${message}${this.colors.reset}`);
  }

  public header(title: string): void {
    console.log('\n' + '='.repeat(50));
    console.log(`${this.colors.info}📌 ${title.toUpperCase()}${this.colors.reset}`);
    console.log('='.repeat(50) + '\n');
  }

  public debug(message: string): void {
    if (process.env.DEBUG_MODE === 'true') {
      console.log(`${this.colors.info}🔍 DEBUG: ${message}${this.colors.reset}`);
    }
  }
}

// Export a singleton instance
export const logger = Logger.getInstance();
