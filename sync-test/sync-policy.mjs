// DX Start optional sync policy – test-only, no live-app changes.
// A user may log without Google. Cloud integration is opt-in per device.
export const DEFAULT_SETTINGS=Object.freeze({cloudEnabled:false,autoSync:false,provider:'none'});
export function resolveSettings(input={}){
 return {
  cloudEnabled:input.cloudEnabled===true,
  autoSync:input.cloudEnabled===true&&input.autoSync===true,
  provider:input.cloudEnabled===true&&input.provider==='google'?'google':'none'
 };
}
export function syncAllowed(settings,{online,authenticated,visible}){
 const s=resolveSettings(settings);
 return s.cloudEnabled&&s.autoSync&&s.provider==='google'&&online===true&&authenticated===true&&visible===true;
}
export function statusMessage(settings,environment){
 const s=resolveSettings(settings);
 if(!s.cloudEnabled)return 'Lokal loggbok – Google Drive är frivilligt och frånkopplat.';
 if(!environment.authenticated)return 'Google Drive är valt men kräver inloggning.';
 if(!environment.online)return 'Offline – loggar sparas lokalt; synkronisering väntar.';
 if(!environment.visible)return 'Synkronisering väntar tills programmet är öppet.';
 return s.autoSync?'Automatisk synkronisering kan köras.':'Manuell synkronisering vald.';
}
