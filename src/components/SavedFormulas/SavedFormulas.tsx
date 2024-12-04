import { useSelector } from 'react-redux'
import styles from './SavedFormulas.module.css'
import { IFormula } from '../../interfaces/formula.interface'
import SavedFormulaItem from '../SavedFormulaItem/SavedFormulaItem'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeSavedFormula, syncFormulasFromLocalStorage } from '../../redux/slice/formulaSlice'


const SavedFormulas = () => {
    const savedFormulas = useSelector((store: any) => store.formula.savedFormulas)
    const theme = useSelector((store: any) => store.theme)

    const dispatch = useDispatch()

    const [formulas, setFormulas] = useState([])

    const handelRemoveSavedFormula = (id: any) => {
        dispatch(removeSavedFormula(id))
    }

    useEffect(() => {
        if (savedFormulas.length == 0) {
            // get from local storage
            const data: any = window.localStorage.getItem('savedFormulas')
            console.log("@data:", data)

            if (data) {
                const result: any = JSON.parse(data)
                console.log("@result:", result)
                setFormulas(result)

                // sync to redux store
                dispatch(syncFormulasFromLocalStorage(result))
            }
        } else {
            // get from redux
            setFormulas(savedFormulas)
        }
    }, [savedFormulas])

    return (
        <div className={`${styles.savedFormulas} ${theme ? styles.dark : styles.light}`}>
            <p className={styles.title}>Saved Formulas:</p>
            {
                formulas?.length > 0 ? (
                    formulas.map((formula: IFormula) => <SavedFormulaItem formula={formula} formulas={formulas} handelRemoveSavedFormula={handelRemoveSavedFormula} />)
                ) : (
                    <p>No saved formulas!</p>
                )
            }
        </div>
    )
}

export default SavedFormulas