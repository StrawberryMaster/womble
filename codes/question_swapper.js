// The question swapper function, taken
// and modified from 2021DE
function questionSwapper(pk1, pk2) {
    const questionData = campaignTrail_temp.questions_json;

    // find the array indices of the questions with the specified PKs
    const index1 = questionData.findIndex(item => Number(item.pk) === Number(pk1));
    const index2 = questionData.findIndex(item => Number(item.pk) === Number(pk2));

    // check if objects with those PKs actually exist in the array
    if (index1 === -1 || index2 === -1) {
        console.warn(`Question swap failed: could not find one or both PKs (${pk1}, ${pk2})`);
        return;
    }

    // swap the question objects in the array
    const tempQuestion = questionData[index1];
    questionData[index1] = questionData[index2];
    questionData[index2] = tempQuestion;
}