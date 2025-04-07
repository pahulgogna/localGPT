import { Message } from "../utils/types"
import Chat from "./Chat"

function CurrentChat({
    className,
    currentResponse,
    chatHistory
}: {
    className?: string,
    currentResponse: Message,
    chatHistory: Message[]
}) {
  return (
    <div className={className + " w-full"}>
        {chatHistory.map((message) => {
            return <Chat message={message}/>
        })}
        {
            currentResponse.content.length ? <Chat message={currentResponse}/> : null
        }
    </div>
  )
}

export default CurrentChat