import { useState, useEffect } from "react";
import { Button, Container, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import VariableSilder from "../VariableSlider/VariableSlider";
import { useSelector, useDispatch } from 'react-redux';

// formula styles
import styles from './Formula.module.css';

// micro reducers
import { addNewFormula, removeFormula, saveFormula } from "../../redux/slice/formulaSlice";

// formula interface
import { IFormula } from "../../interfaces/formula.interface";

// icons
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { calculation } from "../../utils/calculation";

const Formula = ({ formulaItem }: any) => {
    const [formula, setFormula] = useState<string>("");
    const [variables, setVariables] = useState<Record<string, number>>({});
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // saved formula state from store
    const savedFormulas = useSelector((store: any) => store.formula.savedFormulas)
    const theme = useSelector((store: any) => store.theme)
    console.log("theme:", theme)

    // method to call actions
    const dispatch = useDispatch();

    // Parse variables to get unique variables
    const parseVariables = (formula: string): string[] => {
        const regex = /[a-zA-Z]+/g;
        const matches = formula.match(regex);
        return matches ? [...new Set(matches)].filter((v) => !['sin', 'cos', 'tan', 'log'].includes(v)) : [];
    };

    // Handle cases like 'abcd' which is to be treated as 'a*b*c*d'
    const handleSpecialCases = (inputFormula: string): string => {
        return inputFormula.replace(/[a-zA-Z]+/g, (match) => {
            if (match.length > 1 && !['sin', 'cos', 'tan', 'log'].includes(match)) {
                return match.split('').join('*');
            }
            return match;
        });
    };

    // Replace ^ with ** for exponentiation
    const replaceExponentiation = (formula: string): string => {
        return formula.replace(/\^/g, "**");
    };

    // Evaluate functions like sin, cos, log
    const evaluateFunctions = (formula: string): string => {
        const functionRegex = /(sin|cos|tan|log)\(([^)]+)\)/g;
        return formula.replace(functionRegex, (_, func, innerExpr) => {
            const evaluatedInner = calculation(innerExpr); // Recursively calculate the inner expression
            let radians: number;

            if (func === "sin" || func === "cos" || func === "tan") {
                radians = (Math.PI / 180) * evaluatedInner; // Convert degrees to radians
            }

            switch (func) {
                case "sin":
                    return Math.sin(radians!).toFixed(10); // Ensure precision
                case "cos":
                    const cosValue = Math.cos(radians!);
                    return Math.abs(cosValue) < 1e-10 ? "0" : cosValue.toFixed(10); // Handle floating-point precision
                case "tan":
                    if (Math.abs(radians! % Math.PI - Math.PI / 2) < 1e-10) {
                        throw new Error("Tan is undefined for odd multiples of 90 degrees.");
                    }
                    return Math.tan(radians!).toFixed(10);
                case "log":
                    if (evaluatedInner <= 0) {
                        throw new Error("Logarithm of non-positive numbers is undefined.");
                    }
                    return Math.log10(evaluatedInner).toString(); // Use Math.log10 for base-10 logarithm
                default:
                    throw new Error(`Unknown function: ${func}`);
            }
        });
    };



    // function to handle BODMAS and ** for exponentiation
    const calculateFormula = (formula: string, variables: Record<string, number>): number => {
        try {
            // Replace variables with their values
            let expr = formula;
            for (const [key, value] of Object.entries(variables)) {
                const regExp = new RegExp(`\\b${key}\\b`, "g");
                expr = expr.replace(regExp, value.toString());
            }
            expr = evaluateFunctions(expr); // Evaluate functions like sin, cos, log
            return calculation(expr);
        } catch (error) {
            throw new Error("Invalid formula or undefined variables.");
        }
    };

    // handle for formula input change
    const handleFormulaChange = (newFormula: string) => {
        setFormula(newFormula);
        setError(null);
    };

    // handle to add new formula input
    const handleAddFormula = () => {
        dispatch(addNewFormula({ formula: '' }));
    };

    // handle to remove formula input
    const handleRemoveFormula = (id: any) => {
        dispatch(removeFormula({ id: id }));
    };

    // handle to save formula
    const handleSaveFormula = () => {
        dispatch(saveFormula({ formula: formula }));
    };

    // handle to set value from variable slider input
    const handleVariableChange = (key: string, value: number) => {
        setVariables({
            ...variables,
            [key]: value,
        });
    };

    // // Custom evaluate function (handles BODMAS and precedence)
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

    // find variables when formula inside field change
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

        // remove variables when they are removed from formula input
        const updatedVariables: any = {};
        detectedVariables.forEach((v) => {
            updatedVariables[v] = variables[v] || 1;
        });
        setVariables(updatedVariables);
    }, [formula]);

    // Re-calculate result when formula or variable values change
    useEffect(() => {
        if (formula) {
            try {
                const modifiedFormula = handleSpecialCases(formula); // Ensure special case handling (like abcd)
                const formulaWithExponentiation = replaceExponentiation(modifiedFormula); // Replace ^ with **
                const calculatedResult = calculateFormula(formulaWithExponentiation, variables);
                setResult(calculatedResult);
                setError(null);
            } catch (e) {
                setError("Invalid formula or undefined variables.");
                setResult(null);
            }
        }
    }, [formula, variables]);

    return (
        <Container maxWidth="sm" className={`${styles.formula} ${theme ? styles.dark : styles.light}`}>

            <div className={styles.closeButton}>
                <Tooltip title='Remove'>
                    <IconButton onClick={() => handleRemoveFormula(formulaItem.id)}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </div>

            {/* latex */}
            <p className={styles.latex}><i>{formula.split('').join(' ')}</i></p>

            {/* formula input field */}
            <TextField
                fullWidth
                variant="outlined"
                className={`${styles.formulaInput} ${theme ? styles.darkInput : styles.lightInput}`}
                value={formula}
                onChange={(e) => handleFormulaChange(e.target.value)}
                margin="normal"
            />

            {/* Display result */}
            {result !== null && (
                <div className={`${styles.result} ${theme ? styles.dark : styles.light}`}>
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
                    key={variable}
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
                            variant="contained"
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
