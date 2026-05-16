import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";

const typeColor = {
  Placement: "success",
  Result: "primary",
  Event: "warning",
};

const NotificationCard = ({ data, isRead, onToggleRead, rank }) => {
  return (
    <Card
      elevation={isRead ? 0 : 2}
      sx={{
        mb: 1.5,
        bgcolor: isRead ? "background.paper" : "info.50",
        borderLeft: 4,
        borderColor: isRead ? "divider" : "info.main",
        transition: "background-color 0.2s",
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            {rank != null && (
              <Chip label={`#${rank}`} size="small" color="secondary" variant="outlined" />
            )}
            <Chip
              label={data.Type}
              size="small"
              color={typeColor[data.Type] || "default"}
            />
            {!isRead && (
              <Chip label="Unread" size="small" color="info" variant="filled" />
            )}
          </Stack>
          <Tooltip title={isRead ? "Mark unread" : "Mark read"}>
            <IconButton size="small" onClick={() => onToggleRead(data.ID)} aria-label="toggle read">
              {isRead ? <MarkEmailUnreadIcon /> : <MarkEmailReadIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
          {data.Message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data.Timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
