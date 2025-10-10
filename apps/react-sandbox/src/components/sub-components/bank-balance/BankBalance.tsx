import React, { useState } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, FormSelect } from '@pinonoir/sds-ui';

interface BankBalanceProps {
  data: [];
}

const BankBalance = ({ data }: BankBalanceProps) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
    console.log('Bank Balance selected:', e.target.value);
  };

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
      <FormSelect name="bank-balance" onChange={handleSelectChange} value={selectedValue} label="Bank Balance">
        <option value="">Select a value</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </FormSelect>
      {data}
    </>
  );
};

export default BankBalance;
