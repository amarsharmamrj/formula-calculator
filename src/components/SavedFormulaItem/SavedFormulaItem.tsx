import { Grow } from '@mui/material'
import styles from './SavedFormulaItem.module.css'

const SavedFormulaItem = ({ formula }: any) => {
    const { id, formula: value } = formula

    return (
        <Grow in={true}>
            <div className={styles.formula}>
                <p key={id}>{value}</p>
            </div>
        </Grow>
    )
}

export default SavedFormulaItem