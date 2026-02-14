import path from 'path'
import stream from 'stream'
import archiver from 'archiver'

export async function GET() {
  try {
    const agentDir = path.join(process.cwd(), 'agent')

    const archive = archiver('zip', { zlib: { level: 9 } })
    const pass = new stream.PassThrough()

    archive.on('error', (err) => {
      pass.emit('error', err)
    })

    archive.pipe(pass)
    // include the agent folder contents under a top-level `agent/` folder in the zip
    archive.directory(agentDir, 'agent')
    archive.finalize()

    return new Response(pass as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="agent.zip"',
      },
    })
  } catch (err: any) {
    console.error('Failed to create agent zip', err)
    return new Response('Failed to create agent zip', { status: 500 })
  }
}
