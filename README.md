# tiny-attach-test-mcp

A minimal stdio MCP server, built only to exercise mcpfab's "attach an existing MCP server"
feature end to end (introspection, Dockerfile generation, the stdio bridge, runtime config).

Run: `node index.mjs`

Needs env var MY_SECRET_TOKEN at runtime (the echo_env tool reads it back).
Also reads a `.env` file at its own working directory root, if one is mounted there.
