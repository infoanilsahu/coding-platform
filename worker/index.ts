import { createClient } from "redis";

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

        if( language === "c++" ) {
            console.log(`Running user ${userId} code ${language}`);
            await new Promise((resolve) => setTimeout(resolve, 10000) )
            // sandbox
        }
        if( language === "js" ) {
            console.log(`Running user ${userId} code ${language}`);
            await new Promise((resolve) => setTimeout(resolve, 5000) )
            // sandbox
        }
        
    }
})