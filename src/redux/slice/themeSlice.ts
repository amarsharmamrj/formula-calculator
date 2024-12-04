import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: 'theme',
    initialState: false,
    reducers: {
        toggleTheme(state: any, action: PayloadAction<any>) {
            state = !state
            return state
        }
    }
})

const { toggleTheme } = themeSlice.actions
export { toggleTheme, themeSlice }