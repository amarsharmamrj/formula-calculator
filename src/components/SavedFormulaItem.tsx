import { Grow, Slide } from '@mui/material'
import styles from './SavedFormulaItem.module.css'

const SavedFormulaItem = ({ formula }: any) => {
    const { id, formula: value } = formula

    return (
        <Slide direction="up" in={true}>
            <div className={styles.formula}>
                <p key={id}>{value}</p>
            </div>
        </Slide>
    )
}

export default SavedFormulaItem