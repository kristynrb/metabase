import React from "react";

import DatePicker, { getDateTimeFieldTarget } from "./DatePicker";
import HoursMinutesInput from "./HoursMinutesInput";
import { mbqlEq } from "metabase/lib/query/util";
import { parseTime } from "metabase/lib/time";

const TimeInput = ({ value, onChange }) => {
    const time = parseTime(value);
    return (
      <HoursMinutesInput
        hours={time.hour()}
        minutes={time.minute()}
        onChangeHours={(hours) => onChange(time.hour(hours).format("HH:mm:00.000"))}
        onChangeMinutes={(minutes) => onChange(time.minute(minutes).format("HH:mm:00.000"))}
      />
    );
}

const SingleTimePicker = ({ filter, onFilterChange }) =>
  <div className="mx2 mb1">
    <TimeInput value={getTime(filter[2])} onChange={(time) => onFilterChange([filter[0], filter[1], time])} />
  </div>

const MultiTimePicker = ({ filter, onFilterChange }) =>
  <div className="flex mx2 mb1">
    <TimeInput value={getTime(filter[2])} onChange={(time) => onFilterChange([filter[0], filter[1], ...sortTimes(time, filter[3])])} />
    <TimeInput value={getTime(filter[3])} onChange={(time) => onFilterChange([filter[0], filter[1], ...sortTimes(filter[2], time)])} />
  </div>

const sortTimes = (a, b) => {
    console.log(parseTime(a).isAfter(parseTime(b)))
    return parseTime(a).isAfter(parseTime(b)) ? [b, a] : [a, b];
}

const getTime = (value) => {
    if (typeof value === "string" && /^\d+:\d+(:\d+(.\d+(\+\d+:\d+)?)?)?$/.test(value)) {
      return value;
    } else {
      return "00:00:00.000+00:00"
    }
}

export const TIME_OPERATORS: Operator[] = [
  {
      name: "Before",
      init: (filter) =>  ["<", getDateTimeFieldTarget(filter[1]), getTime(filter[2])],
      test: ([op]) => op === "<",
      widget: SingleTimePicker,
  },
  {
      name: "After",
      init: (filter) => [">", getDateTimeFieldTarget(filter[1]), getTime(filter[2])],
      test: ([op]) => op === ">",
      widget: SingleTimePicker,
  },
  {
      name: "Between",
      init: (filter) => ["BETWEEN", getDateTimeFieldTarget(filter[1]), getTime(filter[2]), getTime(filter[3])],
      test: ([op]) => mbqlEq(op, "between"),
      widget: MultiTimePicker,
  },
]

const TimePicker = (props) =>
  <DatePicker {...props} operators={TIME_OPERATORS} />

export default TimePicker;
