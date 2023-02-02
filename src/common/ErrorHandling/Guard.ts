/** @format */

export interface IGuardResult {
  succeeded: boolean;
  message?: string;
}

export type IGuardProps = {
  arguement: unknown;
  arguementName: string;
};
export class Guard {
  public static guardAgainstNullOrUndefined(props: IGuardProps): IGuardResult {
    const { arguement, arguementName } = props;
    if (arguement === null || arguement === undefined) {
      return {
        succeeded: false,
        message: `Invalid ${arguementName} value`,
      };
    }
    return {
      succeeded: true,
    };
  }

  public static guardAgainstNullOrUndefinedBulk(
    args: IGuardProps[]
  ): IGuardResult {
    for (let arg of args) {
      const result = this.guardAgainstNullOrUndefined(arg);
      if (!result.succeeded) return result;
    }
    return { succeeded: true };
  }
}
