type DeadlineStatus = 'pending' | 'completed' | 'overdue';

interface Case {
  id: number;
  name: string;
  docketNumber: string;
  attorney: string;
}

interface Deadline {
  id: string;
  status: DeadlineStatus;
  quantity: number;
}

interface DeadlineResponse {
  deadlines: Deadline[];
  descriptions: Record<string, string>;
}

// Mock data - using let instead of const to allow mutations
let mockCases: Case[] = [
  { id: 1, name: 'John Doe', docketNumber: '12345', attorney: 'Jane Smith' },
  { id: 2, name: 'Jane Smith', docketNumber: '12345', attorney: 'Jane Smith' },
  { id: 3, name: 'Bob Johnson', docketNumber: '12345', attorney: 'Jane Smith' },
];

let mockDeadlines: Deadline[] = [
  { id: '1', status: 'pending', quantity: 5 },
  { id: '2', status: 'completed', quantity: 12 },
  { id: '3', status: 'overdue', quantity: 7 },
  { id: '4', status: 'pending', quantity: 3 },
];

let mockDescriptions: Record<string, string> = {
  '1': 'Review client documents',
  '2': 'Complete case filing',
  '3': 'Submit response to court',
  '4': 'Schedule client meeting',
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Case-related API calls
  getCases: async () => {
    await delay(100); // Simulate network delay
    return [...mockCases];
  },

  getCase: async (id: number) => {
    await delay(200);
    const caseItem = mockCases.find((caseItem) => caseItem.id === id);
    if (!caseItem) throw new Error('Case not found');
    return { ...caseItem };
  },

  createCase: async (caseData: { name: string; docketNumber: string; attorney: string }) => {
    await delay(200);
    const newCase = {
      id: mockCases.length + 1,
      ...caseData,
    };
    mockCases.push(newCase);
    return { ...newCase };
  },

  updateCase: async (id: number, updates: Partial<Case>) => {
    await delay(100);
    const index = mockCases.findIndex((caseItem) => caseItem.id === id);
    if (index === -1) throw new Error('Case not found');

    // Type-safe way to update the case
    const currentCase = mockCases[index];
    if (!currentCase) throw new Error('Case not found');

    // Apply updates individually, ensuring required properties remain
    mockCases[index] = {
      id: currentCase.id, // Keep original ID
      name: updates.name ?? currentCase.name,
      docketNumber: updates.docketNumber ?? currentCase.docketNumber,
      attorney: updates.attorney ?? currentCase.attorney,
    };

    return { ...mockCases[index] };
  },

  deleteCase: async (id: number) => {
    await delay(100);
    const index = mockCases.findIndex((caseItem) => caseItem.id === id);
    if (index === -1) throw new Error('Case not found');

    mockCases.splice(index, 1);
    return { success: true };
  },

  // Deadline-related API calls
  getDeadlines: async (): Promise<DeadlineResponse> => {
    await delay(150);
    return {
      deadlines: [...mockDeadlines],
      descriptions: { ...mockDescriptions },
    };
  },

  getDeadlineById: async (id: string) => {
    await delay(120);
    const deadline = mockDeadlines.find((deadline) => deadline.id === id);
    if (!deadline) throw new Error('Deadline not found');

    return {
      ...deadline,
      description: mockDescriptions[id] || 'No description available',
    };
  },

  updateDeadlineStatus: async (id: string, newStatus: DeadlineStatus) => {
    await delay(150);
    const index = mockDeadlines.findIndex((deadline) => deadline.id === id);
    if (index === -1) throw new Error('Deadline not found');

    // Create a new object with updated status
    if (!mockDeadlines[index]) throw new Error('Deadline not found');
    mockDeadlines[index] = {
      ...mockDeadlines[index],
      status: newStatus,
      id: mockDeadlines[index].id, // Ensure id remains unchanged
      quantity: mockDeadlines[index].quantity, // Ensure quantity remains unchanged
    };

    return { ...mockDeadlines[index] };
  },

  createDeadline: async (deadlineData: { status: DeadlineStatus; quantity: number; description?: string }) => {
    await delay(180);
    // Safety check for empty array case
    const maxId = mockDeadlines.length > 0 ? Math.max(...mockDeadlines.map((d) => Number(d.id))) : 0;
    const newId = String(maxId + 1);

    const newDeadline: Deadline = {
      id: newId,
      status: deadlineData.status,
      quantity: deadlineData.quantity,
    };

    mockDeadlines.push(newDeadline);

    if (deadlineData.description) {
      mockDescriptions[newId] = deadlineData.description;
    }

    return { ...newDeadline };
  },

  deleteDeadline: async (id: string) => {
    await delay(120);
    const index = mockDeadlines.findIndex((deadline) => deadline.id === id);
    if (index === -1) throw new Error('Deadline not found');

    mockDeadlines.splice(index, 1);
    delete mockDescriptions[id];

    return { success: true };
  },

  // For testing: reset all data to initial state
  resetData: async () => {
    await delay(100);
    mockCases = [
      { id: 1, name: 'John Doe', docketNumber: '12345', attorney: 'Jane Smith' },
      { id: 2, name: 'Jane Smith', docketNumber: '12345', attorney: 'Jane Smith' },
      { id: 3, name: 'Bob Johnson', docketNumber: '12345', attorney: 'Jane Smith' },
    ];

    mockDeadlines = [
      { id: '1', status: 'pending', quantity: 5 },
      { id: '2', status: 'completed', quantity: 12 },
      { id: '3', status: 'overdue', quantity: 7 },
      { id: '4', status: 'pending', quantity: 3 },
    ];

    mockDescriptions = {
      '1': 'Review client documents',
      '2': 'Complete case filing',
      '3': 'Submit response to court',
      '4': 'Schedule client meeting',
    };

    return { success: true };
  },

  // Combined data for dashboard purposes
  getDashboardData: async () => {
    await delay(200);
    return {
      deadlines: [...mockDeadlines],
      descriptions: { ...mockDescriptions },
      deadlineStats: {
        pending: mockDeadlines.filter((d) => d.status === 'pending').length,
        completed: mockDeadlines.filter((d) => d.status === 'completed').length,
        overdue: mockDeadlines.filter((d) => d.status === 'overdue').length,
      },
      casesCount: mockCases.length,
    };
  },
};
