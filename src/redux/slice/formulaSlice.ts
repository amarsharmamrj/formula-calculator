import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFormula } from "../../interfaces/formula.interface";

const syncSavedFormulasWithLocalStorage = (data: IFormula[]) => {
    const strData = JSON.stringify(data)
    window.localStorage.setItem('savedFormulas', strData)
}

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
            syncSavedFormulasWithLocalStorage(newFormulas)
            return state
        },
        removeSavedFormula(state: any, action: PayloadAction<any>) {
            if (state.savedFormulas.length > 1) {
                let newFormulas = state?.savedFormulas?.filter((item: any) => item.id !== action.payload)
                state = { ...state, savedFormulas: newFormulas }
                syncSavedFormulasWithLocalStorage(newFormulas)
            }
            return state
        },
        syncFormulasFromLocalStorage(state: any, action: PayloadAction<any>) {
            state = { ...state, savedFormulas: action.payload }
            return state
        },
    }
})

const { addNewFormula, removeFormula, syncFormulasFromLocalStorage, removeSavedFormula, saveFormula } = formulaSlice.actions
export { addNewFormula, removeFormula, saveFormula, syncFormulasFromLocalStorage, removeSavedFormula, formulaSlice }