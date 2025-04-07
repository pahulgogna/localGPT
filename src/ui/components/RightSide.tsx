import { useState } from "react"
import TextInput from "./basics/TextInput"
import CurrentChat from "./CurrentChat"
import Button from "./basics/Button"
import { ArrowUp, Trash2 } from "lucide-react"
import { Message } from "../utils/types"

let data: {
    "model": string,
    "stream": boolean,
    messages: Message[]
} = {
    "model": "deepseek-r1:14b",
    stream: true,
    "messages": []
}

async function sendMessage(message: string, setCurrentResponseString: React.Dispatch<React.SetStateAction<Message>>, setFullMessages: React.Dispatch<React.SetStateAction<Message[]>> ): Promise<AbortController | null>{

    const abortControl = new AbortController()

    data.messages.push({"role": "user","content": message})

    setFullMessages(_ => data.messages)

    let config = {
        url: 'http://127.0.0.1:11434/api/chat',
        data : JSON.stringify(data),
    };

    const res = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: config.data,
        signal: abortControl.signal
      });
    
    if (!res.body) {
        console.error('No response body');
    }
    else{
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
    
        let response = "";
    
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
    
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop()!;
    
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                const json = JSON.parse(line);
                const content = json?.message?.content || json?.response || '';
                setCurrentResponseString(s => {
                    return {...s, "content": s.content + content}
                })
                response += content
                } catch (err) {
                console.warn('Could not parse line:', line);
                }
            }
        }
    
        data.messages.push({
            role: "assistant",
            content: response
        })
    
        setFullMessages(_ => data.messages)
    
        setCurrentResponseString({
            role:"assistant",
            content:""
        })
    
        return abortControl
    }

    return null;


}


function RightSide() {

    const [value, setValue] = useState("")
    const [currentResponse, setCurrentResponse] = useState<Message>({
        role:"assistant",
        content:""
    })
    const [fullMessages, setFullMessages] = useState<Message[]>([])


    return (
        <div className="flex flex-col h-full">

            <Trash2 className="m-3 cursor-pointer" onClick={() => {

                    data = {
                        "model": "deepseek-r1:14b",
                        stream: true,
                        "messages": []
                    }

                    setCurrentResponse({
                        role: "assistant",
                        content: ""
                    })

                    setFullMessages([])

            }}/>

            <div className="flex h-10/12 overflow-auto justify-center">
                <div className="flex w-4/5 lg:w-1/2">
                    <div className="flex justify-end w-full ">
                        <CurrentChat chatHistory={fullMessages} currentResponse={currentResponse}/>
                    </div>
                </div>
            </div>

            <div className="absolute w-full bottom-3">
                <div className="flex justify-center">
                    <div className="flex w-4/5 lg:w-1/2">
                        <TextInput className="pl-5 pr-2 w-full mb-4" value={value} setValue={setValue}  placeholder="Ask anything"/>
                        <Button className="mr-5 shadow-xl" onClick={async () => {
                            if(value.length){
                                setValue("")
                                await sendMessage(value, setCurrentResponse, setFullMessages)
                            }
                        }}>
                            <ArrowUp/>
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default RightSide