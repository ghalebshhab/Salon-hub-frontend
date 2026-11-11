import { useEffect, useRef, useState } from "react";
import { normalizeCommunitySearch } from "../model/communityPresentation.js";

const SEARCH_DELAY_MS = 350;

export default function usePeopleSearchField(onSearch) {
  const [value, setValue] = useState("");
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const previousSearchRef = useRef("");
  const normalizedValue = normalizeCommunitySearch(value);

  useEffect(() => {
    if (previousSearchRef.current === normalizedValue) return;
    previousSearchRef.current = normalizedValue;
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => onSearch(normalizedValue),
      SEARCH_DELAY_MS,
    );
    return () => window.clearTimeout(timerRef.current);
  }, [normalizedValue, onSearch]);

  const submit = (event) => {
    event.preventDefault();
    if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
    window.clearTimeout(timerRef.current);
    onSearch(normalizedValue);
  };

  const clear = () => {
    window.clearTimeout(timerRef.current);
    previousSearchRef.current = "";
    setValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  return { value, normalizedValue, inputRef, setValue, submit, clear };
}
