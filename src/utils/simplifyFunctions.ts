import { calculation } from "./calculation";

export const simplifyFunctions = (formula: string): string => {
    const functionRegex = /(sin|cos|tan|log)\(([^)]+)\)/g;
    return formula.replace(functionRegex, (_, func, innerExpr) => {
        const calculatedInner = calculation(innerExpr);
        let radians: number;

        if (func === "sin" || func === "cos" || func === "tan") {
            radians = (Math.PI / 180) * calculatedInner; // Convert degrees to radians
        }

        switch (func) {
            case "sin":
                return Math.sin(radians!).toFixed(10);
            case "cos":
                const cosValue = Math.cos(radians!);
                return Math.abs(cosValue) < 1e-10 ? "0" : cosValue.toFixed(10);
            case "tan":
                if (Math.abs(radians! % Math.PI - Math.PI / 2) < 1e-10) {
                    throw new Error("Tan is undefined for odd multiples of 90 degrees.");
                }
                return Math.tan(radians!).toFixed(10);
            case "log":
                if (calculatedInner <= 0) {
                    throw new Error("Logarithm of non-positive numbers is undefined.");
                }
                return Math.log10(calculatedInner).toString();
            default:
                throw new Error(`Unknown function: ${func}`);
        }
    });
};