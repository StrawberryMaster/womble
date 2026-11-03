// The portrait switcher from ABAR
// thanks to dawxo for sharing this code!
e.noCounter += 1;

if (e.noCounter % 2 === 1) {
    campaignTrail_temp.candidate_image_url = imgB;
    campaignTrail_temp.running_mate_image_url = imgA;
} else {
    campaignTrail_temp.candidate_image_url = imgA;
    campaignTrail_temp.running_mate_image_url = imgB;
}