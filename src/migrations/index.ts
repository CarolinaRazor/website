import * as migration_20251008_233253_initial_migration from './20251008_233253_initial_migration';
import * as migration_20251029_145337_add_author_create_hook from './20251029_145337_add_author_create_hook';
import * as migration_20251104_221113 from './20251104_221113';
import * as migration_20251107_042316 from './20251107_042316';
import * as migration_20251108_193951 from './20251108_193951';

export const migrations = [
  {
    up: migration_20251008_233253_initial_migration.up,
    down: migration_20251008_233253_initial_migration.down,
    name: '20251008_233253_initial_migration',
  },
  {
    up: migration_20251029_145337_add_author_create_hook.up,
    down: migration_20251029_145337_add_author_create_hook.down,
    name: '20251029_145337_add_author_create_hook',
  },
  {
    up: migration_20251104_221113.up,
    down: migration_20251104_221113.down,
    name: '20251104_221113',
  },
  {
    up: migration_20251107_042316.up,
    down: migration_20251107_042316.down,
    name: '20251107_042316',
  },
  {
    up: migration_20251108_193951.up,
    down: migration_20251108_193951.down,
    name: '20251108_193951'
  },
];
