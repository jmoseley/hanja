import { spawn, SpawnOptions } from 'child_process';
import { random as randomStr } from '@supercharge/strings';
import fs from 'fs';
import { Spinner } from 'clui';
import chalk from 'chalk';

export const executeCommand = (cmd: string, env: SpawnOptions['env']) => {
  return new Promise<{ stdout: string, stderr: string, code: number, signal: string }>((resolve, reject) => {
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
    });
    child.stderr.on('data', (m: Buffer) => {
      stderr = Buffer.concat([stderr, m]);
    });

    child.once('error', err => {
      reject(err);
    })
    child.once('exit', (code, signal) => {
      resolve({
        code, signal, stdout: stdout.toString(), stderr: stderr.toString()
      });
    });
  });
};

export function randomStringFilter(value: string): string {
  if (value === '<random string>') {
    return randomStr(32);
  }
  return value;
}

export async function writeJsonFile(path: string, content: Record<string, unknown>): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(content, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
}

export async function spinOn<T>(message: string, doneMessage: string, func: () => Promise<T>): Promise<T> {
  const spinner = new Spinner(message);
  try {
    spinner.start();
    const result = await func();
    spinner.stop();
    console.log(chalk.green(doneMessage));

    return result;
  } finally {
    spinner.stop();
  }
}