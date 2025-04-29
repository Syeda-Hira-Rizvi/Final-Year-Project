const express = require('express');
const {registerDonor, loginDonor, logoutDonor, applyAsVolunteer, forgotDonorPassword, resetDonorPassword, changeDonorPassword, getDonorInfo, updateDonorInfo, getDonorDonations, getDonorAppointments,checkEligibility, getNearbyHospitals, bookBloodDonationAppointment, bookStemCellAppointmentForHLA, viewHLAStatus, bookStemCellDonationAppointment, cancelAppointment, getAllBloodDrives, getAvailability, getAvailableSlots} = require('../controllers/donorController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const router = express.Router();


// Donor Routes
router.route('/register').post(registerDonor);

router.route('/login').post(loginDonor);

router.route("/logout").get(logoutDonor);

router.route("/forgot-password").post(forgotDonorPassword);

router.route("/reset-password/:token").put(resetDonorPassword);

router.route("/change-password").put(isAuthenticatedUser, changeDonorPassword);

router.route("/profile").get(isAuthenticatedUser, authorizeRoles('donor'), getDonorInfo);

router.route("/profile/update").put(isAuthenticatedUser, authorizeRoles('donor'), updateDonorInfo);

router.route("/donor-donations/:donorId").get(isAuthenticatedUser, authorizeRoles('donor'), getDonorDonations);

//router.route("/donor-appointments/:donorId").get(isAuthenticatedUser, authorizeRoles('donor'), getDonorAppointments);
router.route("/donor-appointments").get(isAuthenticatedUser, authorizeRoles('donor'), getDonorAppointments);

router.route("/check-eligibility").post(isAuthenticatedUser, checkEligibility);

router.route("/hospitals/nearby").get(isAuthenticatedUser, getNearbyHospitals);

router.route("/availability").get(isAuthenticatedUser, getAvailability);

router.route("/hospital/:hospitalId/slots/:date").get(isAuthenticatedUser, getAvailableSlots);

router.route("/appointment/blood-donation").post(isAuthenticatedUser, bookBloodDonationAppointment);

router.route("/appointment/HLA-test").post(isAuthenticatedUser, bookStemCellAppointmentForHLA);

router.route('/view-HLA-status').get(isAuthenticatedUser, authorizeRoles('donor'), viewHLAStatus);

router.route("/appointment/stem-cell-donation").post(isAuthenticatedUser, bookStemCellDonationAppointment);

// router.route("/appointment/cancel-appointment").delete(isAuthenticatedUser, cancelAppointment);
//router.route("/appointment/cancel-appointment/:appointmentId").delete(isAuthenticatedUser, cancelAppointment);
router.route("/appointment/cancel-appointment/:appointmentId").put(isAuthenticatedUser, cancelAppointment);


router.route("/blood-drives").get(isAuthenticatedUser, getAllBloodDrives);

router.route("/apply-as-volunteer").post(isAuthenticatedUser, applyAsVolunteer);



// router.route("/profile/view").get(isAuthenticatedUser, viewDonorProfile);

// router.route("/profile/update").put(isAuthenticatedUser, updateDonorProfile);


module.exports = router;
