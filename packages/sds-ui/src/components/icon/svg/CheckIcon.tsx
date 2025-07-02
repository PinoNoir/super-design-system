const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} {...rest}>
      <path d="M21 7 9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7Z" />
    </svg>
  );
};

export default CheckIcon;
