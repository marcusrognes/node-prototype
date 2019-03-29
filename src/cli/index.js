require('dotenv').config();

import '@babel/polyfill';

import yargs from 'yargs';

import UsersCreateCommand from 'cli/users/create';
import { CheckCommand } from 'cli/util';

const argv = yargs.usage('usage: $0 <command>').command(...UsersCreateCommand)
	.argv;

CheckCommand(yargs, argv, 1);
