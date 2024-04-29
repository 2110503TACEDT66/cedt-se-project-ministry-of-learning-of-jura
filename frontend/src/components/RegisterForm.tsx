"use client"
import useSession from "@/hooks/useSession";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";
export default function () {
  const { updateSession } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [alertMessages, setAlertMessage] = useState<{
    title: string | null,
    description: string | null
  }>({
    title: null,
    description: null
  });
  const router = useRouter();
  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password")], "Password and confirm password aren't the same"
      )
      .required('Confirm password is required'),
    role: yup.string().oneOf(["restaurantOwner","user"]).required("Please select your role")
  });

  const formik = useFormik<{
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: string
  }>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: ""
    },
    validationSchema: validationSchema,
    async onSubmit(values, { setSubmitting, setErrors }) {
      const result = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      })
      const response = await result.json();
      if (!result.ok || !response.success) {
        setIsAlerting(true);
        setAlertMessage({
          title: "Error",
          description: "Some thing is wrong, maybe username or email is already taken"
        })
        return;
      }
      setIsAlerting(true);
      setAlertMessage({
        title: "Success!",
        description: "Successfully registered"
      })
      await updateSession(response.token)
      setSubmitting(false)
      // router.back();
    }
  })

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Dialog
        open={isAlerting}
        onClose={() => setIsAlerting(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {alertMessages.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertMessages.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            if (alertMessages.title == "Success!") {
              router.push("/")
            }
            setIsAlerting(false)
          }}>Ok</Button>
        </DialogActions>
      </Dialog>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2 w-2/3 sm:w-1/2 bg-white border-solid border-gray border-2 p-2 rounded-2xl top-1/2 transform -translate-y-1/2 absolute">
        <p className="text-black text-2xl text-center">Register</p>
        <TextField
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.username)}
          helperText={formik.errors.username}
        />
        <TextField
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.email)}
          helperText={formik.errors.email}
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.password)}
          helperText={formik.errors.password}
        />
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.confirmPassword)}
          helperText={formik.errors.confirmPassword}
        />
        
        <TextField
          id="role"
          name="role"
          label="Select Your Role"
          select
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.role)}
          helperText={formik.errors.role}
        >
          <MenuItem value="restaurantOwner">Restaurant Owner</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </TextField>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    </div>
  )
}