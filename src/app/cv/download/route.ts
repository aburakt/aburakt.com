import { NextResponse } from 'next/server'
import { createReadStream } from 'node:fs'
import { statSync } from 'node:fs'
import { resolve } from 'node:path'

const FILE_NAME = 'Ahmet_Burak_Tekin_CV.v2025-09.pdf'
const FILE_PATH = resolve(process.cwd(), 'public', 'cv', FILE_NAME)

export async function GET() {
  const fileStat = statSync(FILE_PATH)
  const stream = createReadStream(FILE_PATH)

  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(fileStat.size),
      'Content-Disposition': `attachment; filename="${FILE_NAME}"`,
      'Cache-Control': 'public, max-age=0, s-maxage=31536000, immutable',
    },
  })
}


