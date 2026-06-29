import express, { type Request, type Response } from "express"
import { createClient } from "redis"
import { prisma } from "./db"

const client = createClient()
client.connect()

const app = express()

const port = process.env.PORT ?? 3000;

app.use(express.json())

app.post("/submission", async (req: Request, res: Response) => {
    const { userId, questionId, code, language } = req.body

    const solu = await prisma.submission.create({
        data: {
            code,
            language,
            status: "Processing"
        }
    })

    
    client.lPush("problems", JSON.stringify({ userId, questionId, code, language, submissionId: solu.id }))

    return res.status(200).json({
        message: "processing",
        id: solu.id
    })
})


app.get("/submission/:submissionId", async (req:Request, res: Response) => {

    const submissionId = req.params.submissionId as string

    if( !submissionId ) {
        return res.status(404).json({
            message: "submission not found"
        })
    }

    const data = await prisma.submission.findFirst({
        where: {id: submissionId}
    })

    return res.status(200).json({
        data
    })
})


app.listen(port, () => console.log(`server is running on port ${port}`))