import express, { type Request, type Response } from "express"
import { createClient } from "redis"

const client = createClient()
client.connect()

const app = express()

const port = process.env.PORT ?? 3000;

app.use(express.json())

app.post("/submission", async (req: Request, res: Response) => {
    const { userId, questionId, code, language } = req.body
    // put entry on DB
    client.lPush("problems", JSON.stringify({ userId, questionId, code, language }))

    return res.status(200).json({
        message: "processing"
    })
})


app.get("/submission/:submissionId", async (req:Request, res: Response) => {
    
})


app.listen(port, () => console.log(`server is running on port ${port}`))