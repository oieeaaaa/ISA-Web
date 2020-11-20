const Form = ({ formikProps, children }) => {
  console.log(formikProps);

  return <form className="form">{children}</form>;
};

export default Form;
