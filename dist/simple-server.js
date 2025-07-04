#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const server = new index_js_1.Server({
    name: 'google-ai-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        resources: {},
        tools: {},
    },
});
// List available tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'veo_generate_video',
                description: 'Generate videos using Google VEO 3', inputSchema: {
                    type: 'object',
                    properties: {
                        prompt: { type: 'string' },
                    },
                    required: ['prompt'],
                },
            },
        ],
    };
});
// Handle tool execution (simplified example)
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case 'veo_generate_video':
            return {
                content: [
                    {
                        type: 'text',
                        text: 'Mock video generation response',
                    },
                ],
            };
        default:
            throw new Error(`Unknown tool: ${request.params.name}`);
    }
});
// Start the server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.log('Simple MCP server running');
}
main().catch(console.error);
//# sourceMappingURL=simple-server.js.map