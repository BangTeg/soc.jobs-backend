// module.exports = {
//     verifyAdmin: (req,res) => {
//         const { role } = req.user; // Get the user's role from the token
//         if (role !== "Admin") {
//           return res.status(403).json({
//             code: 403,
//             status: "Forbidden",
//             message: "You do not have permission to create a job.",
//           });
//         }
//     }
// }