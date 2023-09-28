module.exports.handleError = (res, error) => {
    console.error(error); // Log the error for debugging purposes
  
    // Determine the status code and response based on the error
    let statusCode = 500;
    let errorMessage = 'Internal Server Error';
  
    if (error instanceof ValidationError) {
      // Handle validation errors from express-validator
      statusCode = 400;
      errorMessage = 'Validation Error';
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      // Handle unique constraint violation errors (e.g., duplicate email)
      statusCode = 400;
      errorMessage = 'Duplicate Entry';
    } else if (error.name === 'MulterError') {
      // Handle Multer file upload errors
      statusCode = 400;
      errorMessage = 'File Upload Error';
    } else if (error.status) {
      // Handle errors with a status code (e.g., from external libraries)
      statusCode = error.status;
      errorMessage = error.message;
    }
  
    return res.status(statusCode).json({
      code: statusCode,
      status: errorMessage,
      error: {
        message: error.message,
      },
    });
  };
  