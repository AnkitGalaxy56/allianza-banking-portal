import { moduleConfig as locker, sampleRequest as lockerSample, sampleRequests as lockerSamples } from '../locker-application/data';
import { moduleConfig as standing, sampleRequest as standingSample, sampleRequests as standingSamples } from '../standing-instructions/data';
import { moduleConfig as loan, sampleRequest as loanSample, sampleRequests as loanSamples } from '../fresh-loan-application/data';
import { moduleConfig as emi, sampleRequest as emiSample, sampleRequests as emiSamples } from '../loan-emi-payment/data';
import { requiredFields as lockerRequired } from '../locker-application/schema';
import { requiredFields as standingRequired } from '../standing-instructions/schema';
import { requiredFields as loanRequired } from '../fresh-loan-application/schema';
import { requiredFields as emiRequired } from '../loan-emi-payment/schema';
export function getModuleConfig(path:string): any { if(path.endsWith('/locker-application')) return locker; if(path.endsWith('/standing-instructions')) return standing; if(path.endsWith('/fresh-loan-application')) return loan; return emi; }
export function getSample(path:string): any { if(path.endsWith('/locker-application')) return lockerSample; if(path.endsWith('/standing-instructions')) return standingSample; if(path.endsWith('/fresh-loan-application')) return loanSample; return emiSample; }
export function getRequiredFields(path:string): readonly string[] { if(path.endsWith('/locker-application')) return lockerRequired; if(path.endsWith('/standing-instructions')) return standingRequired; if(path.endsWith('/fresh-loan-application')) return loanRequired; return emiRequired; }

export function getSampleRows(path:string): any[] { if(path.endsWith('/locker-application')) return lockerSamples; if(path.endsWith('/standing-instructions')) return standingSamples; if(path.endsWith('/fresh-loan-application')) return loanSamples; return emiSamples; }
