# Parallels MCP Server (VS Code Extension)

This extension starts and stops the Parallels MCP server directly from VS Code.

## Commands

- **Parallels MCP: Start Server** (`parallelsMcp.startServer`)
- **Parallels MCP: Stop Server** (`parallelsMcp.stopServer`)

## Development

1. Install dependencies:
   ```bash
   cd vscode-extension
   npm install
   ```
2. Build:
   ```bash
   npm run compile
   ```
3. Launch in VS Code (Extension Development Host):
   ```bash
   code --extensionDevelopmentPath=.
   ```
4. Package for Marketplace:
   ```bash
   npx vsce package
   ```

The extension bundles the local `parallels-mcp-server` (via `file:..` dependency) so the server binary is available when packaged.
