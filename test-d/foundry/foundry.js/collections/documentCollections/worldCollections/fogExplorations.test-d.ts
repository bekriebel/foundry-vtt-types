import { expectType } from 'tsd';

const fogExplorations = new FogExplorations();
expectType<StoredDocument<FogExploration>>(fogExplorations.get('', { strict: true }));
expectType<StoredDocument<FogExploration>['data']['_source'][]>(fogExplorations.toJSON());
expectType<null | SidebarDirectory<'FogExploration'> | undefined>(fogExplorations.directory);
