import { Button, Stack, Typography } from "@mui/material";

const PaginationBar = ({ page, onPrev, onNext, hasNext, disabled }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    spacing={2}
    sx={{ mt: 2 }}
  >
    <Button variant="outlined" onClick={onPrev} disabled={disabled || page <= 1}>
      Previous
    </Button>
    <Typography variant="body2" color="text.secondary">
      Page {page}
    </Typography>
    <Button variant="contained" onClick={onNext} disabled={disabled || !hasNext}>
      Next
    </Button>
  </Stack>
);

export default PaginationBar;
