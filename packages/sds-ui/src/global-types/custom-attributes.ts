import 'react';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- must match React's own HTMLAttributes<T> signature exactly for declaration merging to work
  interface HTMLAttributes<T> {
    'automation-id'?: string;
  }
}

export interface CustomAttributes {
  /**Automation Id used for automated regression testing */
  automationId?: string;

  /**Automation Id prefix used for appending to components that manage 'lists' of children components */
  automationIdPrefix?: string;
}
