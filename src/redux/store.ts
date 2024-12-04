import { configureStore } from "@reduxjs/toolkit";
import { formulaSlice } from "./slice/formulaSlice";
import { themeSlice } from "./slice/themeSlice";

const store: any = configureStore({
    reducer: {
        formula: formulaSlice.reducer,
        theme: themeSlice.reducer
    }
})

export { store }