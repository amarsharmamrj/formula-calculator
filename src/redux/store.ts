import { configureStore } from "@reduxjs/toolkit";
import { formulaSlice } from "./slice/formulaSlice";
import { IFormula } from "../interfaces/formula.interface";

const store: any = configureStore({
    reducer: {
        formula: formulaSlice.reducer 
    }
})

export { store }