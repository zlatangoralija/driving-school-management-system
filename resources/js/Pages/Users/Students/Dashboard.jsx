import { Head, router } from "@inertiajs/react";
import React from "react";
import { Form } from "@unform/web";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import {
  addHours,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";
import dayjs from "dayjs";
import {
  FcAlarmClock,
  FcCalendar,
  FcApproval,
  FcMoneyTransfer,
} from "react-icons/fc";

// helpers
import { timezoneDate } from "@/Components/Helpers.jsx";

// components
import ProgressBarOutside from "@/Components/ProgressOutside";
import ProgressBarInside from "@/Components/ProgressInside";
import Modal from "@/Components/Modal.jsx";

export default function Dashboard(props) {
  const [drivingTestModal, setDrivingTestModal] = React.useState(false);
  const drivingTestForm = React.useRef(null);
  const [startDate, setStartDate] = React.useState(() => {
    const currentDate = new Date();
    const plusOneHour = addHours(currentDate, 1);
    return setMilliseconds(setSeconds(setMinutes(plusOneHour, 0), 0), 0);
  });

  let isTimeInArray = false;
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    if (props.excluded_slots && props.excluded_slots.length) {
      const excluded = props.excluded_slots.map((time) =>
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

  const bookDrivingTest = async (data) => {
    try {
      let finalData = {
        start_time: startDate,
      };

      router.post(route("students.book-driving-test"), finalData, {
        onSuccess: (res) => {
          setDrivingTestModal(false);
        },
        onError: (errors) => {
          drivingTestForm.current.setErrors(errors);
        },
      });
    } catch (err) {
      console.log(err);
      const validationErrors = {};
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        bookingInviteForm.current.setErrors(validationErrors);
      }
    }
  };

  const pieData = [
    {
      id: "make",
      label: "make",
      value: 387,
      color: "#2256AD",
    },
    {
      id: "elixir",
      label: "elixir",
      value: 222,
      color: "#C36FD8",
    },
    {
      id: "rust",
      label: "rust",
      value: 80,
      color: "#B754D0",
    },
    {
      id: "stylus",
      label: "stylus",
      value: 434,
      color: "#DADBDD",
    },
    {
      id: "haskel",
      label: "haskelll",
      value: 265,
      color: "#B4B7BC",
    },
  ];

  const barData = [
    {
      country: "AD",
      "hot dog": 124,
      "hot dogColor": "#2256AD",
      burger: 85,
      burgerColor: "#4E78BD",
      sandwich: 100,
      sandwichColor: "#2256AD",
      kebab: 176,
      kebabColor: "#B754D0",
      fries: 40,
      friesColor: "#C36FD8",
      donut: 55,
      donutColor: "#EEEEEE",
    },
    {
      country: "AE",
      "hot dog": 123,
      "hot dogColor": "#2256AD",
      burger: 80,
      burgerColor: "#4E78BD",
      sandwich: 158,
      sandwichColor: "#2256AD",
      kebab: 166,
      kebabColor: "#B754D0",
      fries: 175,
      friesColor: "#C36FD8",
      donut: 98,
      donutColor: "#EEEEEE",
    },
    {
      country: "AF",
      "hot dog": 190,
      "hot dogColor": "#2256AD",
      burger: 34,
      burgerColor: "#4E78BD",
      sandwich: 106,
      sandwichColor: "#2256AD",
      kebab: 0,
      kebabColor: "#B754D0",
      fries: 161,
      friesColor: "#C36FD8",
      donut: 24,
      donutColor: "#EEEEEE",
    },
    {
      country: "AG",
      "hot dog": 72,
      "hot dogColor": "#2256AD",
      burger: 199,
      burgerColor: "#4E78BD",
      sandwich: 187,
      sandwichColor: "#2256AD",
      kebab: 29,
      kebabColor: "#B754D0",
      fries: 111,
      friesColor: "#C36FD8",
      donut: 95,
      donutColor: "#EEEEEE",
    },
    {
      country: "AI",
      "hot dog": 60,
      "hot dogColor": "#2256AD",
      burger: 134,
      burgerColor: "#4E78BD",
      sandwich: 141,
      sandwichColor: "#2256AD",
      kebab: 161,
      kebabColor: "#B754D0",
      fries: 145,
      friesColor: "#C36FD8",
      donut: 148,
      donutColor: "#EEEEEE",
    },
    {
      country: "AL",
      "hot dog": 5,
      "hot dogColor": "#2256AD",
      burger: 0,
      burgerColor: "#4E78BD",
      sandwich: 50,
      sandwichColor: "#2256AD",
      kebab: 175,
      kebabColor: "#B754D0",
      fries: 28,
      friesColor: "#C36FD8",
      donut: 161,
      donutColor: "#EEEEEE",
    },
    {
      country: "AM",
      "hot dog": 89,
      "hot dogColor": "#2256AD",
      burger: 190,
      burgerColor: "#4E78BD",
      sandwich: 53,
      sandwichColor: "#2256AD",
      kebab: 130,
      kebabColor: "#B754D0",
      fries: 174,
      friesColor: "#C36FD8",
      donut: 183,
      donutColor: "#EEEEEE",
    },
  ];

  return (
    <>
      <Head title="Dashboard" />

      <div className="mb-10 mt-7">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Hello, {props.auth.user.name}
        </h3>
      </div>

      <div className="mb-8">
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="card card-purple-light">
            <dt className="truncate text-sm font-medium">Courses</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {props.courses_count}
            </dd>
          </div>

          <div className="card card-blue">
            <dt className="truncate text-sm font-medium">Total bookings</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {props.total_booking_count}
            </dd>
          </div>

          <div className="card card-gray">
            <dt className="truncate text-sm font-medium">Upcoming bookings</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {props.upcoming_booking_count}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card mb-8">
          <ProgressBarOutside
            label="Lessons finished"
            percentage={props.finished_courses_percentage}
          />
        </div>
        <div className="card mb-8">
          <ProgressBarOutside
            label="Lessons paid"
            percentage={props.paid_courses_percentage}
          />
        </div>
      </div>

      {props.upcoming_booking || props.latest_invoice ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {props.upcoming_booking && (
              <div className="card">
                <div className="flex items-center gap-4">
                  <FcAlarmClock className="w-10 h-10" />
                  <div className="flex flex-col">
                    <span className="font-bold text-2xl">Upcoming booking</span>
                    <span className="text-gray-600">
                      {timezoneDate(props.upcoming_booking.start_time).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {props.latest_invoice && (
              <div className="card">
                <div className="flex items-center gap-4">
                  <FcMoneyTransfer className="w-10 h-10" />
                  <div className="flex flex-col">
                    <span className="font-bold text-2xl">Latest invoice</span>
                    <span className="text-gray-600">
                      {timezoneDate(props.latest_invoice.created_at).format(
                        "DD/MM/YYYY HH:mm"
                      )}{" "}
                      - {props.latest_invoice.amount} EUR
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        ""
      )}

      {/*<div className="h-[500px]">*/}
      {/*    <ResponsivePie*/}
      {/*        data={pieData}*/}
      {/*        margin={{top: 40, right: 80, bottom: 80, left: 80}}*/}
      {/*        innerRadius={0.5}*/}
      {/*        padAngle={0.7}*/}
      {/*        cornerRadius={3}*/}
      {/*        activeOuterRadiusOffset={8}*/}
      {/*        borderWidth={1}*/}
      {/*        borderColor={{*/}
      {/*            from: "color",*/}
      {/*            modifiers: [["darker", 0.2]],*/}
      {/*        }}*/}
      {/*        arcLinkLabelsSkipAngle={10}*/}
      {/*        arcLinkLabelsTextColor="#333333"*/}
      {/*        arcLinkLabelsThickness={2}*/}
      {/*        arcLinkLabelsColor={{from: "color"}}*/}
      {/*        arcLabelsSkipAngle={10}*/}
      {/*        arcLabelsTextColor={{*/}
      {/*            from: "color",*/}
      {/*            modifiers: [["darker", 2]],*/}
      {/*        }}*/}
      {/*        defs={[*/}
      {/*            {*/}
      {/*                id: "dots",*/}
      {/*                type: "patternDots",*/}
      {/*                background: "inherit",*/}
      {/*                color: "#EEEEEE",*/}
      {/*                size: 4,*/}
      {/*                padding: 1,*/}
      {/*                stagger: true,*/}
      {/*            },*/}
      {/*            {*/}
      {/*                id: "lines",*/}
      {/*                type: "patternLines",*/}
      {/*                background: "inherit",*/}
      {/*                color: "#B754D0",*/}
      {/*                rotation: -45,*/}
      {/*                lineWidth: 4,*/}
      {/*                spacing: 10,*/}
      {/*            },*/}
      {/*        ]}*/}
      {/*        fill={[*/}
      {/*            {*/}
      {/*                match: {*/}
      {/*                    id: "python",*/}
      {/*                },*/}
      {/*                id: "dots",*/}
      {/*            },*/}
      {/*            {*/}
      {/*                match: {*/}
      {/*                    id: "stylus",*/}
      {/*                },*/}
      {/*                id: "dots",*/}
      {/*            },*/}
      {/*            {*/}
      {/*                match: {*/}
      {/*                    id: "elixir",*/}
      {/*                },*/}
      {/*                id: "lines",*/}
      {/*            },*/}
      {/*        ]}*/}
      {/*        colors={{datum: "data.color"}}*/}
      {/*        theme={{*/}
      {/*            labels: {*/}
      {/*                text: {*/}
      {/*                    fontSize: 16,*/}
      {/*                    fontWeight: 700,*/}
      {/*                },*/}
      {/*            },*/}
      {/*            // legends: {*/}
      {/*            //   text: {*/}
      {/*            //     fontSize: 12,*/}
      {/*            //     fontWeight: 700,*/}
      {/*            //   },*/}
      {/*            // },*/}
      {/*        }}*/}
      {/*        legends={[*/}
      {/*            {*/}
      {/*                anchor: "bottom",*/}
      {/*                direction: "row",*/}
      {/*                justify: false,*/}
      {/*                translateX: 0,*/}
      {/*                translateY: 56,*/}
      {/*                itemsSpacing: 0,*/}
      {/*                itemWidth: 100,*/}
      {/*                itemHeight: 18,*/}
      {/*                itemTextColor: "#999",*/}
      {/*                itemDirection: "left-to-right",*/}
      {/*                itemOpacity: 1,*/}
      {/*                symbolSize: 18,*/}
      {/*                symbolShape: "circle",*/}
      {/*                effects: [*/}
      {/*                    {*/}
      {/*                        on: "hover",*/}
      {/*                        style: {*/}
      {/*                            itemTextColor: "#000",*/}
      {/*                            itemTextWidth: "700",*/}
      {/*                        },*/}
      {/*                    },*/}
      {/*                ],*/}
      {/*            },*/}
      {/*        ]}*/}
      {/*    />*/}
      {/*</div>*/}

      {/*<div className="h-[500px]">*/}
      {/*    <ResponsiveBar*/}
      {/*        data={barData}*/}
      {/*        keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}*/}
      {/*        indexBy="country"*/}
      {/*        margin={{top: 50, right: 130, bottom: 50, left: 60}}*/}
      {/*        padding={0.3}*/}
      {/*        valueScale={{type: "linear"}}*/}
      {/*        indexScale={{type: "band", round: true}}*/}
      {/*        //   colors={{ scheme: "nivo" }}*/}
      {/*        colors={({id, data}) => data[`${id}Color`]}*/}
      {/*        theme={{*/}
      {/*            labels: {*/}
      {/*                text: {*/}
      {/*                    fontSize: 14,*/}
      {/*                    fontWeight: 700,*/}
      {/*                },*/}
      {/*            },*/}
      {/*            // legends: {*/}
      {/*            //   text: {*/}
      {/*            //     fontSize: 12,*/}
      {/*            //     fontWeight: 700,*/}
      {/*            //   },*/}
      {/*            // },*/}
      {/*        }}*/}
      {/*        defs={[*/}
      {/*            {*/}
      {/*                id: "dots",*/}
      {/*                type: "patternDots",*/}
      {/*                background: "inherit",*/}
      {/*                color: "#B754D0",*/}
      {/*                size: 4,*/}
      {/*                padding: 1,*/}
      {/*                stagger: true,*/}
      {/*            },*/}
      {/*            {*/}
      {/*                id: "lines",*/}
      {/*                type: "patternLines",*/}
      {/*                background: "inherit",*/}
      {/*                color: "#4E78BD",*/}
      {/*                rotation: -45,*/}
      {/*                lineWidth: 6,*/}
      {/*                spacing: 10,*/}
      {/*            },*/}
      {/*        ]}*/}
      {/*        fill={[*/}
      {/*            {*/}
      {/*                match: {*/}
      {/*                    id: "fries",*/}
      {/*                },*/}
      {/*                id: "dots",*/}
      {/*            },*/}
      {/*            {*/}
      {/*                match: {*/}
      {/*                    id: "sandwich",*/}
      {/*                },*/}
      {/*                id: "lines",*/}
      {/*            },*/}
      {/*        ]}*/}
      {/*        borderColor={{*/}
      {/*            from: "color",*/}
      {/*            modifiers: [["darker", 1.6]],*/}
      {/*        }}*/}
      {/*        axisTop={null}*/}
      {/*        axisRight={null}*/}
      {/*        axisBottom={{*/}
      {/*            tickSize: 5,*/}
      {/*            tickPadding: 5,*/}
      {/*            tickRotation: 0,*/}
      {/*            legend: "country",*/}
      {/*            legendPosition: "middle",*/}
      {/*            legendOffset: 32,*/}
      {/*            truncateTickAt: 0,*/}
      {/*        }}*/}
      {/*        axisLeft={{*/}
      {/*            tickSize: 5,*/}
      {/*            tickPadding: 5,*/}
      {/*            tickRotation: 0,*/}
      {/*            legend: "food",*/}
      {/*            legendPosition: "middle",*/}
      {/*            legendOffset: -40,*/}
      {/*            truncateTickAt: 0,*/}
      {/*        }}*/}
      {/*        labelSkipWidth={12}*/}
      {/*        labelSkipHeight={12}*/}
      {/*        labelTextColor={{*/}
      {/*            from: "color",*/}
      {/*            modifiers: [["darker", 1.6]],*/}
      {/*        }}*/}
      {/*        legends={[*/}
      {/*            {*/}
      {/*                dataFrom: "keys",*/}
      {/*                anchor: "bottom-right",*/}
      {/*                direction: "column",*/}
      {/*                justify: false,*/}
      {/*                translateX: 120,*/}
      {/*                translateY: 0,*/}
      {/*                itemsSpacing: 2,*/}
      {/*                itemWidth: 100,*/}
      {/*                itemHeight: 20,*/}
      {/*                itemDirection: "left-to-right",*/}
      {/*                itemOpacity: 0.85,*/}
      {/*                symbolSize: 20,*/}
      {/*                effects: [*/}
      {/*                    {*/}
      {/*                        on: "hover",*/}
      {/*                        style: {*/}
      {/*                            itemOpacity: 1,*/}
      {/*                        },*/}
      {/*                    },*/}
      {/*                ],*/}
      {/*            },*/}
      {/*        ]}*/}
      {/*        role="application"*/}
      {/*        ariaLabel="Nivo bar chart demo"*/}
      {/*        barAriaLabel={(e) =>*/}
      {/*            e.id + ": " + e.formattedValue + " in country: " + e.indexValue*/}
      {/*        }*/}
      {/*    />*/}
      {/*</div>*/}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card mb-8">
          <ProgressBarOutside
            title="Lessons finished"
            info="Active"
            label="307 of 859 Pupils"
            percentage={props.finished_courses_percentage}
          />
        </div>
        <div className="card mb-8">
          <ProgressBarOutside
            title="Lessons paid"
            info="Last 12 Months"
            label="237 of 363 Successful"
            percentage={props.paid_courses_percentage}
          />
        </div>
      </div> */}

      {/*<div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">*/}
      {/*    <div className="button-pill button-pill-orange">*/}
      {/*        Test Test Test Test*/}
      {/*    </div>*/}
      {/*    <div className="button-pill button-pill-blue">Test</div>*/}
      {/*    <div className="button-pill button-pill-green">Test</div>*/}
      {/*    <div className="button-pill button-pill-red">Test</div>*/}
      {/*    <div className="button-pill button-pill-gray">Test</div>*/}
      {/*    <div className="button-pill button-pill-gradiant">Test</div>*/}
      {/*</div>*/}

      {/*<div className="mb-8">*/}
      {/*    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">*/}
      {/*        <div className="card">*/}
      {/*            <dt className="truncate text-sm font-medium">Courses</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                1*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card">*/}
      {/*            <dt className="truncate text-sm font-medium">Students</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                2*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card">*/}
      {/*            <dt className="truncate text-sm font-medium">Upcomming bookings</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                3*/}
      {/*            </dd>*/}
      {/*        </div>*/}
      {/*    </dl>*/}
      {/*</div>*/}

      {/*<div className="mb-8">*/}
      {/*    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">*/}
      {/*        <div className="card card-orange">*/}
      {/*            <dt className="truncate text-sm font-medium">Courses</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                1*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card card-green">*/}
      {/*            <dt className="truncate text-sm font-medium">Students</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                2*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card card-red">*/}
      {/*            <dt className="truncate text-sm font-medium">Upcomming bookings</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                3*/}
      {/*            </dd>*/}
      {/*        </div>*/}
      {/* <div className="card card-blue">
        <dt className="truncate text-sm font-medium">Upcomming bookings</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          3
        </dd>
      </div> */}
      {/*    </dl> */}
      {/*</div>*/}

      {/*<div className="mb-8">*/}
      {/*    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">*/}
      {/*        <div className="card card-gray">*/}
      {/*            <dt className="truncate text-sm font-medium">Courses</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                1*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card card-gray">*/}
      {/*            <dt className="truncate text-sm font-medium">Students</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                2*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card card-gray">*/}
      {/*            <dt className="truncate text-sm font-medium">Upcomming bookings</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                3*/}
      {/*            </dd>*/}
      {/*        </div>*/}
      {/*    </dl>*/}
      {/*</div>*/}

      {/*<div className="mb-8">*/}
      {/*    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">*/}
      {/*        <div className="card card-gradiant">*/}
      {/*            <dt className="truncate text-sm font-medium">Courses</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                1*/}
      {/*            </dd>*/}
      {/*        </div>*/}

      {/*        <div className="card card-gradiant">*/}
      {/*            <dt className="truncate text-sm font-medium">Students</dt>*/}
      {/*            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">*/}
      {/*                2*/}
      {/*            </dd>*/}
      {/*        </div>*/}
      {/*    </dl>*/}
      {/*</div>*/}

      {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">*/}
      {/* <div className="card">
        <div className="flex items-center gap-4">
          <FcAlarmClock className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="font-bold text-2xl">517</span>
            <span className="text-gray-600">Schedule</span>
          </div>
        </div>
      </div> */}
      {/*    <div className="card min-h-44">*/}
      {/*        <div className="flex items-center gap-4">*/}
      {/*            <FcCalendar className="w-10 h-10"/>*/}
      {/*            <div className="flex flex-col">*/}
      {/*                <span className="font-bold text-2xl">517</span>*/}
      {/*                <span className="text-gray-600">Schedule</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}

      {/*<div className="card mb-8">*/}
      {/*    <h2 className="mb-6">Title</h2>*/}
      {/*    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">*/}
      {/*        <div className="flex gap-4">*/}
      {/*            <FcApproval className="w-10 h-10"/>*/}
      {/*            <div>*/}
      {/*                <h4>Test</h4>*/}
      {/*                <span className="text-green">3.52 per Test</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*        <div className="flex gap-4">*/}
      {/*            <FcApproval className="w-10 h-10"/>*/}
      {/*            <div>*/}
      {/*                <h4>Test</h4>*/}
      {/*                <span className="text-green">3.52 per Test</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*        <div className="flex gap-4">*/}
      {/*            <FcApproval className="w-10 h-10"/>*/}
      {/*            <div>*/}
      {/*                <h4>Test</h4>*/}
      {/*                <span className="text-green">3.52 per Test</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*        <div className="flex gap-4">*/}
      {/*            <FcApproval className="w-10 h-10"/>*/}
      {/*            <div>*/}
      {/*                <h4>Test</h4>*/}
      {/*                <span className="text-green">3.52 per Test</span>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}

      {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-8">*/}
      {/*    <div className="card mb-8">*/}
      {/*        <ProgressBarOutside label="Label" percentage={20}/>*/}
      {/*    </div>*/}
      {/*    <div className="card mb-8">*/}
      {/*        <ProgressBarOutside label="Label" percentage={70}/>*/}
      {/*    </div>*/}
      {/*    <div className="card mb-8">*/}
      {/*        <ProgressBarOutside label="Label" percentage={90}/>*/}
      {/*    </div>*/}
      {/*</div>*/}

      {/* <div className="flex gap-5 mb-8">
        <ProgressBarInside percentage={20} />
        <ProgressBarInside percentage={60} />
        <ProgressBarInside percentage={90} />
      </div> */}

      {/*<div className="bg-white shadow sm:rounded-lg mb-3">*/}
      {/*    <div className="px-4 py-5 sm:p-6">*/}
      {/*        <h3 className="text-base font-semibold leading-6 text-gray-900">*/}
      {/*            Driving test*/}
      {/*        </h3>*/}
      {/*        <div className="mt-5">*/}
      {/*            <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">*/}
      {/*                <h4 className="sr-only">Driving test</h4>*/}
      {/*                {props.auth.user.driving_test_booked ? (*/}
      {/*                    <>*/}
      {/*                        <p>Your driving test date is:.</p>*/}
      {/*                        <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">*/}
      {/*                            {timezoneDate(props.auth.user.driving_test_booked).format(*/}
      {/*                                "DD/MM/YYYY H:mm"*/}
      {/*                            )}*/}
      {/*                        </div>*/}
      {/*                    </>*/}
      {/*                ) : (*/}
      {/*                    <>*/}
      {/*                        <p>You haven't booked your driving test yet.</p>*/}
      {/*                        <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">*/}
      {/*                            <a*/}
      {/*                                href={"#"}*/}
      {/*                                onClick={() => setDrivingTestModal(true)}*/}
      {/*                                type="button"*/}
      {/*                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"*/}
      {/*                            >*/}
      {/*                                Book now*/}
      {/*                            </a>*/}
      {/*                        </div>*/}
      {/*                    </>*/}
      {/*                )}*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}

      <Modal
        className="max-w-3xl"
        status={drivingTestModal}
        close={() => setDrivingTestModal(false)}
        title={"Confirm booking"}
        content={
          <div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-lg">Select date of your driving test</p>

              <Form
                ref={drivingTestForm}
                onSubmit={bookDrivingTest}
                className="w-full text-center"
              >
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  // todayButton="Today"
                  filterTime={filterPassedTime}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  form="external-form"
                />
              </Form>
            </div>
          </div>
        }
        footer={
          <div className="footer-modal">
            <button
              type="button"
              onClick={() => setDrivingTestModal(false)}
              className="button button-blue-outline w-full"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => drivingTestForm.current.submitForm()}
              className="button button-blue w-full"
            >
              Confirm
            </button>
          </div>
        }
      />
    </>
  );
}
