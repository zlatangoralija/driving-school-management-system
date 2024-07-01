import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import React from "react";
import Logo from "../../../images/full-logo-vertical.png";
import FlashNotification from "@/Components/FlashNotification.jsx";
import InputLabel from "@/Components/InputLabel.jsx";

export default function ForgotPassword({ status }) {
  const { flash } = usePage().props;
  const [successNotice, setSuccessNotice] = React.useState(null);
  const [errorNotice, setErrorNotice] = React.useState(null);
  const wrapperRef = React.useRef(null);

  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit = (e) => {
    e.preventDefault();

    post(route("password.email"));
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
      <Head title="Forgot Password" />

      <div className="h-full flex flex-col sm:justify-center items-center bg-gray-100 py-6">
        <div ref={wrapperRef}>
          <Link href="/">
            <img src={Logo} className="h-20 mr-3 sm:h-32" alt="Landwind Logo" />
          </Link>
        </div>

        <p className="text-center mt-5 mb-1">
          Forgot your password? No problem. Just let us know your email address{" "}
          <br />
          and we will email you a password reset link that will allow you to
          choose a new one.
        </p>

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

        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg mt-10">
          <form onSubmit={submit}>
            <InputLabel htmlFor="email" value="Email" />

            <TextInput
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="mt-1 block w-full"
              isFocused={true}
              onChange={(e) => setData("email", e.target.value)}
            />

            <InputError message={errors.email} className="mt-2" />

            <div className="flex items-center justify-end mt-4">
              <button className="ml-3 button button-blue" disabled={processing}>
                Email Password Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
