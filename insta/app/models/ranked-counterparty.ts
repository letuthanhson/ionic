import { Counterparty } from './counterparty';

export class RankedCounterparty
        extends Counterparty {
    rank: number;
    parentId: number;
    rootId: number;
}