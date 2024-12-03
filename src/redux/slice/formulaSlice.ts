import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const formulaSlice = createSlice({
    name: 'formula',
    initialState: { formulas: [{ id: 1, formula: '' }], savedFormulas: [] },
    reducers: {
        addNewFormula(state: any, action: PayloadAction<any>) {
            let newFormulas = [...state.formulas, { id: state.formulas.at(-1).id + 1, formula: action.payload.formula }]
            state = { ...state, formulas: newFormulas }
            return state
        },
        removeFormula(state: any, action: PayloadAction<any>) {
            if (state.formulas.length > 1) {
                const newFormulas = state.formulas.filter((item: any) => item.id != action.payload.id)
                state = { ...state, formulas: newFormulas }
            }
            return state
        },
        saveFormula(state: any, action: PayloadAction<any>) {
            let newFormulas = [...state.savedFormulas,
            {
                id: state.savedFormulas.length == 0 ? 1 : state.savedFormulas.at(-1).id + 1,
                formula: action.payload.formula
            }]
            state = { ...state, savedFormulas: newFormulas }
            return state
        },
    }
})

const { addNewFormula, removeFormula, saveFormula } = formulaSlice.actions
export { addNewFormula, removeFormula, saveFormula, formulaSlice }