import { faker } from '@faker-js/faker';

// Types
export enum ChapterType {
  Chapter7Individual = 'Chapter 7, Individual',
  Chapter7Joint = 'Chapter 7, Joint',
  Chapter13Individual = 'Chapter 13, Individual',
  Chapter13Joint = 'Chapter 13, Joint',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Person {
  firstName: string;
  lastName: string;
  ssn: string;
  email: string;
  phone: string;
  address: Address;
}

export interface Client {
  id: string;
  caseNumber: string;
  debtor: Person;
  jointDebtor?: Person;
  chapter: ChapterType;
  caseFiledDate: string;
  status: 'Active' | 'Closed' | 'Dismissed' | 'Discharged';
  attorney?: Person;
  trustee?: Person;
}

// Utility functions for generating mock data
export const generateSSN = () => {
  const part1 = faker.number.int({ min: 100, max: 999 });
  const part2 = faker.number.int({ min: 10, max: 99 });
  const part3 = faker.number.int({ min: 1000, max: 9999 });
  return `${part1}-${part2}-${part3}`;
};

export const generateAddress = (): Address => ({
  street: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state(),
  zipCode: faker.location.zipCode(),
});

export const generatePerson = (): Person => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  ssn: generateSSN(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: generateAddress(),
});

export const generateCaseNumber = (index: number) => {
  const year = faker.number.int({ min: 20, max: 23 });
  const district = faker.number.int({ min: 1000, max: 9999 });
  return `${year}-${district}-${index.toString().padStart(5, '0')}`;
};

export const generateClient = (id: string): Client => {
  const chapter = faker.helpers.arrayElement(Object.values(ChapterType));
  const isJoint = chapter.includes('Joint');

  return {
    id,
    caseNumber: generateCaseNumber(parseInt(id)),
    debtor: generatePerson(),
    ...(isJoint && { jointDebtor: generatePerson() }),
    chapter,
    caseFiledDate: faker.date.past({ years: 2 }).toLocaleDateString(),
    status: faker.helpers.arrayElement(['Active', 'Closed', 'Dismissed', 'Discharged']),
    attorney: generatePerson(),
    trustee: generatePerson(),
  };
};

// Generate mock database
export const generateMockDatabase = (count: number = 15) => {
  const clients = Array.from({ length: count }, (_, i) => generateClient(i.toString()));

  return {
    CLIENTS: clients,
  };
};

// Create the mock database with initial data
export const DATABASE = generateMockDatabase();

// Utility functions for working with the mock database
export const getClientById = (id: string) => DATABASE.CLIENTS.find((client) => client.id === id);

export const getClientsByStatus = (status: Client['status']) =>
  DATABASE.CLIENTS.filter((client) => client.status === status);

export const getClientsByChapter = (chapter: ChapterType) =>
  DATABASE.CLIENTS.filter((client) => client.chapter === chapter);

// Function to convert Client to table format
export const clientToTableFormat = (client: Client) => ({
  id: client.id,
  caseNumber: client.caseNumber,
  debtor: `${client.debtor.firstName} ${client.debtor.lastName}`,
  jointDebtor: client.jointDebtor ? `${client.jointDebtor.firstName} ${client.jointDebtor.lastName}` : '-',
  chapter: client.chapter,
  caseFiledDate: client.caseFiledDate,
  ssn: client.debtor.ssn,
  disabled: false,
});

export interface TableRowData {
  id: string;
  caseNumber: string;
  debtor: string;
  jointDebtor: string;
  chapter: ChapterType;
  caseFiledDate: string;
  ssn: string;
  disabled: boolean;
}

// Generate large dataset for performance testing
export const generateLargeDataset = (count: number = 100000) =>
  Array.from({ length: count }, (_, i) => clientToTableFormat(generateClient(i.toString())));
