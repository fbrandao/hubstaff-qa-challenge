export type ReadinessCheck =
  | {
      description: string;
      check: () => Promise<boolean>;
    }
  | {
      description: string;
      assertion: () => Promise<void>;
    };
