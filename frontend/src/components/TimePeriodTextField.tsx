import { TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { Period, ResizableMultiInputEvent } from "../../interface";

enum Time{
    startTime,
    endTime
}

export default function({
    className,
    onChange,
    label,
    helperText
}:{
    className?:string,
    onChange: (event:ResizableMultiInputEvent)=>void,
    label:string,
    helperText?: {
        startTime?:string,
        endTime?:string,
    }
}){
    const [startTime,setStartTime] = useState("");
    const [endTime,setEndTime] = useState("");
    function onInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,time: Time){
        let newStartTime=startTime;
        let newEndTime=endTime;
        const newValue=event.currentTarget.value;
        if(time==Time.startTime){
            setStartTime(newValue)
            newStartTime=newValue
        }
        else{
            setEndTime(newValue)
            newEndTime=newValue
        }
        let newEvent: ResizableMultiInputEvent = {
            currentTarget:{
                value:{
                    start: newStartTime,
                    end: newEndTime
                } as Period
            }
        };
        onChange(newEvent)
    }
    useEffect(()=>{
        console.log(helperText)
    },[helperText])
    return (
        <div className="w-full flex flex-col">
            <div className={`${className||''} w-full flex items-center gap-2`}>
                <TextField
                    label="Start Time"
                    value={startTime}
                    className="w-full"
                    error={Boolean(helperText)}
                    onChange={(e)=>{onInputChange(e,Time.startTime)}}
                    helperText={helperText?.startTime}
                />
                <p>-</p>
                <TextField
                    label="End Time"
                    value={endTime}
                    className="w-full"
                    error={Boolean(helperText)}
                    onChange={(e)=>{onInputChange(e,Time.endTime)}}
                    helperText={helperText?.endTime}
                />
            </div>
            {/* <p className="text-[red]">{helperText}</p> */}
        </div>
    )
}