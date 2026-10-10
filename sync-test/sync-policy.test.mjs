import {DEFAULT_SETTINGS,resolveSettings,syncAllowed,statusMessage} from './sync-policy.mjs';
import assert from 'node:assert/strict';
assert.equal(DEFAULT_SETTINGS.cloudEnabled,false);
assert.deepEqual(resolveSettings({}),{cloudEnabled:false,autoSync:false,provider:'none'});
assert.equal(syncAllowed({cloudEnabled:false,autoSync:true,provider:'google'},{online:true,authenticated:true,visible:true}),false);
assert.equal(syncAllowed({cloudEnabled:true,autoSync:true,provider:'google'},{online:true,authenticated:true,visible:true}),true);
assert.equal(syncAllowed({cloudEnabled:true,autoSync:true,provider:'google'},{online:false,authenticated:true,visible:true}),false);
assert.match(statusMessage({},{}),/frivilligt/);
console.log('6 tester godkända');
