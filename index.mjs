#!/usr/bin/env node
import readline from 'node:readline'
import { readFileSync, existsSync } from 'node:fs'

const rl = readline.createInterface({ input: process.stdin, terminal: false })
function send(obj) { process.stdout.write(JSON.stringify(obj) + '\n') }

rl.on('line', (line) => {
  line = line.trim()
  if (!line) return
  let req
  try { req = JSON.parse(line) } catch { return }
  if (req.id === undefined) return
  switch (req.method) {
    case 'initialize':
      send({ jsonrpc: '2.0', id: req.id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'tiny-attach-test-mcp', version: '1.0.0' } } })
      break
    case 'tools/list':
      send({ jsonrpc: '2.0', id: req.id, result: { tools: [
        { name: 'echo_env', description: 'Echo an env var value', inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } },
        { name: 'read_dotenv', description: 'Read the .env file mounted at the working directory root', inputSchema: { type: 'object', properties: {} } },
      ] } })
      break
    case 'tools/call': {
      const args = req.params?.arguments || {}
      if (req.params?.name === 'read_dotenv') {
        const text = existsSync('.env') ? readFileSync('.env', 'utf8') : '(no .env found)'
        send({ jsonrpc: '2.0', id: req.id, result: { content: [{ type: 'text', text }] } })
        break
      }
      const value = process.env[args.name] ?? null
      send({ jsonrpc: '2.0', id: req.id, result: { content: [{ type: 'text', text: JSON.stringify({ name: args.name, value }) }] } })
      break
    }
    default:
      send({ jsonrpc: '2.0', id: req.id, error: { code: -32601, message: 'method not found: ' + req.method } })
  }
})
