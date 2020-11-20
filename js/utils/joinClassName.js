const joinClassName = (defaultClass, anotherClassName) =>
  `${defaultClass}${anotherClassName ? ` ${anotherClassName}` : ''}`;

export default joinClassName;
