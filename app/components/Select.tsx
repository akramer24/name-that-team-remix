import classNames from "classnames";
import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type FilterFn = (value: string, choice: string) => boolean;

interface SelectProps {
  choices: Array<string>;
  disableOpen: boolean;
  filterFn: FilterFn;
  onSelect: Function;
  open?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  value?: string | undefined;
}

export default function Select({
  choices,
  disableOpen,
  filterFn,
  onSelect,
  placeholder = "Search...",
  readOnly = false,
  value: passedValue,
}: SelectProps) {
  const [value, setValue] = useState<string | undefined>(passedValue);
  const [showDropdown, setShowDropdown] = useState<Boolean>(false);
  const [activeChoiceIndex, setActiveChoiceIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(passedValue);
  }, [passedValue]);

  const filteredChoices = useMemo(
    () =>
      value && value.length
        ? choices.filter((c) => filterFn(value, c))
        : choices,
    [choices, value]
  );

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
    setActiveChoiceIndex(0);
  };

  const handleSelect = (choice: string | undefined) => {
    setValue(choice);
    setShowDropdown(false);
    setActiveChoiceIndex(0);
    onSelect && onSelect(choice);
  };

  const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown && (evt.key === "ArrowUp" || evt.key === "ArrowDown")) {
      evt.preventDefault();
      setActiveChoiceIndex((old: number) => {
        const newIndex =
          evt.key === "ArrowUp"
            ? Math.max(0, old - 1)
            : Math.min(filteredChoices.length - 1, old + 1);
        dropdownRef.current
          ?.querySelector<HTMLElement>(`[data-index="${newIndex}"]`)
          ?.focus();
        return newIndex;
      });
    } else if (evt.key === "Enter") {
      handleSelect(filteredChoices[activeChoiceIndex]);
      inputRef.current?.blur();
    }
  };

  const handleBlur = (evt: FocusEvent<HTMLInputElement>) => {
    if (!containerRef.current?.contains(evt.relatedTarget)) {
      setShowDropdown(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ maxWidth: 300 }} ref={containerRef}>
      <input
        className="border-gray-200 border p-1 hover:transition hover:border-blue-400"
        onBlur={handleBlur}
        onChange={handleSearch}
        onFocus={() => !disableOpen && setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={inputRef}
        value={value}
      />
      {showDropdown && (
        <div className="relative">
          <div
            className="absolute rounded border border-gray-200 divide-y-2 m-auto left-0 right-0 bg-white"
            ref={dropdownRef}
            style={{ maxHeight: 300, width: 300, overflow: "auto" }}
          >
            {filteredChoices.map((choice, index) => (
              <p
                key={choice}
                className={classNames("cursor-default p-1 hover:bg-blue-100", {
                  "bg-blue-200": activeChoiceIndex === index,
                })}
                data-index={index.toString()}
                onClick={() => handleSelect(choice)}
                onFocus={() => inputRef.current?.focus()}
                tabIndex={0}
              >
                {choice}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
