import React, { Fragment } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import InputText from "@/Components/InputText.jsx";
import { Form } from "@unform/web";
import * as Yup from "yup";
import SelectDefault from "@/Components/SelectDefault.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";

export default function CreateForm(props) {
  const formRef = React.useRef(null);
  const wrapperRef = React.useRef(null);
  const { flash } = usePage().props;

  const [modal, setModal] = React.useState(false);
  const [successNotice, setSuccessNotice] = React.useState(null);
  const [errorNotice, setErrorNotice] = React.useState(null);

  const submit = async () => {
    try {
      const formData = formRef.current.getData();

      // Remove all previous errors
      formRef.current.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required."),
        email: Yup.string()
          .email("Email has to be a valid address.")
          .required("Email is required."),
        password: !props.instructor
          ? Yup.string().required("Password is required.")
          : null,
        status: Yup.array().required("Please select status."),
      });

      await schema.validate(formData, {
        abortEarly: false,
      });

      let finalData = {
        ...formData,
        status: formData.status.length > 0 ? formData.status[0].value : null,
      };

      if (props.instructor) {
        router.put(
          route("school-administrators.instructors.update", {
            instructor: props.instructor,
          }),
          finalData,
          {
            onError: (errors) => {
              formRef.current.setErrors(errors);
            },
          }
        );
      } else {
        router.post(
          route("school-administrators.instructors.store"),
          finalData,
          {
            onError: (errors) => {
              formRef.current.setErrors(errors);
            },
          }
        );
      }

      return;
    } catch (err) {
      console.log(err);
      wrapperRef.current.scrollIntoView({ behavior: "smooth" });
      const validationErrors = {};
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        formRef.current.setErrors(validationErrors);
      }
    }
  };

  React.useEffect(() => {
    if (formRef.current && props.instructor) {
      formRef.current.setFieldValue("name", props.instructor.name);
      formRef.current.setFieldValue("email", props.instructor.email);
    }
  }, [props.instructor]);

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
      <Head
        title={props.instructor ? "Edit instructor" : "Create instructor"}
      />

      <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {props.instructor ? "Edit instructor" : "Create instructor"}
        </h1>
        <p className="mt-2 text-sm">Lorem ipsum text</p>
      </div>

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

      <div className="grid grid-cols-0 md:grid-cols-0 gap-6">
        <Form ref={formRef} onSubmit={submit} className="card p-5 mb-3">
          <InputText name="name" label="Name*" />
          <InputText name="email" label="Email*" />
          <SelectDefault
            options={props.statuses}
            defaultValue={
              props.statuses && props.instructor
                ? props.statuses.find(
                    (x) => x.value === props.instructor.status
                  )
                : props.statuses[0]
            }
            label="Account status"
            name="status"
          />
          <InputText type="password" name="password" label="Password*" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <button type="submit" className="button button-blue">
                Save
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
