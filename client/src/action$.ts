import { Subject } from 'rxjs';
import { Song } from './library'

interface Action { type: string; song?: Song }

export default new Subject<Action>();
