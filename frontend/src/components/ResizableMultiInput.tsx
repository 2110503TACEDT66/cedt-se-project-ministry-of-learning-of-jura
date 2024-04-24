"use client";
import { TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import removeFromArrayByIndex from "@/utils/removeFromArrayByIndex";
import { ResizableMultiInputEvent } from "../../interface";

export default function ({
  label,
  onChange,
  InnerProps,
  helperTexts,
  value,
}: {
  label: string;
  onChange: (newValue: string[]) => void;
  InnerProps?: React.ComponentType<{
    className?: string;
    onChange: (event: ResizableMultiInputEvent) => void;
    label: string;
    helperText?: any;
    value: any;
  }>;
  helperTexts?: string[];
  value: (any | undefined)[];
}) {

  InnerProps = InnerProps || TextField;
  const [textValuesList, setTextValuesList] = useState<(any | undefined)[]>(value||[undefined]);

  function onAdd() {
    setTextValuesList([...textValuesList, undefined]);
  }

  function onDelete(index: number) {
    console.log("delete", index,"changed: ",removeFromArrayByIndex(textValuesList, index))
    setTextValuesList(removeFromArrayByIndex(textValuesList, index));
  }

  function onTextChange(event: ResizableMultiInputEvent, index: number) {
    let clone = [...textValuesList];
    clone[index] = event.currentTarget.value as string;
    console.log(event.currentTarget.value);
    setTextValuesList(clone)
  }

  useEffect(()=>{
    onChange(textValuesList);
  },[textValuesList])

  return (
    <div>
      <div className="flex flex-row justify-between">
        <p>{label}</p>
        <AddIcon onClick={onAdd}></AddIcon>
      </div>
      <div className="flex flex-col w-full gap-2">
        {textValuesList.map((textValue, index) => {
          return (
            <div
              key={index}
              className="pl-10 w-full flex flex-row items-center justify-center gap-2"
            >
              {InnerProps && (
                <InnerProps
                  value={(InnerProps==TextField)? textValue || "" : textValue}
                  key={index}
                  className="flex-1"
                  onChange={(e) => {
                    onTextChange(e, index);
                  }}
                  label={`${label} ${index + 1}`}
                  helperText={
                    helperTexts == undefined ? undefined : helperTexts[index]
                  }
                />
              )}
              <DeleteIcon
                onClick={() => {
                  onDelete(index);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
