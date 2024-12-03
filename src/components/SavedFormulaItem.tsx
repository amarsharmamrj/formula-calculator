import styles from './SavedFormulaItem.module.css'

const SavedFormulaItem = ({ formula }: any) => {
    const { id, formula: value } = formula

    return (
        <div className={styles.formula}>
            <p key={id}>{value}</p>
        </div>
    )
}

export default SavedFormulaItem