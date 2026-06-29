import { useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import axios from "axios"

import "./index.css"

export function App() {

  const textInput = useRef<HTMLTextAreaElement>(null)

  const [lan, setLan] = useState("")
  const [status, setStatus] = useState("")
  const [output, setOutput] = useState("")

  async function PollBackend(submissionId: string) {
    const res = await axios.get("http://localhost:3001/submission/"+submissionId)

    if( res.status == 200 ) {
      const { data } = res.data

      if( data.status !== "Processing" ) {
        setStatus(data.status)
        setOutput(data.output)
      }
      else {
        await new Promise((resolve) => setTimeout(resolve, 3000))
        PollBackend(submissionId)
      }
    }
  }

  async function handelSubmit() {
    try {
      setStatus("Processing")
      setOutput("")

      const res = await axios.post("http://localhost:3001/submission", {
        userId: 2,
        questionId: 3,
        code: textInput.current?.value,
        language: lan
      })

      if( res.status === 200 ) {
        const { id } = res.data
        PollBackend( id )
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
    <div className="w-screen h-screen flex ">
      <div className="flex-1 h-full">
        <div className=" flex justify-between items-center m-2">
          <div className="left">
            <Button className="m-1" 
            variant={ lan === "cpp" ? "destructive" : "outline"}
            onClick={() => setLan("cpp")}
            >
              C++
            </Button>
            <Button className="m-1" 
            variant={ lan === "py" ? "destructive" : "outline"}
            onClick={() => setLan("py")}
            >
              Python
            </Button>
            <Button className="m-1" 
            variant={ lan === "js" ? "destructive" : "outline"}
            onClick={() => setLan("js")}
            >
              Js
            </Button>
          </div>
          <div className="right">
            <Button onClick={handelSubmit} >
              Submit
            </Button>
          </div>
        </div>

        <div className="m-4 h-[80%] ">
          <Textarea 
            className="w-full h-full" 
            ref={textInput}
          />
        </div>

      </div>
      <div className="flex-1">
        <div className="out text-3xl font-semibold">
          {status}
        </div>
        <div className="output">
          {output}
        </div>

      </div>
    </div>
    </>
  );
}

export default App;
