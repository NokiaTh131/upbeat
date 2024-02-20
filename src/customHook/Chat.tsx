
interface ChatProps {
    content: string;
    sender: string;
    isMe: boolean;
    timestamp: string;
}
export default function Chat(Props : ChatProps) {
    // get current time
    return (
        <>
            {
                Props.isMe ? (
                    <div className="flex items-start justify-end mb-2">
                        <div className="mr-2 text-gray-600 text-sm">
                            <p className="font-bold text-end">{Props.sender}</p>
                            <p>{Props.timestamp}</p>
                        </div>
                        <div className="bg-green-500 text-white rounded-lg p-3 max-w-md">
                            <p className="text-sm text-balance break-words">
                                {Props.content}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start mb-2">
                        <div className="bg-blue-500 text-white rounded-lg p-3 max-w-md">
                            <p className="text-sm text-balance break-words">
                                {Props.content}
                            </p>
                        </div>
                        <div className="ml-2 text-gray-600 text-sm">
                            <p className="font-bold text-start">{Props.sender}</p>
                            <p>{Props.timestamp}</p>
                        </div>
                    </div>
                )
            }
        </>
    )
}