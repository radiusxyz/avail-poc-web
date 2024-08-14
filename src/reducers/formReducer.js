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
    case "AMOUNT_INPUT":
      return {
        ...state,
        amount: {
          value: action.val,
          isValid: action.val.length !== 0,
          touched: true,
        },
      };

    case "AMOUNT_VALID":
      return {
        ...state,
        amount: { ...state.amount, isValid: action.val },
      };

    case "AMOUNT_TOUCH":
      return {
        ...state,
        amount: {
          ...state.amount,
          isValid: !(action.val && state.amount.value === ""),
          touched: action.val,
        },
      };

    case "TOKEN_SELECT":
      return { ...state, token: action.val };

    case "FROM_SELECT":
      return { ...state, from: action.val };

    case "TO_SELECT":
      return { ...state, to: action.val };

    default:
      return state;
  }
};
