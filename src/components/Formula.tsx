import { useState, useEffect } from "react";
import { Button, Container, IconButton, TextField, Typography } from "@mui/material";
import { calculation } from "../utils/calculation";
import VariableSilder from "./VariableSlider";
import { useSelector } from 'react-redux'

import styles from './Formula.module.css'

import { addNewFormula, removeFormula, saveFormula } from "../redux/slice/formulaSlice";
import { useDispatch } from "react-redux";
import { IFormula } from "../interfaces/formula.interface";

// icons
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

const Formula = ({ formulaItem }: any) => {
    const [formula, setFormula] = useState<string>("");
    const [variables, setVariables] = useState<Record<string, number>>({});
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [checked, setChecked] = useState(true)


    const savedFormulas = useSelector((store: any) => store.formula.savedFormulas)
    console.log("SavedFormulas:", savedFormulas)

    const dispatch = useDispatch()


    // Parse variables and detect unique ones in the formula
    const parseVariables = (formula: string): string[] => {
        const regex = /[a-zA-Z]+/g;
        const matches = formula.match(regex);
        return matches ? [...new Set(matches)] : [];
    };

    // Handle cases like 'abcd' being treated as 'a*b*c*d'
    const handleSpecialCases = (inputFormula: string): string => {
        return inputFormula.replace(/[a-zA-Z]+/g, (match) => {
            if (match.length > 1) {
                return match.split('').join('*');  // Convert "abcd" to "a*b*c*d"
            }
            return match; // Single character remains unchanged
        });
    };

    // Replace ^ with ** for exponentiation
    const replaceExponentiation = (formula: string): string => {
        return formula.replace(/\^/g, "**");
    };

    // Custom math evaluation function (handles BODMAS and ** for exponentiation)
    const evaluateFormula = (formula: string, variables: Record<string, number>): number => {
        try {
            // Replace variables with their values
            let expr = formula;
            for (const [key, value] of Object.entries(variables)) {
                const regExp = new RegExp(`\\b${key}\\b`, "g");
                expr = expr.replace(regExp, value.toString());
            }
            return calculation(expr);
        } catch (error) {
            throw new Error("Invalid formula or undefined variables.");
        }
    };

    // Handle formula input change
    const handleFormulaChange = (newFormula: string) => {
        setFormula(newFormula);
        setError(null);
    };

    const handleAddFormula = () => {
        dispatch(addNewFormula({ formula: '' }))
    }

    const handleRemoveFormula = (id: any) => {
        dispatch(removeFormula({ id: id }))
    }

    const handleSaveFormula = () => {
        dispatch(saveFormula({ formula: formula }))
    }

    // Custom evaluate function (handles BODMAS and precedence)
    // const calculation = (expression: string): number => {
    //     const operators = ["+", "-", "*", "/", "**"];
    //     const precedence = (op: string) => {
    //         if (op === "+" || op === "-") return 1;
    //         if (op === "*" || op === "/") return 2;
    //         if (op === "**") return 3; // Exponentiation has higher precedence
    //         return 0;
    //     };

    //     const applyOperator = (values: number[], ops: string[]) => {
    //         const b = values.pop()!;
    //         const a = values.pop()!;
    //         const op = ops.pop()!;
    //         switch (op) {
    //             case "+":
    //                 values.push(a + b);
    //                 break;
    //             case "-":
    //                 values.push(a - b);
    //                 break;
    //             case "*":
    //                 values.push(a * b);
    //                 break;
    //             case "/":
    //                 values.push(a / b);
    //                 break;
    //             case "**":
    //                 values.push(Math.pow(a, b));
    //                 break;
    //             default:
    //                 throw new Error("Unknown operator");
    //         }
    //     };

    //     const tokens = expression.match(/[0-9.]+|[a-zA-Z]+|[-+*/^()]/g) || [];
    //     const values: number[] = [];
    //     const ops: string[] = [];

    //     tokens.forEach((token) => {
    //         if (/\d+(\.\d+)?/.test(token)) {
    //             values.push(parseFloat(token));
    //         } else if (/[a-zA-Z]+/.test(token)) {
    //             // If variable is detected, it must be replaced with its value
    //             values.push(parseFloat(token));
    //         } else if (operators.includes(token)) {
    //             while (ops.length && precedence(ops[ops.length - 1]) >= precedence(token)) {
    //                 applyOperator(values, ops);
    //             }
    //             ops.push(token);
    //         } else if (token === "(") {
    //             ops.push(token);
    //         } else if (token === ")") {
    //             while (ops.length && ops[ops.length - 1] !== "(") {
    //                 applyOperator(values, ops);
    //             }
    //             ops.pop();
    //         }
    //     });

    //     while (ops.length) {
    //         applyOperator(values, ops);
    //     }

    //     return values[0];
    // };

    // Update variables dynamically based on detected variables in the formula
    useEffect(() => {
        const modifiedFormula = handleSpecialCases(formula); // Modify formula to handle cases like 'abcd'
        const detectedVariables = parseVariables(modifiedFormula);
        const newVariables: Record<string, number> = {};

        // Add new variables that are missing in the state
        detectedVariables.forEach((variable) => {
            if (!(variable in variables)) {
                newVariables[variable] = 0;
            }
        });

        // Retain existing values for variables still present in the formula
        const updatedVariables: any = {};
        detectedVariables.forEach((v) => {
            updatedVariables[v] = variables[v] || 5; // Default value is 50 if new
        });
        setVariables(updatedVariables);
    }, [formula]);

    // Recalculate result whenever formula or variable values change
    useEffect(() => {
        if (formula) {
            try {
                const modifiedFormula = handleSpecialCases(formula); // Ensure special case handling (like abcd)
                const formulaWithExponentiation = replaceExponentiation(modifiedFormula); // Replace ^ with **
                const calculatedResult = evaluateFormula(formulaWithExponentiation, variables);
                setResult(calculatedResult);
                setError(null);
            } catch (e) {
                setError("Invalid formula or undefined variables.");
                setResult(null);
            }
        }
    }, [formula, variables]);

    const handleVariableChange = (key: string, value: number) => {
        setVariables({
            ...variables,
            [key]: value,
        });
    };

    return (
        <Container maxWidth="sm" className={styles.formula}>

            <div className={styles.closeButton}>
                <IconButton onClick={() => handleRemoveFormula(formulaItem.id)}>
                    <CloseIcon />
                </IconButton>
            </div>

            {/* latex */}
            <p className={styles.latex}><i>{formula.split('').join(' ')}</i></p>

            {/* formula input field */}
            <TextField
                fullWidth
                variant="outlined"
                className={styles.formulaInput}
                value={formula}
                onChange={(e) => handleFormulaChange(e.target.value)}
                margin="normal"
            />

            {/* Display result */}
            {result !== null && (
                <div className={styles.result}>
                    {
                        isNaN(result) ?
                            <p style={{ color: '#c50707', fontSize: '1rem' }}>Invalid Formula</p> :
                            (<p>= {result}</p>)
                    }
                </div>
            )}

            {/* Error handling */}
            {error && <Typography color="error" mt={1}>{error}</Typography>}

            {/* Variable input fields */}
            {Object.keys(variables).map((variable) => (
                <VariableSilder
                    variable={variable}
                    variables={variables}
                    handleVariableChange={handleVariableChange}
                />
            ))}

            <div className={styles.button}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddFormula}
                >
                    <AddIcon />  Add Formula
                </Button>
                {
                    (formula && !savedFormulas.map((item: IFormula) => item.formula).includes(formula)) && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleSaveFormula}
                        >
                            <SaveIcon /> Save Formula
                        </Button>
                    )
                }
            </div>



        </Container>
    );
};

export default Formula;
