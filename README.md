# Parallels MCP Server

A Model Context Protocol (MCP) server for managing Parallels Desktop virtual machines.

## Features

This MCP server provides tools to interact with Parallels Desktop VMs:

- **list_vms** - List all virtual machines
- **get_vm_info** - Get detailed information about a specific VM
- **get_vm_status** - Get the current status of a VM
- **start_vm** - Start a virtual machine
- **stop_vm** - Stop a virtual machine (with optional force flag)
- **suspend_vm** - Suspend a virtual machine
- **resume_vm** - Resume a suspended virtual machine
- **reset_vm** - Reset (restart) a virtual machine
- **exec_vm_command** - Execute a command inside a running VM

## Prerequisites

- macOS with Parallels Desktop installed
- Node.js 16 or higher
- `prlctl` command-line tool (comes with Parallels Desktop)

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### With Claude Desktop

Add this to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "parallels": {
      "command": "node",
      "args": ["/Users/masoodahamed/Software_playground/100-parallelmcpserver/build/index.js"]
    }
  }
}
```

### With VS Code

The server is already configured in `.vscode/mcp.json` and ready to use!

### Development

```bash
# Run in development mode with tsx
npm run dev
```

## Example Usage

Once connected to an MCP client, you can use the tools like this:

1. **List all VMs:**
   ```
   Use the list_vms tool
   ```

2. **Get VM information:**
   ```
   Use get_vm_info with vm="MyVM"
   ```

3. **Start a VM:**
   ```
   Use start_vm with vm="MyVM"
   ```

4. **Stop a VM gracefully:**
   ```
   Use stop_vm with vm="MyVM"
   ```

5. **Force stop a VM:**
   ```
   Use stop_vm with vm="MyVM" and force=true
   ```

6. **Execute a command in a VM:**
   ```
   Use exec_vm_command with vm="MyVM" and command="ls -la"
   ```

## Security Notes

- This server has direct access to your Parallels VMs via `prlctl`
- Be careful when executing commands inside VMs
- The server runs with the same permissions as the user running it

## Troubleshooting

If you encounter issues:

1. Verify Parallels Desktop is installed: `which prlctl`
2. Test that you can run prlctl commands manually: `prlctl list -a`
3. Check the server logs (errors are logged to stderr)
4. Make sure the build directory exists and contains `index.js`

## License

MIT
