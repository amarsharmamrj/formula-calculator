import { useSelector } from 'react-redux'
import { IFormula } from '../../interfaces/formula.interface'
import Formula from '../Formula/Formula'
import { useEffect, useRef, useState } from 'react'
import { Zoom } from '@mui/material'

const Calculator = () => { 
    const [checked, setChecked] = useState(true) 

    const formulaElement: any = useRef()   

    const formulas = useSelector((store: any) => store.formula.formulas)

    useEffect(() => {
        formulaElement?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setChecked(true)
        return () => { 
            setChecked(false)
        }
    })

    return (
        <div className="calculator">
            {
                formulas?.length > 0 && (
                    formulas?.map((item: IFormula) => {
                        return (
                            <Zoom in={checked}>
                                <div ref={formulaElement}>
                                    <Formula key={item.id} formulaItem={item} />
                                </div>
                            </Zoom>
                        )
                    })
                )
            }
        </div>
    )
}

export default Calculator
