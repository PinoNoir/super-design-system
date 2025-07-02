const AlertIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} {...rest}>
      <path d="M13 14h-2V9h2v5Zm0 4h-2v-2h2v2ZM1 21h22L12 2 1 21Z" />
    </svg>
  );
};

export default AlertIcon;
