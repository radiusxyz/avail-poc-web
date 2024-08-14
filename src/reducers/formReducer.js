export const initialFormState = {
  token: null,
  amount: {
    value: "",
    isValid: false,
    touched: false,
  },
  from: null,
  to: null,
};

export const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "UPDATE_AMOUNT":
      return {
        ...state,
        amount: {
          ...state.amount,
          value: action.value,
          isValid: action.value?.length !== 0,
          touched: action.touched ?? state.amount.touched,
        },
      };

    default:
      return state;
  }
};
