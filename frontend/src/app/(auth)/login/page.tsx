"use client";
import useSession from "@/hooks/useSession";
import { Button, TextField } from "@mui/material";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export default function () {
  const router = useRouter();
  const { session, updateSession } = useSession();
  return (
    <main>
      <div className="absolute h-full w-full flex items-center justify-center">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            console.log("submiting... ", values);

            const result = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
            const token = (await result.json()).token;

            if (!result.ok) {
              setErrors({
                email: "Wrong username or password",
              });
            }
            await updateSession(token);
            setSubmitting(false);
            router.push("/");
            router.refresh();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="rounded-lg p-2 bg-white border-solid border-2 flex flex-col gap-2 w-2/3 sm:w-1/2 text-inherit"
            >
              <p className="text-black text-2xl text-center">Login</p>
              <TextField
                name="email"
                placeholder="your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                name="password"
                placeholder="your password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={errors.password}
              />
              <Button type="submit" disabled={isSubmitting}>
                Sign In
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </main>
  );
}
