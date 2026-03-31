// The answer swapper function, taken and
// modified from 1972: More Than Ever
function answerSwapper(pk1, pk2, takeEffects = true) {
    const answerData = campaignTrail_temp.answers_json;

   // find the indices of the objects with the specified PKs
    const index1 = answerData.findIndex(item => Number(item.pk) === Number(pk1));
    const index2 = answerData.findIndex(item => Number(item.pk) === Number(pk2));

    // check if objects with those PKs exist
    if (index1 === -1 || index2 === -1) return;

    // swap the question assignment
    const tempQuestion = answerData[index1].fields.question;
    answerData[index1].fields.question = answerData[index2].fields.question;
    answerData[index2].fields.question = tempQuestion;

    // if takeEffects is true, answers swap effects also
    if (takeEffects) {
        const otherJsons = [
            campaignTrail_temp.answer_score_global_json,
            campaignTrail_temp.answer_score_issue_json,
            campaignTrail_temp.answer_score_state_json,
            campaignTrail_temp.answer_feedback_json
        ];

        otherJsons.forEach(jsonData => {
            if (!jsonData) return;
            jsonData.forEach(item => {
                const itemAns = Number(item.fields.answer);
                if (itemAns === Number(pk1)) {
                    item.fields.answer = pk2;
                } else if (itemAns === Number(pk2)) {
                    item.fields.answer = pk1;
                }
            });
        });
    }
}