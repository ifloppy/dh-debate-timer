
export enum ProcedureType {
    Speech = 0,
    FreeDebate = 1,
}

export type ProcedureItem = {
    name: string;
    duration: number; // 以秒计
    type: ProcedureType;
}

export type DebateModelNormalized = {
    name: string;
    organizer: string;
    /** 正方阵营名 */
    affirmative: string;
    /** 反方阵营名 */
    negative: string;
    /** 正方队伍名 */
    affirmativeName: string;
    /** 反方队伍名 */
    negativeName: string;
    procedure: ProcedureItem[];
}

