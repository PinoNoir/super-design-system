import 'react';

declare module 'react' {
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
