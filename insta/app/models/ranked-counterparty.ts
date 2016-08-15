import { Counterparty } from './counterparty';

export class RankedCounterparty
        extends Counterparty {
    level: number;
    parentId: number;
}