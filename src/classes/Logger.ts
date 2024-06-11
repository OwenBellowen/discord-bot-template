import chalk from "chalk";

// Log format: [timestamp] | [level] - [message]
// Example: [2021-01-01 12:00:00] | [INFO] - Hello, World!
// Levels: INFO, WARN, ERROR, DEBUG, SUCCESS
export default class Logger {
    private static timestamp() {
        return new Date().toISOString().replace("T", " ").replace("Z", "");
    }

    private static log(level: string, message: string) {
        console.log(`[${chalk.gray(this.timestamp())}] | [${level}] - ${message}`);
    }

    public static info(message: string) {
        this.log(chalk.blue("INFO"), message);
    }

    public static warn(message: string) {
        this.log(chalk.yellow("WARN"), message);
    }

    public static error(message: string) {
        this.log(chalk.red("ERROR"), message);
    }

    public static debug(message: string) {
        this.log(chalk.green("DEBUG"), message);
    }

    public static success(message: string) {
        this.log(chalk.green("SUCCESS"), message);
    }
}