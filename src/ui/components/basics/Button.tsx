import React, { useState } from "react"

function Button({
    className,
    children,
    onClick = () => Promise.resolve(),
}: {
    className?: string,
    onClick?: () => Promise<void>,
    children : React.ReactNode,
}){

    const [disabled, setDisabled] = useState(false)

    async function onClickHandler() {
        setDisabled(true)
        try{
            await onClick()
        }
        catch{
            setDisabled(false)
            return
        }
        setDisabled(false)
    }

    return (
      <button className={`text-white bg-slate-900 hover:cursor-pointer hover:bg-gray-950 focus:outline-none focus:ring-0 focus:ring-gray-300 font-medium rounded-lg text-xs sm:text-sm px-2 my-4 disabled:bg-slate-600 disabled:cursor-wait select-none ` + className } onClick={onClickHandler} disabled={disabled}>{children}</button>
    )
}

export default Button