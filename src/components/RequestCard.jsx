import { Card, CardContent, Typography, Button, Tooltip } from "@mui/material";
import { MiscellaneousServicesOutlined, CheckCircle, Cancel } from "@mui/icons-material";

const RequestCard = ({ request, handleAction, formatTimestamp }) => {
  // Define badge styles based on status
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-300";
      case "denied":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  return (
    <Card
      key={request.id}
      className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300  animate-fade-in"
    >
      <CardContent className="space-y-4">
        {/* Request ID */}
        <Typography className="text-xs text-gray-500 text-end font-mono">
          #{request.id}
        </Typography>

        {/* Request Name and Icon */}
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full">
            <MiscellaneousServicesOutlined fontSize="large" className="text-white" />
          </div>
          <Typography
            variant="h6"
            className="font-bold text-gray-800 truncate"
          >
            {request.resourceName === "" ? "Hello" : request.resourceName}
          </Typography>
        </div>

        {/* Username with Avatar */}
        <Tooltip title={request.userId}>
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {request.userId.charAt(0).toUpperCase()}
            </div>
            <Typography
              className="text-sm text-gray-600 truncate"
              sx={{
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <strong>Username:</strong> {request.userId}
            </Typography>
          </div>
        </Tooltip>

        {/* Request Status with Badge */}
        <div className="flex items-center space-x-2">
          <Typography className="text-sm text-gray-600 font-medium">
            <strong>Status:</strong>
          </Typography>
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(
              request.status
            )}`}
          >
            {request.status || "Pending"}
          </span>
        </div>

        {/* Request Time */}
        <Typography variant="body2" className="text-sm text-gray-600">
          <strong>Requested On:</strong> {formatTimestamp(request.timestamp)}
        </Typography>

        {/* Accept / Deny Actions */}
        <div className="flex justify-between gap-4 mt-6">
          <Button
            variant="contained"
            color="success"
            onClick={() => handleAction(request.id, "Accepted")}
            startIcon={<CheckCircle />}
            className="flex-1 bg-green-600 hover:bg-green-700 transition-colors rounded-lg"
            aria-label={`Accept request ${request.id}`}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleAction(request.id, "Denied")}
            startIcon={<Cancel />}
            className="flex-1 bg-red-600 hover:bg-red-700 transition-colors rounded-lg"
            aria-label={`Deny request ${request.id}`}
          >
            Deny
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;