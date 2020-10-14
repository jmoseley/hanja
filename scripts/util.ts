import { spawn, SpawnOptions } from 'child_process';
import { random as randomStr } from '@supercharge/strings';
import fs from 'fs';
import { Spinner } from 'clui';
import chalk from 'chalk';

export class ExecError extends Error {
  constructor(public code: number, public signal: NodeJS.Signals, public stdout: string, public stderr: string) {
    super(`cmd exited with non-zero code (${code}) and signal '${signal}'`);
  }
}

export const executeCommand = (cmd: string, env: SpawnOptions['env'], verbose = false) => {
  return new Promise<{ stdout: string; stderr: string; code: number; signal: string }>((resolve, reject) => {
    const child = spawn(cmd, {
      cwd: process.cwd(),
      shell: true,
      env: {
        ...process.env,
        ...env,
      },
    });

    let stdout = Buffer.from('');
    let stderr = Buffer.from('');
    child.stdout.on('data', (m: Buffer) => {
      stdout = Buffer.concat([stdout, m]);
      if (verbose) {
        console.log('[stdout]', m.toString());
      }
    });
    child.stderr.on('data', (m: Buffer) => {
      stderr = Buffer.concat([stderr, m]);
      if (verbose) {
        console.log('[stderr]', m.toString());
      }
    });

    child.once('error', (err) => {
      reject(err);
    });
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve({
          code,
          signal,
          stdout: stdout.toString(),
          stderr: stderr.toString(),
        });
      } else {
        reject(new ExecError(code, signal, stdout.toString(), stderr.toString()));
      }
    });
  });
};

export function randomStringFilter(value: string): string {
  if (value === '<random string>') {
    return randomStr(32);
  }
  return value;
}

export async function writeJsonFile<T>(path: string, content: T): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(content, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function spinOn<T>(
  message: string,
  doneMessage: string,
  func: () => Promise<T>,
  showSpinner = true,
): Promise<T> {
  const spinner = new Spinner(message);
  try {
    if (showSpinner) {
      spinner.start();
    } else {
      console.log(chalk.blue(message));
    }
    const result = await func();
    if (showSpinner) {
      spinner.stop();
    }
    console.log(chalk.green(doneMessage));

    return result;
  } finally {
    spinner.stop();
  }
}
