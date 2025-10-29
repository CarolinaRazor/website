import * as migration_20251008_233253_initial_migration from './20251008_233253_initial_migration';
import * as migration_20251029_145337_add_author_create_hook from './20251029_145337_add_author_create_hook';

export const migrations = [
  {
    up: migration_20251008_233253_initial_migration.up,
    down: migration_20251008_233253_initial_migration.down,
    name: '20251008_233253_initial_migration',
  },
  {
    up: migration_20251029_145337_add_author_create_hook.up,
    down: migration_20251029_145337_add_author_create_hook.down,
    name: '20251029_145337_add_author_create_hook'
  },
];
