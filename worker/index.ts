import { createClient } from "redis";
import { spawn } from "child_process";
import fs from "fs";
import { prisma } from "./db";
import { resolve } from "dns";

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
        const submissionId = parsedPro.submissionId;
        
        console.log("processing code of ", userId);
        let finalOutput = "";

        if( language === "cpp" ) {
            console.log(`Running user ${userId} code ${language}`);
            const filePath = `${__dirname}/code/index.cpp`;
            fs.writeFileSync(filePath, code);
            const compile = spawn("g++", [filePath, "-o", `${__dirname}/code/out`]); 

            const compilerCode = await new Promise<number | null>( async (resolve) => {
                compile.on("exit", async (code) => {
                
                    if( code !== 0 ) {
                        await prisma.submission.update({
                            where: {id: submissionId},
                            data: {
                                status: "Fail"
                            }
                        })
                    } 
                    resolve(code)
                })
            })     // convert binary
           
            if( compilerCode !== 0 ) continue;

            const process = spawn(`${__dirname}/code/out`)
            process.stdout.on("data", function (chunk: any) {
                finalOutput += chunk.toString()
                
            })
            

            await new Promise<void>((resolve) => {
                process.on("exit", async () => {
                    await prisma.submission.update({
                        where: {id: submissionId},
                        data: {
                            output: finalOutput,
                            status: "Success"
                        }
                    })
                })

                resolve()
            })
        }


        if( language === "js" ) {
            console.log(`Running user ${userId} code ${language}`);
            const filePath = `${__dirname}/code/a.js`;
            fs.writeFileSync(filePath, code)
            const process = spawn("node", [filePath])
            process.stdout.on("data", function (chunk) {
                finalOutput += chunk.toString();
            })

            await new Promise<void>((resolve) => {
                process.on("exit", async () => {
                    await prisma.submission.update({
                        where: {id: submissionId},
                        data: {
                            output: finalOutput
                        }
                    })
                })
                resolve()
            })
            
            
        }
        

        if( language === "py" ) {
            console.log(`Running user ${userId} code ${language}`);
            const filePath = `${__dirname}/code/index.py`;
            fs.writeFileSync(filePath, code)
            const process = spawn("python3", [filePath])
            process.stdout.on("data", function (chunk:any) {
                finalOutput += chunk.toString();
                
            })

            await new Promise<void>((resolve) => {
                process.on("exit", async () => {
                    await prisma.submission.update({
                        where: {id: submissionId},
                        data: {
                            output: finalOutput
                        }
                    })
                })
                resolve()
            })

        }

        
    }
})