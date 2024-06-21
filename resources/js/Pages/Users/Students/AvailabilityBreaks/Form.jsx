import React, { Fragment } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Form } from "@unform/web";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import {
  addHours,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";

// helpers
import { userTimezone } from "@/Components/Helpers.jsx";

// components
import InputText from "@/Components/InputText.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";

export default function CreateForm(props) {
  const formRef = React.useRef(null);
  const wrapperRef = React.useRef(null);
  const { flash } = usePage().props;

  const [modal, setModal] = React.useState(false);
  const [successNotice, setSuccessNotice] = React.useState(null);
  const [errorNotice, setErrorNotice] = React.useState(null);

  const guess_tz = moment.tz.guess();
  const user_timezone = userTimezone();
  const tz = user_timezone ? user_timezone : guess_tz;
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault(user_timezone ? user_timezone : tz);

  const [startDate, setStartDate] = React.useState(() => {
    if (props.break) {
      return new Date(props.break.start_time);
    } else {
      const currentDate = new Date();
      const plusOneHour = addHours(currentDate, 1);
      return setMilliseconds(setSeconds(setMinutes(plusOneHour, 0), 0), 0);
    }
  });

  const [endDate, setEndDate] = React.useState(
    props.break?.end_time ? new Date(props.break.end_time) : null
  );

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    let isTimeInArray = false;

    if (props.breaks && props.breaks.length) {
      const excluded = props.breaks.map((time) =>
        setHours(setMinutes(new Date(time.date), time.minutes), time.hours)
      );

      const convertedDates = excluded.map((dateStr) => {
        const originalFormat = "YYYY-MM-DD HH:mm:ss";
        const parsedDate = dayjs(
          dateStr,
          "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
        ).format(originalFormat);
        const muscatDate = dayjs.utc(parsedDate, originalFormat).tz(tz);
        return muscatDate.toDate();
      });

      isTimeInArray = convertedDates.some(
        (date) => date.getTime() === time.getTime()
      );
    }

    return !isTimeInArray && currentDate.getTime() < selectedDate.getTime();
  };

  const submit = async (data) => {
    try {
      const formData = formRef.current.getData();

      // Remove all previous errors
      formRef.current.setErrors({});

      let finalData = {
        ...formData,
        start_time: startDate,
        end_time: endDate,
      };

      if (props.break) {
        router.put(
          route("students.availability-breaks.update", {
            availability_break: props.break,
          }),
          finalData,
          {
            onError: (errors) => {
              formRef.current.setErrors(errors);
            },
          }
        );
      } else {
        router.post(route("students.availability-breaks.store"), finalData, {
          onError: (errors) => {
            formRef.current.setErrors(errors);
          },
        });
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
    if (formRef.current && props.break) {
      formRef.current.setFieldValue("start_time", props.break.start_time);
      formRef.current.setFieldValue("end_time", props.break.end_time);
      formRef.current.setFieldValue("reason", props.break.reason);
    }
  }, [props.break]);

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
        title={
          props.break
            ? "Edit availability break"
            : "Create new availability break"
        }
      />

      <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {props.break
            ? "Edit availability break"
            : "Create new availability break"}
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
          <div className="flex gap-3">
            <div className="datepicker-wrapper flex flex-col">
              <label htmlFor="start_time">Start time</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                todayButton="Today"
                filterTime={filterPassedTime}
                dateFormat="MMMM d, yyyy h:mm aa"
                form="external-form"
                label="1"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="start_time">End time</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                todayButton="Today"
                filterTime={filterPassedTime}
                dateFormat="MMMM d, yyyy h:mm aa"
                form="external-form"
                label="1"
              />
            </div>
          </div>

          <InputText name="reason" label="Reason" />

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
