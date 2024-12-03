import { useSelector } from 'react-redux'
import { IFormula } from '../interfaces/formula.interface'
import Formula from './Formula'

const Calculator = () => {
    const formulas = useSelector((store: any) => store.formula.formulas)
    console.log("formuals:", formulas)

    return (
        <div className="calculator">
            {
                formulas.length > 0 && (
                    formulas.map((item: IFormula) => {
                        return (
                            <Formula key={item.id} formulaItem={item} />
                        )
                    })
                )
            }
        </div>
    )
}

export default Calculator