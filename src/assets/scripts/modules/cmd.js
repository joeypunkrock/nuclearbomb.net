// Assuming Computer is defined in another file and is imported here
import Computer from './computer.js'; 
import { Terminal } from "xterm";

class Cmd extends Computer {
    constructor(options) {
        super(options); // Call the constructor of the Computer class
        this.term = new Terminal({
            cols: 40 // Adjust this number based on the size of your container
        });
        this.commandBuffer = '';
        this.initTerminal();
        console.log('cmd')
    }

    initTerminal() {
        this.term.open(document.getElementById('terminal'));
        this.term.onData(e => this.handleInput(e));
        this.term.write('$ ');
    }

    handleInput(data) {
        switch (data) {
            case '\r': // Enter key
                if (this.commandBuffer.trim() === 'Nukez1') {
                    this.runNukez1();
                } else {
                    this.processCommand(this.commandBuffer);
                }
                this.commandBuffer = '';
                this.term.write('\r$ ');
                break;
            case '\u007F': // Backspace key
                if (this.commandBuffer.length > 0) {
                    this.commandBuffer = this.commandBuffer.substr(0, this.commandBuffer.length - 1);
                    this.term.write('\b \b');
                }
                break;
            default: // Other characters
                this.commandBuffer += data;
                this.term.write(data);
                break;
        }
    }

    processCommand(command) {
        // Process the command here
        // Implement your command handling logic
        switch (command.trim()) {
            // Define commands here
            default:
                this.term.write(`\r\nUnknown command: ${command}`);
                break;
        }
        // Ensure the new prompt starts on a new line, aligned left
        this.term.write('\r\n$ '); 
    }

    runNukez1() {
        // Implement the functionality for the 'Nukez1' command
        this.term.write('\r\n    PASSWORD ACCEPTED\n');
        // Add specific actions for Nukez1 command here
    }
    
}

export default Cmd;
