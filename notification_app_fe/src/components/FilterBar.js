import { FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

const FilterBar = ({ type, onTypeChange, limit, onLimitChange }) => (
  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <InputLabel id="type-filter-label">Type</InputLabel>
      <Select
        labelId="type-filter-label"
        value={type}
        label="Type"
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
      </Select>
    </FormControl>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="limit-label">Per page</InputLabel>
      <Select
        labelId="limit-label"
        value={limit}
        label="Per page"
        onChange={(e) => onLimitChange(Number(e.target.value))}
      >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
      </Select>
    </FormControl>
  </Stack>
);

export default FilterBar;
