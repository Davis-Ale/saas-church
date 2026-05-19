import { Request, Response } from 'express'
import slugify from 'slugify'
import { prisma } from '../../db/prisma'

export async function createChurch(req: Request, res: Response) {
  try {
    const { name, country } = req.body

    if (!name || !country) {
      return res.status(400).json({
        error: 'Name and country are required',
      })
    }

    const church = await prisma.church.create({
      data: {
        name,
        slug: slugify(name, { lower: true, strict: true }),
        country,
        status: 'active',
      },
    })

    return res.status(201).json({
      success: true,
      data: church,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return res.status(500).json({
      error: message,
    })
  }
}
