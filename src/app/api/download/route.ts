import path from 'path'
import stream from 'stream'
import archiver from 'archiver'

export async function GET() {
  try {
    const meterDir = path.join(process.cwd(), 'meter')

    const archive = archiver('zip', { zlib: { level: 9 } })
    const pass = new stream.PassThrough()

    archive.on('error', (err: Error) => {
      pass.emit('error', err)
    })

    archive.pipe(pass)
    // include the meter folder contents under a top-level `meter/` folder in the zip
    archive.directory(meterDir, 'meter')
    archive.finalize()

    return new Response(pass as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="meter.zip"',
      },
    })
  } catch (err: any) {
    console.error('Failed to create meter zip', err)
    return new Response('Failed to create meter zip', { status: 500 })
  }
}