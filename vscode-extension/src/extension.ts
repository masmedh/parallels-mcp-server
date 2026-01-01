import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

let serverProcess: ChildProcess | undefined;
const output = vscode.window.createOutputChannel('Parallels MCP Server');

function resolveServerEntry(context: vscode.ExtensionContext): string {
  // Use the bundled server from the extension
  return path.join(context.extensionPath, 'server', 'index.js');
}

async function startServer(context: vscode.ExtensionContext): Promise<void> {
  if (serverProcess) {
    vscode.window.showInformationMessage('Parallels MCP server is already running.');
    return;
  }

  const entry = resolveServerEntry(context);
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

  output.appendLine(`Starting Parallels MCP server from ${entry}`);

  serverProcess = spawn(process.execPath, [entry], {
    cwd: workspaceFolder,
    env: process.env
  });

  serverProcess.stdout?.on('data', (data) => {
    output.append(data.toString());
  });

  serverProcess.stderr?.on('data', (data) => {
    output.append(data.toString());
  });

  serverProcess.on('exit', (code, signal) => {
    output.appendLine(`Parallels MCP server exited (code: ${code ?? 'null'}, signal: ${signal ?? 'none'})`);
    serverProcess = undefined;
  });

  vscode.window.showInformationMessage('Parallels MCP server started.');
}

async function stopServer(): Promise<void> {
  if (!serverProcess) {
    vscode.window.showInformationMessage('Parallels MCP server is not running.');
    return;
  }

  output.appendLine('Stopping Parallels MCP server...');
  serverProcess.kill('SIGTERM');
  serverProcess = undefined;
  vscode.window.showInformationMessage('Parallels MCP server stopped.');
}

async function restartServer(context: vscode.ExtensionContext): Promise<void> {
  if (serverProcess) {
    await stopServer();
  }
  await startServer(context);
}

async function showStatus(): Promise<void> {
  if (serverProcess?.pid) {
    vscode.window.showInformationMessage(`Parallels MCP server is running (pid: ${serverProcess.pid}).`);
  } else {
    vscode.window.showInformationMessage('Parallels MCP server is not running.');
  }
}

export function activate(context: vscode.ExtensionContext): void {
  console.log('Parallels MCP Extension: Activating...');
  output.show();
  output.appendLine('=== Parallels MCP Extension Activated ===');
  output.appendLine(`Extension path: ${context.extensionPath}`);
  
  context.subscriptions.push(
    vscode.commands.registerCommand('parallelsMcp.startServer', () => startServer(context)),
    vscode.commands.registerCommand('parallelsMcp.stopServer', stopServer),
    vscode.commands.registerCommand('parallelsMcp.restartServer', () => restartServer(context)),
    vscode.commands.registerCommand('parallelsMcp.serverStatus', showStatus),
    output
  );

  output.appendLine('Commands registered successfully');
  
  // Auto-start on extension activation
  output.appendLine('Auto-starting server...');
  startServer(context).catch((err) => {
    output.appendLine(`Failed to start Parallels MCP server: ${err instanceof Error ? err.message : String(err)}`);
  });
}

export function deactivate(): void {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
    serverProcess = undefined;
  }
}
