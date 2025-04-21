
export class Log {
    
    static debug(...msg: string[]) {
        console.debug(msg.join(' | '));
    }

    static error(msg: string, exception: Error) {
        console.error(msg, exception);
    }

}