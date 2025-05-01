import { MiscellaneousServicesOutlined } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  CardActions,
} from "@mui/material";

export default function ServiceCard({ title, description, onClick }) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": { boxShadow: 6 },
        height: "200px", // Set a fixed height
      }}
    >
      <CardHeader
        avatar={<MiscellaneousServicesOutlined />}
        title={<Typography variant="h6">{title}</Typography>}
        sx={{ textAlign: "left", pb: 0 }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Make sure button stays at the bottom
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" fullWidth onClick={onClick}>
          Request
        </Button>
      </CardActions>
    </Card>
  );
}
