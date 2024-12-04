import { Grow, IconButton, Tooltip } from '@mui/material'
import styles from './SavedFormulaItem.module.css'
import DeleteIcon from '@mui/icons-material/Delete';

const SavedFormulaItem = ({ formula, formulas, handelRemoveSavedFormula }: any) => {
    const { id, formula: value } = formula

    return (
        <Grow in={true}>
            <div className={styles.formula}>
                <p key={id}>{value}</p>
                {
                    formulas?.length > 1  && (
                        <Tooltip title='Delete'>
                            <IconButton onClick={() => handelRemoveSavedFormula(id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>

                    )
                }
            </div>
        </Grow >
    )
}

export default SavedFormulaItem