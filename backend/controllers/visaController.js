import VisaRequest from "../models/VisaRequest.js";
import { sendEmail } from "../nodeMailer/nodeMailer.js"; // Import the sendEmail function

// Submit a visa request
export const submitVisaRequest = async (req, res) => {
  try {
    const { clientName, clientEmail, passportNumber, destinationCountry, travelDates } = req.body;
    const passportImage = req.file.path;

    const newVisaRequest = new VisaRequest({
      clientName,
      clientEmail,
      passportNumber,
      destinationCountry,
      travelDates,
      passportImage,
    });

    await newVisaRequest.save();

    // Send confirmation email
    await sendEmail(clientEmail, "Your visa request has been received and is being processed.");

    res.status(200).json({
      success: true,
      message: "Visa request submitted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to submit visa request. Try again.",
    });
  }
};