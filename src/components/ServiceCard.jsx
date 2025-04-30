import { Card, CardHeader, CardContent, Typography, Button } from "@mui/material"

export default function ServiceCard({ icon: Icon, title, description, onClick }) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardHeader
        avatar={<Icon fontSize="medium" color="primary" />}
        title={<Typography variant="h6">{title}</Typography>}
        sx={{ textAlign: "left", pb: 0 }}
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onClick}
        >
          Request
        </Button>
      </CardContent>
    </Card>
  )
}
