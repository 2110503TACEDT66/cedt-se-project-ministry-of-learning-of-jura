"use client";
import { TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import removeFromArrayByIndex from "@/utils/removeFromArrayByIndex";
import { ResizableMultiInputEvent } from "../../interface";

export default function<T>({
    label,
    onChange,
    InnerProps,
    helperTexts,
    values
}:{
    label:string,
    onChange: (newValue: (T|undefined)[])=>void,
    InnerProps?: React.ComponentType<{
        className?:string,
        onChange: (event:ResizableMultiInputEvent)=>void,
        label:string,
        helperText?:any,
        value: T|undefined,
        error: boolean
    }>,
    helperTexts?: string[],
    values: (T|undefined)[]
}){
    InnerProps=InnerProps||TextField;

    function onAdd(){
        values.push(undefined)
        onChange(values);
    }

    function onDelete(index:number){
        values=(removeFromArrayByIndex(values,index));
        onChange(values);
    }

    function onTextChange(event: ResizableMultiInputEvent,index:number){
        values[index]=event.currentTarget.value
        onChange(values);
    }

    // useEffect(()=>{
    //     console.log("values",values)
    // },[values])
    
    return (
        <div>
            <div className="flex flex-row justify-between">
                <p>{label}</p>
                <AddIcon onClick={onAdd}></AddIcon>
            </div>
            <div className="flex flex-col w-full gap-2">
                {
                values.map((textValue,index)=>{
                    return (
                        <div key={index} className="pl-10 w-full flex flex-row items-center justify-center gap-2">
                            {
                                <InnerProps
                                    key={index}
                                    className="flex-1"
                                    value={textValue}
                                    onChange={(e)=>{onTextChange(e,index)}}
                                    label={`${label} ${index+1}`}
                                    error={helperTexts==undefined?false:Boolean(helperTexts[index])}
                                    helperText={helperTexts==undefined?undefined:helperTexts[index]}
                                />
                            }
                            <DeleteIcon onClick={()=>{onDelete(index)}}/>
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}
