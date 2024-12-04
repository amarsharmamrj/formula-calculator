 // Custom evaluate function (handles BODMAS and precedence)
 export const calculation = (expression: string): number => {
    const operators = ["+", "-", "*", "/", "**"];
    const precedence = (op: string) => {
        if (op === "+" || op === "-") return 1;
        if (op === "*" || op === "/") return 2;
        if (op === "**") return 3; // Exponentiation has higher precedence
        return 0;
    };

    const applyOperator = (values: number[], ops: string[]) => {
        const b = values.pop()!;
        const a = values.pop()!;
        const op = ops.pop()!;
        switch (op) {
            case "+":
                values.push(a + b);
                break;
            case "-":
                values.push(a - b);
                break;
            case "*":
                values.push(a * b);
                break;
            case "/":
                values.push(a / b);
                break;
            case "**":
                values.push(Math.pow(a, b));
                break;
            default:
                throw new Error("Unknown operator");
        }
    };

    const tokens = expression.match(/[0-9.]+|[a-zA-Z]+|[-+*/^()]/g) || [];
    const values: number[] = [];
    const ops: string[] = [];

    tokens.forEach((token) => {
        if (/\d+(\.\d+)?/.test(token)) {
            values.push(parseFloat(token));
        } else if (/[a-zA-Z]+/.test(token)) {
            values.push(parseFloat(token));
        } else if (operators.includes(token)) {
            while (ops.length && precedence(ops[ops.length - 1]) >= precedence(token)) {
                applyOperator(values, ops);
            }
            ops.push(token);
        } else if (token === "(") {
            ops.push(token);
        } else if (token === ")") {
            while (ops.length && ops[ops.length - 1] !== "(") {
                applyOperator(values, ops);
            }
            ops.pop();
        }
    });

    while (ops.length) {
        applyOperator(values, ops);
    }

    return values[0];
};