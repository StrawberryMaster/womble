// Feedback updater, taken and modified from 2021DE
const feedbackMap = new Map(
  campaignTrail_temp.answer_feedback_json.map(e => [e.pk, e])
);

const feedbackByAnswerMap = new Map(
  campaignTrail_temp.answer_feedback_json.map(e => [e.fields.answer, e])
);

function updateFeedback(pkValue, newFeedback) {
  let entry = feedbackMap.get(pkValue);

  // as fallback, treat pkValue as an answer pk
  if (!entry) {
    entry = feedbackByAnswerMap.get(pkValue);
  }

  if (entry) entry.fields.answer_feedback = newFeedback;
}