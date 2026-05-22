import express, { type Application, type Request, type Response } from "express"
import { userRoute } from "./module/user/user.route"
import { issueRoute } from "./module/issue/issue.route"
const app: Application = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended: true}))

app.get('/', (req : Request, res: Response) => {
  res.send("DevPulse Server Running")
})

app.use("/api/users", userRoute)
app.use("/api/issues", issueRoute)


export default app;
