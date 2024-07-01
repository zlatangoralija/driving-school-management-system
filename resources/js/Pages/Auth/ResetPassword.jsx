import React, { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Logo from "../../../images/full-logo-vertical.png";
import FlashNotification from "@/Components/FlashNotification.jsx";

export default function ResetPassword({ token, email }) {
  const { flash } = usePage().props;
  const [successNotice, setSuccessNotice] = React.useState(null);
  const [errorNotice, setErrorNotice] = React.useState(null);
  const wrapperRef = React.useRef(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();

    post(route("password.store"));
  };

  React.useEffect(() => {
    if (flash && Object.keys(flash).length) {
      if (flash.success) {
        setSuccessNotice(flash.success);
      }

      if (flash.errors) {
        setErrorNotice(flash.errors);
      }

      if (successNotice || errorNotice) {
        wrapperRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [flash]);

  return (
    <>
      <Head title="Reset Password" />

      <div className="h-full flex flex-col sm:justify-center items-center bg-gray-100 py-6">
        <div ref={wrapperRef}>
          <Link href="/">
            <img src={Logo} className="h-20 mr-3 sm:h-32" alt="Landwind Logo" />
          </Link>
        </div>

        <p className="mt-5 mb-1 text-center">Reset your account password</p>

        {successNotice && flash.success && (
          <FlashNotification type="success" title={flash.success} />
        )}

        {errorNotice && flash && (
          <FlashNotification
            type="error"
            title="Please fix the following errors"
            list={errorNotice}
            button={
              <button
                type="button"
                className="_button small !whitespace-nowrap"
                onClick={() => setErrorNotice(null)}
              >
                close
              </button>
            }
          />
        )}

        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <form onSubmit={submit}>
            <div>
              <InputLabel htmlFor="email" value="Email" />

              <TextInput
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="mt-1 block w-full"
                autoComplete="username"
                onChange={(e) => setData("email", e.target.value)}
              />

              <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mt-4">
              <InputLabel htmlFor="password" value="Password" />

              <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full"
                autoComplete="new-password"
                isFocused={true}
                onChange={(e) => setData("password", e.target.value)}
              />

              <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="mt-4">
              <InputLabel
                htmlFor="password_confirmation"
                value="Confirm Password"
              />

              <TextInput
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={data.password_confirmation}
                className="mt-1 block w-full"
                autoComplete="new-password"
                onChange={(e) =>
                  setData("password_confirmation", e.target.value)
                }
              />

              <InputError
                message={errors.password_confirmation}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-end mt-4">
              <button className="ml-3 button button-blue" disabled={processing}>
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
