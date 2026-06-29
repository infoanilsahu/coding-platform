import { createClient } from "redis";
import { spawn } from "child_process";
import fs from "fs"

const client = createClient();

client.connect().then(async () => {
    while(1) {
        const pro = await client.rPop("problems")

        if(!pro) {
            await new Promise((resole) => setTimeout(resole, 1000))
            continue;
        }

        const parsedPro = JSON.parse(pro);
        const code = parsedPro.code;
        const language: string = parsedPro.language.toLocaleLowerCase();
        const userId = parsedPro.userId;

        console.log("processing code of ", userId);

        if( language === "cpp" ) {
            console.log(`Running user ${userId} code ${language}`);
            const filePath = `${__dirname}/code/index.cpp`;
            fs.writeFileSync(filePath, code);
            spawn("g++", [filePath, "-o", `${__dirname}/code/out`]); 
            await new Promise((resolve) => setTimeout(resolve, 1000) )  // convert binary
            const process = spawn(`${__dirname}/code/out`)
            process.stdout.on("data", function (chunk: any) {
                console.log(chunk.toString());
                
            })
            // sandbox
        }
        if( language === "js" ) {
            console.log(`Running user ${userId} code ${language}`);
            const filePath = `${__dirname}/code/a.js`;
            fs.writeFileSync(filePath, code)
            const process = spawn("node", [filePath])
            process.stdout.on("data", function (chunk) {
                console.log(chunk.toString());
                
            })
            await new Promise((resolve) => setTimeout(resolve, 5000) )
            // sandbox
        }
        

        if( language === "py" ) {
            console.log(`Running user ${userId} code ${language}`);
            const filePath = `${__dirname}/code/index.py`;
            fs.writeFileSync(filePath, code)
            const process = spawn("python3", [filePath])
            process.stdout.on("data", function (chunk:any) {
                console.log(chunk.toString());
                
            })
        }
    }
})