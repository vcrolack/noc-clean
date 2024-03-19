import { LogEntity, LogEntityOptions, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";

interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = (( error: string ) => void) | undefined;


export class CheckService implements CheckServiceUseCase {

  private name = 'check-service.ts';

  constructor(
    private readonly logRepository: LogRepository,
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback,
  ) {}

  async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);

      if (!req.ok) throw new Error(`Error on check service ${url}`);

      const options: LogEntityOptions = {
        message: `Service ${url} working`,
        level: LogSeverityLevel.low,
        origin: this.name,
      }

      const log = new LogEntity( options );
      this.logRepository.saveLog( log );
      this.successCallback && this.successCallback();

      return true;

    } catch(error) {
      const errorMessage = `${ url } is not ok. ${ error }`;

      const errorOptions: LogEntityOptions = {
        message: errorMessage,
        level: LogSeverityLevel.high,
        origin: this.name,
      }

      const log = new LogEntity( errorOptions );
      this.logRepository.saveLog( log )
      this.errorCallback && this.errorCallback( errorMessage );
      return false;
    }
  }
}

