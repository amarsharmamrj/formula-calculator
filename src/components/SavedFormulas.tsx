import { useSelector } from 'react-redux'
import styles from './SavedFormulas.module.css'
import { IFormula } from '../interfaces/formula.interface'
import SavedFormulaItem from './SavedFormulaItem'


const SavedFormulas = () => {
    const savedFormulas = useSelector((store: any) => store.formula.savedFormulas)
    const theme = useSelector((store: any) => store.theme)

    return (
        <div className={`${styles.savedFormulas} ${theme ? styles.dark : styles.light}`}>
            <p className={styles.title}>Saved Formulas:</p>
            {
                savedFormulas?.length > 0 ? (
                    savedFormulas.map((formula: IFormula) => <SavedFormulaItem formula={formula} />)
                ) : (
                    <p>No saved formulas!</p>
                )
            }
        </div>
    )
}

export default SavedFormulas