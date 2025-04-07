import { useMemo, useState } from 'react'
import { Message } from '../utils/types'
import { ChevronDown, ChevronRight } from 'lucide-react'
import LLMMarkdownRenderer from './LLMMarkdownRenderer'


function Chat({
    message
}: {
    message: Message
}) {

    const [expanded, setExpanded] = useState(true)

    let messageParts = useMemo(() => {

        let split = message.content.split("</think>")

        split[0] = split[0].split("<think>")[1];

        if(expanded && split.length > 1){
            setExpanded(false)
        }

        return split

    },[message.content])

    if(message.role == "user") {
        return (
            <div className='justify-end flex mr-5 m-3 mt-5 w-full'>
                <div className='w-fit bg-neutral-700 p-2 px-4 rounded-full'>
                    <LLMMarkdownRenderer content={message.content}/>
                </div>
            </div>
        )
    }


    if(message.content.length == 0){
        return null
    }

    
    if(message.content.includes("<think>")){

        return (
            <div>
                <div className={'text-gray-400 ' + (messageParts.length == 1 ? " animate-pulse" : "")}>
                    <div>
                        <div className='flex cursor-pointer' onClick={() => {
                            setExpanded(!expanded)
                        }}>
                            {expanded ? <ChevronDown/> :
                            <ChevronRight/>}
                            Thinking...
                        </div>
                        {expanded ? <div className='ml-6'>
                            <LLMMarkdownRenderer content={messageParts[0]}/>
                        </div> : null}
                    </div>
                </div>
                {
                   messageParts.length > 1 ? <LLMMarkdownRenderer content={messageParts[1]}/> : null
                }
            </div>
        )
    }

    else{
        return <div>
                {
                   message.content.length > 1 ? <LLMMarkdownRenderer content={message.content}/> : null
                }
            </div>
    }

}

export default Chat