import messages from 'js/messages';

export const response = (res, status) => (
  data = {},
  messageType = 'casual'
) => {
  const isSuccess = status === 200;

  if (!isSuccess) {
    console.log(data.message); // TODO: Remove this later
  }

  return res.status(status).send({
    data,
    message: isSuccess ? messages.success[messageType] : data.message,
    isSuccess
  });
};

export default (res) => ({
  success: response(res, 200),
  error: response(res, 400)
});
