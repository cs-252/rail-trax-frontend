import { Pipe, PipeTransform } from '@angular/core';
import * as dateformat from 'Dateformat';

/**
 * Generated class for the DateFormatterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateFormatter',
})
export class DateFormatterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value) {
    return dateformat(value.seconds*1000, "dd-mm-yy");
  }
}
