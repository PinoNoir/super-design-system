import { Box, Button, IconButton, Loader, ValidationMessage } from '@stretto/cds-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '../../../api/mockApi';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import styles from './caseList.module.css';
import { Autocomplete, TextField } from '@mui/material';
import { useState, useMemo } from 'react';

function CaseList() {
  const queryClient = useQueryClient();
  const [filterValue, setFilterValue] = useState('');

  const {
    data: cases,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cases'],
    queryFn: mockApi.getCases,
  });

  const createCaseMutation = useMutation({
    mutationFn: mockApi.createCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });

  const deleteCaseMutation = useMutation({
    mutationFn: mockApi.deleteCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });

  const caseList = [
    { id: 1, name: 'Case 1', docketNumber: '12345', attorney: 'John Doe' },
    { id: 2, name: 'Case 2', docketNumber: '67890', attorney: 'Jane Smith' },
    { id: 3, name: 'Case 3', docketNumber: '54321', attorney: 'Alice Johnson' },
    { id: 4, name: 'Case 4', docketNumber: '09876', attorney: 'Bob Brown' },
    { id: 5, name: 'Case 5', docketNumber: '11223', attorney: 'Charlie Davis' },
    { id: 6, name: 'Case 6', docketNumber: '44556', attorney: 'Diana Evans' },
    { id: 7, name: 'Case 7', docketNumber: '77889', attorney: 'Eve Foster' },
    { id: 8, name: 'Case 8', docketNumber: '99000', attorney: 'Frank Green' },
  ];

  // Filter the cases based on the search input
  const filteredCases = useMemo(() => {
    if (!filterValue.trim()) {
      return cases || [];
    }

    const searchTerm = filterValue.toLowerCase();
    return (cases || []).filter(
      (caseItem) =>
        caseItem.name.toLowerCase().includes(searchTerm) ||
        caseItem.docketNumber.toLowerCase().includes(searchTerm) ||
        caseItem.attorney.toLowerCase().includes(searchTerm),
    );
  }, [cases, filterValue]);

  if (isLoading) return <Loader withOverlay description="Loading Cases..." />;
  if (error) return <ValidationMessage invalid invalidText="Error fetching cases" />;

  return (
    <>
      <Button
        variant="secondary"
        shape="square"
        onClick={() => {
          createCaseMutation.mutate({
            name: 'New Case',
            docketNumber: 'TBD',
            attorney: 'Unassigned',
          });
        }}
        isLoading={createCaseMutation.isPending}
      >
        Add Case
      </Button>
      <Box display="flex" flexDirection="column" gap="16">
        <Autocomplete
          freeSolo
          options={caseList}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          inputValue={filterValue}
          onInputChange={(_, newInputValue) => {
            setFilterValue(newInputValue);
          }}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <li key={key} {...otherProps}>
                <div>
                  <div>{option.name}</div>
                  <div style={{ fontSize: '0.8em', color: 'gray' }}>
                    Docket: {option.docketNumber} | Attorney: {option.attorney}
                  </div>
                </div>
              </li>
            );
          }}
          sx={{ marginBlock: '8px' }}
          renderInput={(params) => <TextField {...params} label="Filter Cases" />}
        />
        <ul className={styles.caseList}>
          <AnimatePresence
            initial={false}
            onExitComplete={() => {
              queryClient.invalidateQueries({ queryKey: ['cases'] });
            }}
          >
            {filteredCases.map((caseItem) => (
              <motion.li key={caseItem.id} className={styles.caseListItem} exit={{ opacity: 0 }} layout>
                {caseItem.name} (Docket: {caseItem.docketNumber}, Attorney: {caseItem.attorney})
                <IconButton size="small" onClick={() => deleteCaseMutation.mutate(caseItem.id)}>
                  <Icon icon="mdi:delete-forever" color="var(--color-neutral-100)" />
                </IconButton>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </Box>
    </>
  );
}

export default CaseList;
