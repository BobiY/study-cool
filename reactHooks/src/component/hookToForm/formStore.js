import React, { useRef, createContext } from "react";

export default function useStore() {
  const store = useRef()
  const setFieldValue = (name, value) => {
    store.current[name] = value
  }

  const getFieldValue = name => {
    return store.current[name]
  }

  const getFieldsValue = () => {
    return { ...store.current }
  }
  return {
    setFieldValue,
    getFieldsValue,
    getFieldValue
  }
}

export const FormContext = createContext()
export const Provider = FormContext.Provider
export const Consume = FormContext.Consume