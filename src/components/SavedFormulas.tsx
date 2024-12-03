import { useSelector } from 'react-redux'
import styles from './SavedFormulas.module.css'
import { IFormula } from '../interfaces/formula.interface'
import SavedFormulaItem from './SavedFormulaItem'

const SavedFormulas = () => {
    const savedFormulas = useSelector((store: any) => store.formula.savedFormulas)
    console.log("SavedFormulas:", savedFormulas)

    return (
        <div className={styles.savedFormulas}>
            <p className={styles.title}>Save Formulas:</p>
            {
                savedFormulas?.length > 0 ? (
                    savedFormulas.map((formula: IFormula) => <SavedFormulaItem formula={formula} />)
                ) : (
                    'No saved formulas!'
                )
            }
        </div>
    )
}

export default SavedFormulas