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

### From npm

```bash
# Install globally
npm install -g parallels-mcp-server

# Or use with npx (no installation needed)
npx parallels-mcp-server
```

### From source

```bash
# Clone the repository
git clone <repository-url>
cd parallels-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### With Claude Desktop

After installation, add this to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "parallels": {
      "command": "npx",
      "args": ["parallels-mcp-server"]
    }
  }
}
```

Or if you have it installed globally:

```json
{
  "mcpServers": {
    "parallels": {
      "command": "parallels-mcp-server"
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

### Available Tools

#### list_vms

Lists all Parallels Desktop virtual machines on your system.

**Parameters:** None

**Example:**

```
Use the list_vms tool
```

#### get_vm_info

Get detailed information about a specific virtual machine including configuration, hardware specs, and network settings.

**Parameters:**

- `vm` (required): VM name or UUID

**Example:**

```
Use get_vm_info with vm="MyVM"
```

#### get_vm_status

Get the current operational status of a virtual machine (running, stopped, suspended, etc.).

**Parameters:**

- `vm` (required): VM name or UUID

**Example:**

```
Use get_vm_status with vm="MyVM"
```

#### start_vm

Start a stopped or suspended virtual machine.

**Parameters:**

- `vm` (required): VM name or UUID

**Example:**

```
Use start_vm with vm="MyVM"
```

#### stop_vm

Stop a running virtual machine gracefully or forcefully.

**Parameters:**

- `vm` (required): VM name or UUID
- `force` (optional): Boolean - if true, performs a hard shutdown (kill)

**Examples:**

```
# Graceful shutdown
Use stop_vm with vm="MyVM"

# Force shutdown
Use stop_vm with vm="MyVM" and force=true
```

#### suspend_vm

Suspend a running virtual machine, saving its current state to disk.

**Parameters:**

- `vm` (required): VM name or UUID

**Example:**

```
Use suspend_vm with vm="MyVM"
```

#### resume_vm

Resume a suspended virtual machine from its saved state.

**Parameters:**

- `vm` (required): VM name or UUID

**Example:**

```
Use resume_vm with vm="MyVM"
```

#### reset_vm

Restart a virtual machine (equivalent to pressing the reset button).

**Parameters:**

- `vm` (required): VM name or UUID

**Example:**

```
Use reset_vm with vm="MyVM"
```

#### exec_vm_command

Execute a command inside a running virtual machine.

**Parameters:**

- `vm` (required): VM name or UUID
- `command` (required): Command to execute

**Example:**

```
Use exec_vm_command with vm="MyVM" and command="ls -la /home"
```

**Note:** The VM must be running and Parallels Tools must be installed for command execution to work.

## Security Notes

- This server has direct access to your Parallels VMs via `prlctl`
- Be careful when executing commands inside VMs
- The server requires Parallels Desktop to be installed and properly configured
- Commands are executed with your current user permissions

## Troubleshooting

### Command not found: prlctl

Ensure Parallels Desktop is installed and the command-line tools are in your PATH. You can verify by running:

```bash
prlctl --version
```

### VM not found

- Check the VM name is correct (case-sensitive)
- Use `list_vms` to see available VMs
- You can use either the VM name or UUID

### Command execution fails

- Ensure the VM is running
- Verify Parallels Tools are installed in the guest OS
- Check that the command syntax is correct for the guest OS

### Permission denied

The server runs with your user permissions. Ensure you have access to Parallels Desktop and the VMs.

## FAQ

**Q: Does this work on Windows or Linux?**  
A: No, this server is macOS-only as it requires Parallels Desktop, which is a macOS application.

**Q: Can I use this with other MCP clients besides Claude Desktop?**  
A: Yes! Any MCP-compatible client can use this server.

**Q: Is it safe to publish this to npm?**  
A: Yes, but make sure to update the author information and repository URL in package.json before publishing.

**Q: How do I find my VM's UUID?**  
A: Use the `list_vms` tool or run `prlctl list -a` in the terminal.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issue tracker.

- The server runs with the same permissions as the user running it

## Troubleshooting

If you encounter issues:

1. Verify Parallels Desktop is installed: `which prlctl`
2. Test that you can run prlctl commands manually: `prlctl list -a`
3. Check the server logs (errors are logged to stderr)
4. Make sure the build directory exists and contains `index.js`

## License

MIT
