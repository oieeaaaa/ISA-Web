import messages from 'js/messages';

export const response = (res, status, messageType = 'casual') => (data = {}) => {
  const isSuccess = status === 200;

  return res.status(status).send({
    data,
    message: isSuccess ? messages.success[messageType] : messages.error[messageType],
    isSuccess,
  });
};

export default (res) => ({
  success: response(res, 200),
  error: response(res, 400),
});
