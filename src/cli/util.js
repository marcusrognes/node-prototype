export function CheckCommand(yargs, argv, required) {
	if (argv._.length < required) {
		yargs.showHelp();
	} else {
		// check for unknown command
	}
}

export function complete() {
	process.exit(0);
}

export function crash() {
	process.exit(1);
}
