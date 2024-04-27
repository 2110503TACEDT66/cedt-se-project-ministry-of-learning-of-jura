"use client";
import { TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import removeFromArrayByIndex from "@/utils/removeFromArrayByIndex";
import { ResizableMultiInputEvent } from "../../interface";
import { IdGenerator } from "@/utils/IdGenerator";

export default function <T>({
    label,
    onChange,
    InnerProps,
    helperTexts,
    values
}: {
    label: string,
    onChange: (newValue: (T | undefined)[]) => void,
    InnerProps?: React.ComponentType<{
        className?: string,
        onChange: (event: ResizableMultiInputEvent) => void,
        label: string,
        helperText?: any,
        value: T | undefined,
        error: boolean
    }>,
    helperTexts?: string[],
    values: (T | undefined)[]
}) {
    let idGenerator = new IdGenerator();

    type TWithId<T> = {
        value: T | undefined,
        id?: number
    }
    InnerProps = InnerProps || TextField;

    const [state,setState] = useState<TWithId<T>[]>(
        values.map(
            (value)=>{
                return {
                    value,
                    id: idGenerator.next()
                }
            }
        )
    );

    function onAdd() {
        setState([...structuredClone(state),{
            value: undefined,
            id: idGenerator.next()
        }])
    }

    function onDelete(index: number) {
        setState(removeFromArrayByIndex<TWithId<T>>(state, index));
    }

    function onTextChange(event: ResizableMultiInputEvent, index: number) {
        let newState = structuredClone(state);
        newState[index] = {
            value:event.currentTarget.value,
            id: newState[index].id
        }
        setState(newState)
    }

    useEffect(()=>{
        onChange(state)
    },[state])

    return (
        <div>
            <div className="flex flex-row justify-between">
                <p>{label}</p>
                <AddIcon onClick={onAdd}></AddIcon>
            </div>
            <div className="flex flex-col w-full gap-2">
                {
                    state.map((value, index) => {
                        console.log("index ",index,"value",value)
                        let key = value?.id ?? idGenerator.next();
                        value.id=key;
                        return (
                            <div key={key} className="pl-10 w-full flex flex-row items-center justify-center gap-2">
                                <InnerProps
                                    key={key}
                                    className="flex-1"
                                    value={value?.value}
                                    onChange={(e) => {
                                        onTextChange(e, index)
                                    }}
                                    label={`${label} ${index + 1}`}
                                    error={helperTexts == undefined ? false : Boolean(helperTexts[index])}
                                    helperText={helperTexts == undefined ? undefined : helperTexts[index]}
                                />
                                <DeleteIcon
                                    onClick={() => { onDelete(index) }}
                                />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
