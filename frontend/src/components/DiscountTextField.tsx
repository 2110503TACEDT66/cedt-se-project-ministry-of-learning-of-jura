import {
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

import { Discount, ResizableMultiInputEvent } from "../../interface";
import { useFormik } from "formik";
import * as yup from "yup";

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
  helperText?: {
    name?: string;
    description?: string;
    points?: number;
    isValid?: boolean;
  };
  value: Discount | undefined;
}) {
  const nameErrorMessage = "name must be string";
  const descriptionErrorMessage = "description must be string";
  const pointsErrorMessage = "points must be number";
  const isValidErrorMessage = "is valid must be boolean";
  const ValidationSchema = yup.object({
    name: yup.string().required(nameErrorMessage),
    description: yup.string().required(descriptionErrorMessage),
    points: yup.number().required(pointsErrorMessage).typeError(pointsErrorMessage),
    isValid: yup.boolean().required(isValidErrorMessage),
  });
  const formik = useFormik<{
    name: string;
    description: string;
    points: string;
    isValid: boolean;
  }>({
    initialValues: {
      name: value?.name || "",
      description: value?.description || "",
      points: value?.points == undefined ? "" : String(value?.points),
      isValid: value?.isValid || true,
    },
    validationSchema: ValidationSchema,
    async onSubmit() {
      throw new Error("this form is not intended to be submitted!");
    },
  });
  useEffect(() => {
    let { name, description, points, isValid } = formik.values;
    onChange({
      currentTarget: {
        value: {
          name,
          description,
          points,
          isValid,
        },
      },
    });
  }, [formik.values]);
  return (
    <div className="w-full flex flex-col">
      <div className={`${className || ""} w-full flex gap-2`}>
        <TextField
          id="name"
          label="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.name)}
          className="grow"
          helperText={formik.errors.name}
        ></TextField>
        <TextField
          id="description"
          label="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.description)}
          className="grow"
          helperText={formik.errors.description}
        ></TextField>
        <TextField
          id="points"
          label="points"
          value={formik.values.points}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.points)}
          className="grow"
          helperText={formik.errors.points}
        ></TextField>
        <FormGroup>
          <FormControlLabel
            id="isValid"
            control={<Checkbox id="isValid" onChange={formik.handleChange} />}
            label={formik.values.isValid ? "valid" : "invalid"}
            onChange={formik.handleChange}
          />
        </FormGroup>
      </div>
      {/* <p className="text-[red]">{helperText}</p> */}
    </div>
  );
}
