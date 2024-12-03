import React, { useState, useEffect } from 'react';
import { TextField, Typography, Container, Box, Grid, Slider } from '@mui/material';
// import Latex from 'react-latex-next';

interface Variables {
  [key: string]: number;
}

const NewCalc: React.FC = () => {
  const [formula, setFormula] = useState<string>('');
  const [processedFormula, setProcessedFormula] = useState<string>('');
  const [variables, setVariables] = useState<Variables>({});
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Process the formula to split multi-character variables and replace them with multiplication
  useEffect(() => {
    const matches = formula.match(/[a-zA-Z]+/g); // Match all alphabetic sequences
    let tempFormula = formula;

    if (matches) {
      matches.forEach((match) => {
        if (match.length > 1) {
          // Replace multi-character variables with their multiplication form (e.g., abc → a*b*c)
          const replacement = match.split('').join('*');
          tempFormula = tempFormula.replace(match, replacement);
        }
      });
    }

    setProcessedFormula(tempFormula);

    // Extract unique single-character variables
    const splitCharacters = tempFormula.match(/[a-zA-Z]/g);
    const uniqueVariables = [...new Set(splitCharacters || [])];
    const updatedVariables: Variables = {};

    // Retain existing values for variables still present in the formula
    uniqueVariables.forEach((v) => {
      updatedVariables[v] = variables[v] || 50; // Default value is 50 if new
    });

    setVariables(updatedVariables);
  }, [formula]);

  // Evaluate the processed formula
  useEffect(() => {
    try {
      if (!processedFormula) {
        setResult(null);
        setError(null);
        return;
      }
      let evaluatedFormula = processedFormula;
      Object.keys(variables).forEach((key) => {
        const value = variables[key];
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        evaluatedFormula = evaluatedFormula.replace(regex, value.toString());
      });
      const resultValue = evaluateExpression(evaluatedFormula);
      setResult(resultValue);
      setError(null);
    } catch (err) {
      setError('Invalid formula');
      setResult(null);
    }
  }, [processedFormula, variables]);

  // Function to evaluate a math expression (basic implementation)
  const evaluateExpression = (expression: string): number => {
    return Function(`"use strict"; return (${expression})`)();
  };

  const handleVariableChange = (key: string, value: number) => {
    setVariables({
      ...variables,
      [key]: value,
    });
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Formula Calculator
        </Typography>
      </Box>
      <Box mb={4}>
        <TextField
          label="Enter Formula"
          variant="outlined"
          fullWidth
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="e.g., abc + d"
        />
        <Box mt={2}>
          <Typography variant="h6">Processed Formula:</Typography>
          <Typography variant="body1">
            {/* <Latex>{`$$${processedFormula}$$`}</Latex> */}
          </Typography>
        </Box>
      </Box>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Variables
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(variables).map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <Box>
                <Typography gutterBottom>{`${key}: ${variables[key]}`}</Typography>
                <Slider
                  value={variables[key]}
                  onChange={(e, value) => handleVariableChange(key, value as number)}
                  min={0}
                  max={100}
                  step={1}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        <Typography variant="h5" gutterBottom>
          Result
        </Typography>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Typography>{result !== null ? result : 'No formula entered'}</Typography>
        )}
      </Box>
    </Container>
  );
};

export default NewCalc;
