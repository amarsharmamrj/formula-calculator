import { Box, Slider, Typography } from "@mui/material";

const VariableSilder = ({variable, variables, handleVariableChange}:any) => {
    return (
        <Box key={variable} mb={2}>
            <Typography variant="body1">{variable}:{variables[variable]}</Typography>
            <Slider
                value={variables[variable]}
                min={0}
                max={10}
                step={0.1}
                onChange={(e, value) => handleVariableChange(variable, value as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}`}
            />
        </Box>
    )
}

export default VariableSilder;