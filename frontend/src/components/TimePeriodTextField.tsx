import { TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { DeepPartial, Period, ResizableMultiInputEvent } from "../../interface";
import { useFormik } from "formik";
import * as yup from "yup";
import hourRegex from "@/constants/hourRegex";
export default function ({
  className,
  onChange,
  label,
  helperText,
  value,
}: {
  className?: string;
  onChange: (event: ResizableMultiInputEvent) => void;
  label: string;
  helperText?: any;
  value: DeepPartial<Period> | undefined;
}) {
  const invalidHourMessage = "invalid hour time";
  const ValidationSchema = yup.object().shape({
    start: yup.string().matches(hourRegex, invalidHourMessage),
    end: yup.string().matches(hourRegex, invalidHourMessage),
  });
  let formik = useFormik<DeepPartial<Period>>({
    initialValues: value || {
      start: "",
      end: "",
    },
    validationSchema: ValidationSchema,
    async onSubmit(values) {
      throw new Error("this method should not be submitted");
    },
  });

  useEffect(() => {
    console.log(formik.values, formik.errors);
    let newEvent: ResizableMultiInputEvent = {
      currentTarget: {
        value: formik.values,
      },
    };
    onChange(newEvent);
  }, [formik.values]);

  return (
    <div className="w-full flex flex-col">
      <div className={`${className || ""} w-full flex gap-2`}>
        <TextField
          id="start"
          label="Start Time"
          value={formik.values.start}
          className="w-full"
          error={Boolean(formik.errors.start)}
          onChange={formik.handleChange}
          helperText={formik.errors.start && String(formik.errors.start)}
        />
        <p className="self-center">-</p>
        <TextField
          id="end"
          label="End Time"
          value={formik.values.end}
          className="w-full"
          error={Boolean(formik.errors.end)}
          onChange={formik.handleChange}
          helperText={formik.errors.end && String(formik.errors.end)}
        />
      </div>
      {/* <p className="text-[red]">{helperText}</p> */}
    </div>
  );
}
