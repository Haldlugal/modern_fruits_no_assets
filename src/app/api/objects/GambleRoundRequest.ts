class GambleRoundRequest {
  roundId: number;
  value: GambleValues;

  constructor(roundId: number, value: GambleValues) {
    this.roundId = roundId;
    this.value = value;
  }

  getData(): { [key: string]: any; } {
    return {
      'round_id': this.roundId,
      'val': this.value
    };
  }
}

enum GambleValues {
    NO_BET = 0,
    RED = 1,
    BLACK = 2,
    FIRST_SYM = 3,
    SECOND_SYM = 4,
    THIRD_SYM = 5,
    FORTH_SYM = 6
}
