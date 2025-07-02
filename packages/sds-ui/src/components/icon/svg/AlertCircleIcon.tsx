const AlertCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} {...rest}>
      <path d="M13 13h-2V7h2v6Zm0 4h-2v-2h2v2ZM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
    </svg>
  );
};

export default AlertCircleIcon;
