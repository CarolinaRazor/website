import * as migration_20251008_233253_initial_migration from './20251008_233253_initial_migration';

export const migrations = [
  {
    up: migration_20251008_233253_initial_migration.up,
    down: migration_20251008_233253_initial_migration.down,
    name: '20251008_233253_initial_migration'
  },
];
