export type ReadinessCheck =
  | {
      type: 'check';
      description: string;
      check: () => Promise<boolean>;
    }
  | {
      type: 'assertion';
      description: string;
      assertion: () => Promise<void>;
    };
