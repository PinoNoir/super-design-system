import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from 'sds-ui';

interface BankBalanceProps {
  data: [];
}

const BankBalance = ({ data }: BankBalanceProps) => {
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="secondary" shape="square">
            Post Checks
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onClick={() => console.log('Review Printed Checks')}>Review Printed Checks</DropdownItem>
          <DropdownItem onClick={() => console.log('Review Unprinted Checks')}>Review Unprinted Checks</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {data}
    </>
  );
};

export default BankBalance;
