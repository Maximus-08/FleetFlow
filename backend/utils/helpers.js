// Check if value is empty
const isEmpty = (value) => {
  return value === undefined || value === null || value === '';
};

// Check if number is positive
const isPositiveNumber = (value) => {
  return typeof value === 'number' && value > 0;
};

// Validate date format
const isValidDate = (date) => {
  return !isNaN(Date.parse(date));
};

// Standard API success response
const sendSuccess = (res, data, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

// Standard API error response
const sendError = (res, message = "Something went wrong", status = 500) => {
  return res.status(status).json({
    success: false,
    message
  });
};

module.exports = {
  isEmpty,
  isPositiveNumber,
  isValidDate,
  sendSuccess,
  sendError
};