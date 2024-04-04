import express, {Express, Request, Response} from "express";

const app : Express = express();
const port  = 8080;

app.get('/', (req: Request, res: Response) => {
    res.send("hello");
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})