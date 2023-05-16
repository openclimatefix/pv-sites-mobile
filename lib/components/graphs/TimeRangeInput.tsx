import { ChangeEventHandler, FC } from 'react';

interface TimeRangeInputProps {
  label: string;
  value: number;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const TimeRangeInput: FC<TimeRangeInputProps> = ({
  label,
  value,
  checked,
  onChange,
}) => {
  return (
    <label className="block" htmlFor={label}>
      <input
        className="peer sr-only"
        type="radio"
        name={label}
        id={label}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className="relative inline-block h-7 w-10 cursor-pointer rounded-md bg-ocf-gray-1000 pt-0.5 text-center text-ocf-gray-300 peer-checked:rounded-md peer-checked:bg-ocf-yellow-500 peer-checked:text-black peer-focus-visible:ring">
        {label}
      </span>
    </label>
  );
};

export default TimeRangeInput;
