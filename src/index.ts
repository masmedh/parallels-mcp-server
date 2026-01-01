#!/usr/bin/env node

/**
 * Parallels MCP Server
 * 
 * This MCP server provides tools for managing Parallels Desktop virtual machines.
 * It allows listing VMs, starting, stopping, suspending, and getting VM information.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { execSync } from 'child_process';

// Helper function to execute prlctl commands
function executePrlctl(args: string[]): string {
  try {
    const result = execSync(`prlctl ${args.join(' ')}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.trim();
  } catch (error: any) {
    throw new Error(`Parallels command failed: ${error.message}`);
  }
}

// Helper function to parse VM info
function parseVmInfo(output: string): Record<string, string> {
  const info: Record<string, string> = {};
  const lines = output.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      info[key] = value;
    }
  }
  
  return info;
}

// Create the MCP server
const server = new Server(
  {
    name: 'parallels-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools = [
  {
    name: 'list_vms',
    description: 'List all Parallels Desktop virtual machines',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_vm_info',
    description: 'Get detailed information about a specific virtual machine',
    inputSchema: {
      type: 'object',
      properties: {
        vm: {
          type: 'string',
          description: 'VM name or UUID',
        },
      },
      required: ['vm'],
    },
  },
  {
    name: 'start_vm',
    description: 'Start a virtual machine',
    inputSchema: {
      type: 'object',
      properties: {
        vm: {
          type: 'string',
          description: 'VM name or UUID',
        },
      },
      required: ['vm'],
    },
  },
  {
    name: 'stop_vm',
    description: 'Stop a virtual machine',
    inputSchema: {
      type: 'object',
      properties: {
        vm: {
          type: 'string',
          description: 'VM name or UUID',
        },
        force: {
          type: 'boolean',
          description: 'Force shutdown (kill)',
        },
      },
      required: ['vm'],
    },
  },
  {
    name: 'suspend_vm',
    description: 'Suspend a virtual machine',
    inputSchema: {
      type: 'object',
      properties: {
        vm: {
          type: 'string',
          description: 'VM name or UUID',
        },
      },
      required: ['vm'],
    },
  },
  {
    name: 'resume_vm',
    description: 'Resume a suspended virtual machine',
    inputSchema: {
      type: 'object',
      properties: {
        vm: {
          type: 'string',
          description: 'VM name or UUID',
        },
      },
      required: ['vm'],
    },
  },
  {
    name: 'reset_vm',
    description: 'Reset (restart) a virtual machine',
    inputSchema: {
      type: 'object',
      properties: {
        vm: {
          type: 'string',
          description: 'VM name or UUID',
        },
      },
      required: ['vm'],
    },
  },
  {
    name: 'get_vm_status',
    description: 'Get the current status of a virtual machine',
    inputSchema: {
      type: 'object',
      properties: {
        vm: {
          type: 'string',
          description: 'VM name or UUID',
        },
      },
      required: ['vm'],
    },
  },
  {
    name: 'exec_vm_command',
    description: 'Execute a command inside a running virtual machine',
    inputSchema: {
      type: 'object',
      properties: {
        vm: {
          type: 'string',
          description: 'VM name or UUID',
        },
        command: {
          type: 'string',
          description: 'Command to execute',
        },
      },
      required: ['vm', 'command'],
    },
  },
];

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_vms': {
        const output = executePrlctl(['list', '-a']);
        return {
          content: [{
            type: 'text',
            text: output,
          }],
        };
      }

      case 'get_vm_info': {
        const vm = args?.vm as string;
        const output = executePrlctl(['list', vm, '-i']);
        const info = parseVmInfo(output);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(info, null, 2),
          }],
        };
      }

      case 'start_vm': {
        const vm = args?.vm as string;
        const output = executePrlctl(['start', vm]);
        return {
          content: [{
            type: 'text',
            text: `VM started successfully: ${output}`,
          }],
        };
      }

      case 'stop_vm': {
        const vm = args?.vm as string;
        const force = args?.force as boolean;
        const cmdArgs = ['stop', vm];
        if (force) {
          cmdArgs.push('--kill');
        }
        const output = executePrlctl(cmdArgs);
        return {
          content: [{
            type: 'text',
            text: `VM stopped successfully: ${output}`,
          }],
        };
      }

      case 'suspend_vm': {
        const vm = args?.vm as string;
        const output = executePrlctl(['suspend', vm]);
        return {
          content: [{
            type: 'text',
            text: `VM suspended successfully: ${output}`,
          }],
        };
      }

      case 'resume_vm': {
        const vm = args?.vm as string;
        const output = executePrlctl(['resume', vm]);
        return {
          content: [{
            type: 'text',
            text: `VM resumed successfully: ${output}`,
          }],
        };
      }

      case 'reset_vm': {
        const vm = args?.vm as string;
        const output = executePrlctl(['reset', vm]);
        return {
          content: [{
            type: 'text',
            text: `VM reset successfully: ${output}`,
          }],
        };
      }

      case 'get_vm_status': {
        const vm = args?.vm as string;
        const output = executePrlctl(['status', vm]);
        return {
          content: [{
            type: 'text',
            text: output,
          }],
        };
      }

      case 'exec_vm_command': {
        const vm = args?.vm as string;
        const command = args?.command as string;
        const output = executePrlctl(['exec', vm, command]);
        return {
          content: [{
            type: 'text',
            text: output,
          }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error.message}`,
      }],
      isError: true,
    };
  }
});

// Connect to stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr (not stdout, as that's used for MCP communication)
  console.error('Parallels MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
