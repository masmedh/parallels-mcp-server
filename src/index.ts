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
import { z } from 'zod';

// Validation schemas
const VmNameSchema = z.object({
  vm: z.string().min(1, 'VM name cannot be empty'),
});

const StopVmSchema = z.object({
  vm: z.string().min(1, 'VM name cannot be empty'),
  force: z.boolean().optional(),
});

const ExecVmCommandSchema = z.object({
  vm: z.string().min(1, 'VM name cannot be empty'),
  command: z.string().min(1, 'Command cannot be empty'),
});

// Helper function to execute prlctl commands
function executePrlctl(command: string, ...args: string[]): string {
  try {
    const fullCommand = ['prlctl', command, ...args].filter(arg => arg.length > 0).join(' ');
    const result = execSync(fullCommand, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.trim();
  } catch (error: any) {
    const errorMessage = error.stderr?.toString() || error.message || 'Unknown error occurred';
    throw new Error(`Parallels command failed: ${errorMessage}`);
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
        const output = executePrlctl('list', '-a');
        return {
          content: [{
            type: 'text',
            text: output,
          }],
        };
      }

      case 'get_vm_info': {
        const validated = VmNameSchema.parse(args);
        const output = executePrlctl('list', validated.vm, '-i');
        const info = parseVmInfo(output);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(info, null, 2),
          }],
        };
      }

      case 'start_vm': {
        const validated = VmNameSchema.parse(args);
        const output = executePrlctl('start', validated.vm);
        return {
          content: [{
            type: 'text',
            text: `VM '${validated.vm}' started successfully${output ? ': ' + output : ''}`,
          }],
        };
      }

      case 'stop_vm': {
        const validated = StopVmSchema.parse(args);
        const forceFlag = validated.force ? '--kill' : '';
        const output = executePrlctl('stop', validated.vm, forceFlag);
        const method = validated.force ? 'force stopped' : 'stopped';
        return {
          content: [{
            type: 'text',
            text: `VM '${validated.vm}' ${method} successfully${output ? ': ' + output : ''}`,
          }],
        };
      }

      case 'suspend_vm': {
        const validated = VmNameSchema.parse(args);
        const output = executePrlctl('suspend', validated.vm);
        return {
          content: [{
            type: 'text',
            text: `VM '${validated.vm}' suspended successfully${output ? ': ' + output : ''}`,
          }],
        };
      }

      case 'resume_vm': {
        const validated = VmNameSchema.parse(args);
        const output = executePrlctl('resume', validated.vm);
        return {
          content: [{
            type: 'text',
            text: `VM '${validated.vm}' resumed successfully${output ? ': ' + output : ''}`,
          }],
        };
      }

      case 'reset_vm': {
        const validated = VmNameSchema.parse(args);
        const output = executePrlctl('reset', validated.vm);
        return {
          content: [{
            type: 'text',
            text: `VM '${validated.vm}' reset successfully${output ? ': ' + output : ''}`,
          }],
        };
      }

      case 'get_vm_status': {
        const validated = VmNameSchema.parse(args);
        const output = executePrlctl('status', validated.vm);
        return {
          content: [{
            type: 'text',
            text: output,
          }],
        };
      }

      case 'exec_vm_command': {
        const validated = ExecVmCommandSchema.parse(args);
        const output = executePrlctl('exec', validated.vm, validated.command);
        return {
          content: [{
            type: 'text',
            text: output || '(command executed successfully with no output)',
          }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    // Check if it's a Zod validation error
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
      return {
        content: [{
          type: 'text',
          text: `Validation error: ${issues}`,
        }],
        isError: true,
      };
    }
    
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
