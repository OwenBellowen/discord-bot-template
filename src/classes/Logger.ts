import chalk from "chalk";

// Log format: [timestamp] | [level] - [message]
// Example: [2021-01-01 12:00:00] | [INFO] - Hello, World!
// Levels: INFO, WARN, ERROR, DEBUG, SUCCESS
export default class Logger {
    constructor() {}

    private timestamp() {
        return new Date().toISOString().replace("T", " ").replace("Z", "");
    }

    private log(level: string, message: string) {
        console.log(`[${chalk.gray(this.timestamp())}] | [${level}] - ${message}`);
    }

    public info(message: string) {
        this.log(chalk.blue("INFO"), message);
    }

    public warn(message: string) {
        this.log(chalk.yellow("WARN"), message);
    }

    public error(message: string) {
        this.log(chalk.red("ERROR"), message);
    }

    public debug(message: string) {
        this.log(chalk.green("DEBUG"), message);
    }

    public success(message: string) {
        this.log(chalk.green("SUCCESS"), message);
    }
}